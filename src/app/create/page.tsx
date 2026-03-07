"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Settings, Sparkles, Loader2, Play, RefreshCw, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function CreateInterface() {
  const searchParams = useSearchParams();
  const topicParams = searchParams?.get("topic");

  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai" | "system"; content: string }[]>([]);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [params, setParams] = useState<Record<string, any>>({});
  const [paramRanges, setParamRanges] = useState<Record<string, { min: number, max: number, step: number }>>({});
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const hasInitialized = useRef(false);

  // Parse HTML and inject our listener to grab window.params
  const processHtml = (rawHtml: string) => {
    const injection = `
      <script>
        window.addEventListener('load', () => {
          if (window.params) {
            window.parent.postMessage({ type: 'INIT_PARAMS', params: window.params }, '*');
          }
        });
      </script>
    `;
    return rawHtml.replace('</body>', `${injection}</body>`);
  };

  const handleAutoGenerate = async (topic: string) => {
    setMessages([{ role: "user", content: `"${topic}" konusu ile ilgili bir simülasyon oluştur.` }]);
    setIsLoading(true);
    setLoadingStep("Blueprint oluşturuluyor...");

    try {
      // 1. Ask for Blueprint
      const enhanceRes = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const enhanceData = await enhanceRes.json();

      if (!enhanceRes.ok) {
        throw new Error(enhanceData.error || "Blueprint oluşturulamadı.");
      }

      setLoadingStep("Simülasyon kodlanıyor...");

      // 2. Generate HTML
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: enhanceData.enhancedPrompt }),
      });

      const genData = await genRes.json();

      if (genRes.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Simülasyon başarıyla oluşturuldu! Sağ tarafta önizleyebilirsiniz." },
        ]);
        const processedHtml = processHtml(genData.html);
        setHtmlContent(processedHtml);
      } else {
        throw new Error(genData.error || "Simülasyon üretilemedi.");
      }

    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `Hata: ${error.message}` },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  useEffect(() => {
    if (topicParams && !hasInitialized.current) {
      hasInitialized.current = true;
      handleAutoGenerate(topicParams);
    }
  }, [topicParams]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setPrompt("");
    setIsLoading(true);
    setLoadingStep("Simülasyon kodlanıyor...");

    try {
      const payloadPrompt = htmlContent
        ? `Aşağıda şu anki simülasyonun tam HTML kodu bulunuyor:\n\n\`\`\`html\n${htmlContent}\n\`\`\`\n\nKullanıcının Yeni İsteği (GÜNCELLEME): "${userMessage}"\n\nLütfen mevcut kodu bozmadan, kullanıcının bu yeni isteğine göre GÜNCELLEYEREK simülasyonun tam HTML kodunu yeniden üret.`
        : userMessage;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: payloadPrompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Simülasyon başarıyla oluşturuldu! Sağ tarafta önizleyebilirsiniz." },
        ]);
        const processedHtml = processHtml(data.html);
        setHtmlContent(processedHtml);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: `Hata: ${data.error}` },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sunucuya bağlanırken bir hata oluştu." },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "INIT_PARAMS") {
        setParams(event.data.params);
        const ranges: Record<string, { min: number, max: number, step: number }> = {};
        Object.entries(event.data.params).forEach(([key, val]) => {
          if (typeof val === 'number') {
            const abs = Math.abs(val as number);
            if (abs === 0) ranges[key] = { min: 0, max: 100, step: 1 };
            else if ((val as number) < 0) ranges[key] = { min: (val as number) * 3, max: 0, step: abs / 50 };
            else ranges[key] = { min: 0, max: (val as number) * 3, step: abs / 50 };
          }
        });
        setParamRanges(ranges);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleParamChange = (key: string, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value }));
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_PARAM", key, value },
        "*"
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
      <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            SimLab Studio
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="px-4 py-2 text-sm font-medium bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            Galeriye Dön
          </Link>
          <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            Yayınla
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sol Panel: Sohbet Arayüzü */}
        <aside className="w-[400px] flex flex-col bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 shadow-xl z-10 shrink-0">
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 gap-3 opacity-60">
                <Sparkles className="w-12 h-12 text-blue-400" />
                <p>Simülasyon fikrinizi buraya yazın.</p>
                <p className="text-sm">Örn: "Bir elektrik devresi çiz, pil ve lamba olsun."</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[90%] text-sm ${msg.role === "user"
                    ? "bg-blue-600 text-white self-end rounded-tr-sm shadow-md shadow-blue-500/10"
                    : msg.role === "system"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-100 self-start rounded-tl-sm border border-emerald-200 dark:border-emerald-800 whitespace-pre-wrap font-mono text-[11px]"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 self-start rounded-tl-sm border border-neutral-200 dark:border-neutral-700"
                    }`}
                >
                  {msg.role === "system" && <div className="font-bold mb-2 flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-4 h-4" /> YAPAY ZEKA MİMARISI</div>}
                  {msg.content}
                </div>
              ))
            )}
            {isLoading && (
              <div className="self-start text-blue-500 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-2xl rounded-tl-sm border border-blue-100 dark:border-blue-800/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">{loadingStep}</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                placeholder="EK GÜNCELLEME İSTEMİ: Rengi mavi yap, vs..."
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-[80px] transition-all"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-2 bottom-2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[11px] text-neutral-400 mt-2 text-center font-medium">
              Gemini 2.5 Pro Modeli Kullanılmaktadır
            </div>
          </div>
        </aside>

        {/* Sağ Panel: İframe ve Kontroller */}
        <section className="flex-1 flex flex-col relative bg-neutral-100 dark:bg-neutral-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="flex-1 p-6 flex flex-col min-h-0">
            <div className="w-full flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Canlı Önizleme</span>
              </div>
              <button
                onClick={() => {
                  if (htmlContent) {
                    const temp = htmlContent;
                    setHtmlContent(null);
                    setTimeout(() => setHtmlContent(temp), 50);
                  }
                }}
                className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                title="Yenile"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 w-full bg-white dark:bg-black rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden relative min-h-0">
              {htmlContent ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  className="w-full h-full border-0"
                  title="Simulation Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full text-neutral-400 dark:text-neutral-600 gap-4">
                  <Play className="w-16 h-16 opacity-30" />
                  <p className="font-medium">Henüz bir simülasyon üretilmedi</p>
                </div>
              )}
            </div>
          </div>

          {/* Kontrol Paneli (Alt Kısım) */}
          <div className="h-48 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-200/50 dark:border-neutral-800/50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] p-6 z-10 flex flex-col shrink-0">
            <div className="flex items-center gap-2 mb-4 shrink-0">
              <Settings className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Simülasyon Kontrolleri</h2>
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full ml-2 font-medium">Otomatik Algılanan Değişkenler</span>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden flex gap-6 pb-2 items-center">
              {Object.keys(params).length > 0 ? (
                Object.entries(params).map(([key, value]) => (
                  <div key={key} className="flex-shrink-0 w-64 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{key}</label>
                      <span className="text-sm font-mono bg-white dark:bg-black px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 truncate max-w-[80px]">
                        {typeof value === 'boolean' ? (value ? 'Açık' : 'Kapalı') : value}
                      </span>
                    </div>
                    {typeof value === "number" ? (
                      <input
                        type="range"
                        min={paramRanges[key]?.min ?? 0}
                        max={paramRanges[key]?.max ?? 100}
                        step={paramRanges[key]?.step ?? 1}
                        value={value}
                        onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                        className="w-full accent-blue-600 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer"
                      />
                    ) : typeof value === "boolean" ? (
                      <button
                        onClick={() => handleParamChange(key, !value)}
                        className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${value
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                          }`}
                      >
                        {value ? "Aktif (Açık)" : "Pasif (Kapalı)"}
                      </button>
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleParamChange(key, e.target.value)}
                        className="w-full bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 gap-2 opacity-50">
                  <Cpu className="w-8 h-8" />
                  <p className="text-sm font-medium">Değişken algılanamadı (window.params aranıyor...)</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CreateSimulation() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-neutral-50 dark:bg-neutral-900 text-neutral-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <CreateInterface />
    </Suspense>
  );
}
