import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Cpu, Database, Network, Combine, Star, Search, CheckCircle2 } from 'lucide-react';

const scenes = [
  {
    id: 1,
    title: "Step 1: The User Input",
    detail: "A user types a semantic query like 'peaceful place to sleep'.",
    icon: <User className="w-8 h-10" />,
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Step 2: Neural Processing",
    detail: "The AI 'Brain' converts text into a mathematical vector (numbers).",
    icon: <Cpu className="w-10 h-10" />,
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Step 3: Dual Engine Search",
    detail: "Neural Search (Meaning) runs alongside Keyword Search (Exact Words).",
    icon: <Network className="w-10 h-10" />,
    color: "bg-indigo-500"
  },
  {
    id: 4,
    title: "Step 4: Hybrid Fusion",
    detail: "Results are mixed using our 70/20/10 Hybrid Ranking algorithm.",
    icon: <Combine className="w-10 h-10" />,
    color: "bg-pink-500"
  },
  {
    id: 5,
    title: "Step 5: Magic Discovery!",
    detail: "The most relevant #1 spot is presented to the traveler.",
    icon: <Star className="w-10 h-10" />,
    color: "bg-orange-500"
  }
];

export default function ProcessAnimation({ isOpen, onClose }) {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentScene(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentScene(prev => (prev < scenes.length - 1 ? prev + 1 : prev));
    }, 4500);

    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 overflow-hidden"
        >
          <motion.div 
            className="relative w-full max-w-4xl h-[600px] bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">The Search Journey</h2>
                <div className="flex gap-1 mt-2">
                  {scenes.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= currentScene ? 'w-8 bg-indigo-500' : 'w-4 bg-white/10'}`} />
                  ))}
                </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-2xl hover:bg-white/5 transition-colors text-white/40">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Animation Stage */}
            <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentScene}
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    transition={{ duration: 0.6, type: "spring" }}
                    className="flex flex-col items-center text-center"
                  >
                    {/* Scene Visuals */}
                    <div className="relative mb-12">
                      <motion.div 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className={`w-32 h-32 rounded-full ${scenes[currentScene].color} flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 relative`}
                      >
                         {scenes[currentScene].icon}
                      </motion.div>
                      
                      {/* Decorative elements based on scene */}
                      {currentScene === 0 && (
                        <motion.div 
                          className="absolute -bottom-4 -right-8 glass p-3 rounded-xl border border-white/10 text-[10px] font-mono text-white/50"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        >
                          "peaceful place..."
                        </motion.div>
                      )}

                      {currentScene === 1 && (
                        <div className="absolute inset-[-40px] border-2 border-dashed border-purple-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                      )}

                      {currentScene > 0 && (
                        <motion.div 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          className="absolute -left-20 top-1/2 -translate-y-1/2 hidden md:block"
                        >
                           <Search className="w-10 h-10 text-white/5 opacity-20" />
                        </motion.div>
                      )}
                    </div>

                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter">
                      {scenes[currentScene].title}
                    </h3>
                    <p className="text-white/50 text-xl max-w-lg leading-relaxed font-medium">
                      {scenes[currentScene].detail}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Background "Data Stream" particles */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      initial={{ 
                        x: Math.random() * 800, 
                        y: Math.random() * 600,
                        opacity: 0
                      }}
                      animate={{ 
                        y: [null, -100],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ 
                        duration: 3 + Math.random() * 2, 
                        repeat: Infinity,
                        delay: Math.random() * 5
                      }}
                    />
                  ))}
                </div>
            </div>

            {/* Footer / Controls */}
            <div className="p-8 flex items-center justify-between bg-white/5 backdrop-blur-md">
                <div className="flex gap-4">
                   <button 
                    disabled={currentScene === 0}
                    onClick={() => setCurrentScene(prev => prev - 1)}
                    className="px-6 py-2 rounded-xl border border-white/10 text-white/40 disabled:opacity-0 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
                   >
                     Prev
                   </button>
                   <button 
                    disabled={currentScene === scenes.length - 1}
                    onClick={() => setCurrentScene(prev => prev + 1)}
                    className="px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-sm font-bold uppercase tracking-widest"
                   >
                     Next
                   </button>
                </div>

                {currentScene === scenes.length - 1 ? (
                  <motion.button
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={onClose}
                    className="px-10 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-500/20"
                  >
                    Start Exploring
                  </motion.button>
                ) : (
                   <span className="text-white/20 text-xs font-mono uppercase tracking-[0.2em]">
                     AI Pipeline Simulation v1.0
                   </span>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
