import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DynamicControl {
    id: string;
    name: string;
    min: number;
    max: number;
    defaultValue: number;
    step: number;
    unit: string;
}

export interface SceneConfig {
    htmlCode: string;
    controls: DynamicControl[];
}

export interface Simulation {
    id: string;
    title: string;
    prompt: string;
    createdAt: string;
    thumbnailUrl: string;
    config?: SceneConfig;
    modelId: string;
}

interface SimulationState {
    simulations: Simulation[];
    addSimulation: (sim: Simulation) => void;
    removeSimulation: (id: string) => void;
    updateSimulationConfig: (id: string, config: SceneConfig) => void;
}

export const useSimulationStore = create<SimulationState>()(
    persist(
        (set) => ({
            simulations: [],
            addSimulation: (sim) => set((state) => ({ simulations: [sim, ...state.simulations] })),
            removeSimulation: (id) => set((state) => ({ simulations: state.simulations.filter(s => s.id !== id) })),
            updateSimulationConfig: (id, config) => set((state) => ({
                simulations: state.simulations.map(s => s.id === id ? { ...s, config } : s)
            })),
        }),
        {
            name: 'simlab-storage',
        }
    )
);
