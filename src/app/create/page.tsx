"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSimulationStore } from "../../store/simulationStore";
import { Sparkles, ArrowRight, Wand2, Zap, Box, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function CreateSimulation() {
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const addSimulation = useSimulationStore((state) => state.addSimulation);

    const presets = [
        { id: 'physics', label: '⚖️ Newton: 2. Hareket Yasası', prompt: "Newton'un 2. yasasını gösteren, yatay düzlemde bir araba simülasyonu. Kuvvet ve hız vektörleri (oklar) dinamik olarak görülsün. Kullanıcı 'Kuvvet' ve 'Kütle' değerlerini slider üzerinden değiştirebilir." },
        { id: 'solar', label: '🪐 Güneş Sistemi: Yörüngeler', prompt: "Güneş'in etrafındaki gezegen yörüngelerini gösteren, Kepler yasalarına uygun bir astronomi simülasyonu. Kullanıcı 'Zaman Hızı' parametresini kontrol edebilir." },
        { id: 'electric', label: '⚡ Elektrik: Ohm Kanunu', prompt: "Bir direnç üzerinden geçen akımı ve gerilimi gösteren 3D devre simülasyonu. Voltaj ve Direnç sliderlar ile değiştirilebilmeli, akım şiddeti görselleştirilmeli." }
    ];

    const handleCreate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        const newId = `sim-${Date.now()}`;
        addSimulation({
            id: newId,
            title: prompt.split(" ").slice(0, 3).join(" ") + " Lab",
            prompt,
            createdAt: new Date().toISOString(),
            thumbnailUrl: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
            modelId: 'gemini-2.0-flash'
        });

        router.push(`/preview/${newId}`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[200px] pointer-events-none" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl bg-neutral-900/40 backdrop-blur-3xl border border-white/5 p-12 rounded-[3.5rem] shadow-2xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div>
                        <div className="flex items-center gap-4 mb-6 text-teal-400">
                            <Wand2 className="w-10 h-10" />
                            <h1 className="text-4xl font-black">Ne Keşfetmek İstersin?</h1>
                        </div>
                        <p className="text-neutral-500 text-lg mb-12 leading-relaxed">Bir fizik yasası, astronomik olay veya kimyasal bir tepkime... SimLab senin için 3D interaktif bir lab inşa etsin.</p>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 block mb-4">Hızlı Başlangıç</label>
                            {presets.map((p) => (
                                <button key={p.id} onClick={() => setPrompt(p.prompt)} className="w-full p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-left hover:bg-white/[0.06] transition-all group flex items-start gap-4 hover:border-teal-500/20">
                                    <div className="p-3 bg-neutral-950 rounded-xl group-hover:scale-110 transition-transform"><Zap className="w-5 h-5 text-teal-500" /></div>
                                    <div>
                                        <div className="font-bold mb-1 text-neutral-200 group-hover:text-white transition-colors">{p.label}</div>
                                        <div className="text-xs text-neutral-600 line-clamp-1">{p.prompt}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 justify-center">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-500 rounded-[2.5rem] blur opacity-10" />
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Örn: Newton'un 2. yasasını gösteren bir lab..."
                                className="relative w-full h-[400px] bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 text-xl text-white outline-none resize-none focus:border-white/20 transition-all placeholder:text-neutral-700 leading-relaxed overflow-hidden"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            disabled={!prompt.trim() || isGenerating}
                            className="group flex flex-col items-center justify-center p-10 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4">
                                <Sparkles className="w-6 h-6" />
                                <span>Simülasyon Kur</span>
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
