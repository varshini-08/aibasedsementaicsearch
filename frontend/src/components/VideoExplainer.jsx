import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Cpu, Database, Network, Combine, Search, Star, Smile, Laptop } from 'lucide-react';

const scenes = [
  {
    id: 1,
    title: "The Vacation Struggle",
    description: "Finding the perfect vacation place is difficult...",
    visual: "mascot_stressed",
    textPosition: "bottom"
  },
  {
    id: 2,
    title: "User Intent",
    description: "I feel stressed I need a peaceful place to relax in nature",
    visual: "typing",
    textPosition: "bottom"
  },
  {
    id: 3,
    title: "System Entry",
    description: "Query flows into our AI Search Engine pipeline.",
    visual: "pipeline_entry",
    textPosition: "top"
  },
  {
    id: 4,
    title: "Text Preprocessing",
    description: "Cleaning characters and breaking words into tokens.",
    visual: "preprocessing",
    textPosition: "top"
  },
  {
    id: 5,
    title: "Sentence Embeddings",
    description: "AI Brain transforms text into numeric vectors (AI Brain).",
    visual: "embeddings",
    textPosition: "top"
  },
  {
    id: 6,
    title: "Semantic Match (FAISS)",
    description: "Finding 'Nearest Neighbors' in a high-dimensional vector space.",
    visual: "faiss",
    textPosition: "top"
  },
  {
    id: 7,
    title: "Keyword Match (FTS5)",
    description: "Parallel classic keyword search for exact terminology.",
    visual: "keyword",
    textPosition: "top"
  },
  {
    id: 8,
    title: "Hybrid Fusion",
    description: "Combining 0.7*Semantic + 0.2*Keyword scores.",
    visual: "hybrid",
    textPosition: "top"
  },
  {
    id: 9,
    title: "Context-Aware Boost",
    description: "Boosting Nature & Relax categories for this specific query.",
    visual: "context",
    textPosition: "top"
  },
  {
    id: 10,
    title: "Final Discovery",
    description: "Presenting the best matches: Ooty, Valparai, Papanasam...",
    visual: "results",
    textPosition: "top"
  },
  {
    id: 11,
    title: "Perfect Match!",
    description: "The traveler is happy and ready for the journey.",
    visual: "mascot_happy",
    textPosition: "bottom"
  },
  {
    id: 12,
    title: "Project Summary",
    description: "Smart AI Search using Hybrid Semantic Technology.",
    visual: "summary",
    textPosition: "center"
  }
];

export default function VideoExplainer({ isOpen, onClose }) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying || !isOpen) return;
    
    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, 6000); // 6 seconds per scene

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying, isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-950/20 via-black to-purple-950/20" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Header Controls */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs font-mono uppercase tracking-[0.4em]">Explainer Video v1.2</span>
            <div className="h-[2px] w-24 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
        <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 transition-all group">
            <X className="w-6 h-6 text-white/40 group-hover:text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main Screen */}
      <div className="relative w-full max-w-6xl aspect-video bg-[#050505] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex-1 flex flex-col items-center justify-center relative p-12"
          >
            {/* Visual Logic Layer */}
            <div className="flex-1 w-full flex items-center justify-center mb-8">
              {/* Scene Specific Visuals */}
              {scenes[currentScene].visual === "mascot_stressed" && (
                <div className="relative">
                  <motion.img 
                    src="/mascot.png" 
                    className="h-64 object-contain"
                    style={{ clipPath: 'inset(0 50% 0 0)' }} // Stressed is left side
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -top-12 -right-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold italic"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  >
                    Too much stress!
                  </motion.div>
                </div>
              )}

              {scenes[currentScene].visual === "typing" && (
                <div className="relative flex flex-col items-center">
                  <Laptop className="w-32 h-32 text-indigo-500 mb-8" />
                  <motion.div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xl font-mono text-indigo-400">
                    {scenes[currentScene].description}
                    <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>|</motion.span>
                  </motion.div>
                </div>
              )}

              {scenes[currentScene].visual === "embeddings" && (
                <div className="flex items-center gap-12">
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-white font-mono">"Peaceful"</div>
                  <ChevronRight className="w-8 h-8 text-white/20" />
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(12)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="w-12 h-8 bg-indigo-500/20 rounded-md border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-mono"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {Math.random().toFixed(2)}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {scenes[currentScene].visual === "faiss" && (
                <div className="relative w-64 h-64 border border-indigo-500/20 rounded-full flex items-center justify-center">
                    <motion.div className="absolute w-4 h-4 bg-indigo-500 rounded-full shadow-[0_0_20px_indigo]" />
                    {[...Array(30)].map((_, i) => (
                         <div 
                            key={i} 
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{ 
                                left: `${50 + Math.cos(i) * 45}%`, 
                                top: `${50 + Math.sin(i * 1.5) * 45}%` 
                            }}
                        />
                    ))}
                    <motion.div 
                        className="absolute inset-0 border border-indigo-500/40 rounded-full animate-ping"
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
              )}

              {scenes[currentScene].visual === "results" && (
                <div className="grid grid-cols-3 gap-6">
                  {['Ooty', 'Valparai', 'Papanasam'].map((name, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.2 }}
                      className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center"
                    >
                      <Star className="w-8 h-8 text-yellow-500 mb-4 mx-auto" />
                      <div className="text-xl font-bold text-white">{name}</div>
                      <div className="text-white/40 text-xs mt-2 uppercase tracking-widest font-bold">Matched!</div>
                    </motion.div>
                  ))}
                </div>
              )}

              {scenes[currentScene].visual === "mascot_happy" && (
                <div className="relative">
                  <motion.img 
                    src="/mascot.png" 
                    className="h-64 object-contain"
                    style={{ clipPath: 'inset(0 0 0 50%)' }} // Happy is right side
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Smile className="absolute -top-12 -left-8 w-16 h-16 text-green-500" />
                </div>
              )}

              {/* Default Icon Display for abstract steps */}
              {!["mascot_stressed", "typing", "embeddings", "faiss", "results", "mascot_happy"].includes(scenes[currentScene].visual) && (
                <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10 shadow-inner">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        {currentScene === 2 && <Database className="w-32 h-32 text-indigo-400" />}
                        {currentScene === 3 && <Search className="w-32 h-32 text-purple-400" />}
                        {currentScene === 6 && <Network className="w-32 h-32 text-blue-400" />}
                        {currentScene === 7 && <Combine className="w-32 h-32 text-pink-400" />}
                        {currentScene === 8 && <Cpu className="w-32 h-32 text-orange-400" />}
                        {currentScene === 11 && <Star className="w-32 h-32 text-yellow-400" />}
                    </motion.div>
                </div>
              )}
            </div>

            {/* Text Overlay */}
            <div className={`w-full max-w-3xl text-center z-10 ${scenes[currentScene].textPosition === "top" ? "order-first mb-12" : "mt-auto"}`}>
               <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                key={`text-${currentScene}`}
                className="space-y-4"
               >
                 <span className="px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
                   SCENE {currentScene + 1}
                 </span>
                 <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-xl overflow-hidden">
                    {scenes[currentScene].title}
                 </h1>
                 <p className="text-white/50 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                   {scenes[currentScene].description}
                 </p>
               </motion.div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Playback Controls */}
        <div className="p-8 bg-white/5 backdrop-blur-3xl flex items-center justify-between border-t border-white/5">
            <div className="flex gap-4">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black translate-x-0.5" />}
                </button>
                <button 
                  onClick={() => { setCurrentScene(0); setIsPlaying(true); }}
                  className="w-12 h-12 rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-white/5 transition-all"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-6">
                <button 
                  disabled={currentScene === 0}
                  onClick={() => { setCurrentScene(prev => prev - 1); setIsPlaying(false); }}
                  className="p-2 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                <div className="flex gap-1">
                    {scenes.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentScene ? 'w-6 bg-indigo-500' : 'bg-white/10'}`} />
                    ))}
                </div>
                <button 
                  disabled={currentScene === scenes.length - 1}
                  onClick={() => { setCurrentScene(prev => prev + 1); setIsPlaying(false); }}
                  className="p-2 text-white/40 hover:text-white disabled:opacity-0 transition-colors"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
            >
                Return to App
            </button>
        </div>
      </div>
    </motion.div>
  );
}
