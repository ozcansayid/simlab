"use client";
import Link from "next/link";
import { Plus, Play, Sparkles, Trash2, Box } from "lucide-react";
import { useSimulationStore } from "../store/simulationStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const simulations = useSimulationStore((state) => state.simulations);
  const removeSimulation = useSimulationStore((state) => state.removeSimulation);

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-16 max-w-7xl mx-auto flex flex-col gap-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-indigo-500 to-emerald-500 mb-2">
            SimLab
          </h1>
          <p className="text-neutral-500 font-medium tracking-wide">3D Bilimsel Simülasyon ve Eğitim Platformu</p>
        </div>

        <Link
          href="/create"
          className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Lab Oluştur</span>
        </Link>
      </header>

      <main>
        <div className="flex items-center gap-3 mb-8">
          <Box className="w-6 h-6 text-teal-500" />
          <h2 className="text-xl font-bold text-neutral-200">Laboratuvarlarım</h2>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-neutral-500">{simulations.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {simulations.map((sim) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={sim.id}
                className="group relative bg-neutral-900/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-teal-500/20 transition-all duration-500"
              >
                <div className={`h-48 w-full ${sim.thumbnailUrl} relative`}>
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-4">
                    <Link href={`/preview/${sim.id}`} className="bg-white text-black p-4 rounded-2xl hover:scale-110 transition-transform font-bold px-8 flex items-center gap-2">
                      <Play className="w-5 h-5 fill-current" /> Başlat
                    </Link>
                    <button onClick={() => removeSimulation(sim.id)} className="bg-red-500/20 text-red-400 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {!sim.config && (
                    <div className="absolute top-6 left-6 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 px-3 py-1 rounded-full text-[10px] font-black text-teal-300">
                      İNŞA EDİLECEK
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-white mb-2 truncate">{sim.title}</h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed mb-6">{sim.prompt}</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-6">
                    <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
                      {new Date(sim.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <Link href={`/preview/${sim.id}`} className="text-xs font-bold text-teal-500 hover:underline">AÇ</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Link href="/create" className="h-full min-h-[400px] border-2 border-dashed border-neutral-800 rounded-[2.5rem] flex flex-col items-center justify-center text-neutral-600 hover:text-teal-400 hover:border-teal-400/30 hover:bg-teal-400/5 transition-all group">
            <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <span className="font-black text-lg">Yeni Lab Ekle</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
