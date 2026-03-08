"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, PlayCircle, Eye, Beaker, Atom, Zap, X, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState("");

  const handleSubmitTopic = () => {
    if (!topic.trim()) return;
    setIsModalOpen(false);
    router.push(`/create?topic=${encodeURIComponent(topic)}`);
  };

  const publishedSimulations = [
    {
      id: 1,
      title: "Güneş Sistemi Dinamikleri",
      category: "Astronomi",
      author: "SimLab Pro",
      views: "1.2K",
      icon: <Sparkles className="w-8 h-8 text-amber-500" />,
      color: "from-amber-400/20 to-orange-500/10",
      description: "Gezegenlerin yörünge hareketlerini gerçek zamanlı olarak 60 FPS kalitesinde inceleyin.",
    },
    {
      id: 2,
      title: "Moleküler Bağlar",
      category: "Kimya",
      author: "SimLab Pro",
      views: "856",
      icon: <Atom className="w-8 h-8 text-blue-500" />,
      color: "from-blue-400/20 to-cyan-500/10",
      description: "Atom altı parçacıkların ve kovalent bağların 3 boyutlu etkileşimlerini gözlemleyin.",
    },
    {
      id: 3,
      title: "Elektrik Devresi",
      category: "Fizik",
      author: "SimLab Pro",
      views: "3.4K",
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-400/20 to-amber-500/10",
      description: "Açık ve kapalı elektrik devrelerindeki enerji akışını parçacık sistemleriyle görün.",
    },
    {
      id: 4,
      title: "Kimyasal Titrasyon",
      category: "Kimya",
      author: "SimLab Pro",
      views: "2.1K",
      icon: <Beaker className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-400/20 to-teal-500/10",
      description: "Asit-baz reaksiyonlarını ve pH değişimlerini renk indikatörleri ile interaktif öğrenin.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans selection:bg-blue-500/30 relative">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 tracking-tight">
                SimLab<span className="text-blue-600 dark:text-blue-400 font-light">Studio</span>
              </h1>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-6 py-2.5 font-semibold text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient" />
              <div className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Simülasyon Üret</span>
              </div>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tight leading-tight">
            Geleceğin Eğitimine <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
              Ön Sıradan Bak
            </span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Gerçek zamanlı render edilen, ultra-gerçekçi fizik, kimya ve biyoloji simülasyonlarını
            deneyimleyin veya Yapay Zeka desteğiyle saniyeler içinde kendi simülasyonunuzu kurgulayın.
          </p>
        </div>

        {/* Gallery Section */}
        <div className="mb-10 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-600 rounded-full" />
            Yayınlanan Simülasyonlar
          </h3>
          <div className="text-sm font-semibold text-neutral-500 hover:text-blue-600 transition-colors cursor-pointer">
            Tümünü Gör (128) &rarr;
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedSimulations.map((sim) => (
            <div
              key={sim.id}
              className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-48 bg-gradient-to-br ${sim.color} p-6 flex items-center justify-center relative`}>
                <div className="absolute top-4 right-4 bg-white/50 dark:bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 shadow-sm">
                  <Eye className="w-3 h-3" />
                  {sim.views}
                </div>
                {sim.icon}
                <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/10 dark:group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 drop-shadow-xl" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                  {sim.category}
                </div>
                <h4 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {sim.title}
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {sim.description}
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                    {sim.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-10 text-center text-sm font-medium text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-950">
        &copy; {new Date().getFullYear()} SimLab Studio. Tüm Hakları Saklıdır. | Advanced Agentic Coding EdTech Theme
      </footer>

      {/* Topic Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-950">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                Simülasyon Fikriniz
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                Hangi konuda bir simülasyon oluşturmak istiyorsunuz? Yapay zeka bu fikri anlayıp sizin için çok daha detaylı bir teknik mimari taslağa dönüştürecektir.
              </p>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Örn: 9. Sınıf hareket yasaları, sürtünmeli eğik düzlem üzerinde kayan kütle..."
                className="w-full bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-32 transition-all"
              />
            </div>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
              <button
                onClick={handleSubmitTopic}
                disabled={!topic.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md shadow-blue-600/20"
              >
                Oluşturmaya Başla
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
