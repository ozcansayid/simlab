"use client";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar({ simulationTitle, onSendMessage, isGenerating }: any) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim() || isGenerating) return;
        onSendMessage(input);
        setInput("");
    };

    return (
        <div className="w-80 h-full bg-neutral-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Simülasyon Lab</h2>
                <p className="text-white font-bold truncate">{simulationTitle}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="bg-teal-500/10 border border-teal-500/20 p-4 rounded-2xl text-xs text-teal-200 leading-relaxed">
                    <Sparkles className="w-4 h-4 mb-2" />
                    Simülasyonu değiştirmek için AI asistana komut verin. Örn: "Yerin rengini kırmızı yap"
                </div>
            </div>

            <div className="p-4 border-t border-white/5">
                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isGenerating}
                        placeholder="AI'ya komut ver..."
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white resize-none outline-none focus:border-teal-500/50 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isGenerating}
                        className="absolute bottom-3 right-3 p-2 bg-teal-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
