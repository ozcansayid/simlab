"use client";
import { use, useState, useMemo, useRef, useEffect } from "react";
import { useSimulationStore } from "../../../store/simulationStore";
import { ArrowLeft, Sparkles, Zap, Info, Wand2 } from "lucide-react";
import Link from "next/link";
import ChatSidebar from "@/components/ChatSidebar";

export default function Preview({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const simId = unwrappedParams.id;
    const simulation = useSimulationStore(state => state.simulations.find(s => s.id === simId));
    const updateSimulationConfig = useSimulationStore(state => state.updateSimulationConfig);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [controlValues, setControlValues] = useState<Record<string, number>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    if (!simulation) return <div className="h-screen bg-black flex items-center justify-center text-white/50">Simülasyon Bulunamadı</div>;

    const handleGenerate = async (msg?: string) => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: msg || simulation.prompt,
                    currentConfig: simulation.config
                })
            });
            const data = await res.json();
            if (res.ok) updateSimulationConfig(simId, data.config);
            else alert(data.error);
        } finally {
            setIsGenerating(false);
        }
    };

    const config = simulation.config;

    useMemo(() => {
        if (config?.controls && Object.keys(controlValues).length === 0) {
            const defaults: Record<string, number> = {};
            config.controls.forEach(c => defaults[c.id] = c.defaultValue);
            setControlValues(defaults);
        }
    }, [config?.controls]);

    const handleControlChange = (id: string, val: number) => {
        setControlValues(prev => ({ ...prev, [id]: val }));
        iframeRef.current?.contentWindow?.postMessage({ type: 'UPDATE_PARAM', key: id, value: val }, '*');
    };

    return (
        <div className="h-screen w-full bg-black flex overflow-hidden">
            <ChatSidebar simulationTitle={simulation.title} isGenerating={isGenerating} onSendMessage={handleGenerate} />

            <div className="flex-1 flex flex-col relative h-full">
                <header className="absolute top-0 left-0 right-0 z-30 p-6 flex justify-between items-center pointer-events-none">
                    <div className="flex items-center gap-4 pointer-events-auto">
                        <Link href="/" className="p-3 bg-neutral-900 border border-white/5 rounded-full hover:bg-neutral-800 transition-all shadow-2xl">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="bg-neutral-900/80 backdrop-blur-2xl px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                            <Sparkles className="w-4 h-4 text-teal-400" />
                            <span className="font-bold tracking-tight">{simulation.title}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-4 px-2 py-1 bg-white/5 rounded-full">Gemini 2.0 Flash</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 relative">
                    {config?.htmlCode ? (
                        <iframe ref={iframeRef} srcDoc={config.htmlCode} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 p-12">
                            <div className="max-w-md text-center space-y-8">
                                <Wand2 className={`w-16 h-16 mx-auto ${isGenerating ? 'animate-pulse text-teal-500' : 'text-neutral-800'}`} />
                                <div>
                                    <h2 className="text-2xl font-black mb-2">Motor Kurulumu Bekleniyor</h2>
                                    <p className="text-neutral-500 leading-relaxed">AI henüz bu laboratuvarın 3D motorunu inşa etmedi. Devam etmek için butona dokun.</p>
                                </div>
                                <button onClick={() => handleGenerate()} disabled={isGenerating} className="w-full bg-white text-black py-5 rounded-[2rem] font-black hover:scale-105 transition-all disabled:opacity-50">
                                    {isGenerating ? 'İnşa Ediliyor...' : 'Laboratuvarı Kur'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {config?.controls && config.controls.length > 0 && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 bg-neutral-900/60 backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] flex items-center gap-8 shadow-2xl shadow-black/50 overflow-x-auto max-w-[85%]">
                        {config.controls.map((ctrl, i) => (
                            <div key={ctrl.id} className="flex items-center gap-8">
                                <div className="w-44">
                                    <div className="flex justify-between mb-2 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                        <span>{ctrl.name}</span>
                                        <span className="text-teal-400">{controlValues[ctrl.id] ?? ctrl.defaultValue} {ctrl.unit}</span>
                                    </div>
                                    <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={controlValues[ctrl.id] ?? ctrl.defaultValue} onChange={(e) => handleControlChange(ctrl.id, parseFloat(e.target.value))} className="w-full h-1 bg-neutral-800 rounded-full appearance-none accent-teal-500 cursor-pointer" />
                                </div>
                                {i < config.controls.length - 1 && <div className="w-px h-10 bg-white/5" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
