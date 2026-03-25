import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import ResultsGrid from './components/ResultsGrid';
import api from './services/api';
import ProcessAnimation from './components/ProcessAnimation';
import VideoExplainer from './components/VideoExplainer';
import { Info, Play } from 'lucide-react';

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialState, setInitialState] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [backendReady, setBackendReady] = useState(false);
  const [wakingUp, setWakingUp] = useState(true);

  // Ping backend on load to wake Render free tier from sleep
  useEffect(() => {
    const warmUp = async () => {
      try {
        await api.health();
        setBackendReady(true);
      } catch (e) {
        // If health check fails, still allow search (backend might just be slow)
        setBackendReady(true);
      } finally {
        setWakingUp(false);
      }
    };
    warmUp();
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setInitialState(false);
    try {
      const data = await api.search(query);
      // data is now a list directly from POST /search as per specifications
      setResults(data);
    } catch (err) {
      setError("Failed to fetch results. Is the backend running?");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-12 px-4 select-none bg-[#050505] text-[#f8fafc]">
      <button 
        onClick={() => setShowVideo(true)}
        className="fixed top-8 left-8 z-40 p-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-3 text-white group shadow-lg shadow-indigo-600/20"
      >
        <Play className="w-4 h-4 fill-white" />
        <span className="text-xs font-black uppercase tracking-widest hidden md:block">Watch Video</span>
      </button>

      <VideoExplainer isOpen={showVideo} onClose={() => setShowVideo(false)} />

      {/* Backend warm-up notice */}
      {wakingUp && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono tracking-widest uppercase backdrop-blur-sm">
          ⚡ Waking up backend...
        </div>
      )}

      {/* Hero Section */}
      <motion.header 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`w-full max-w-4xl text-center mb-16 transition-all duration-700 ${initialState ? 'mt-32' : 'mt-0'}`}
      >
        <motion.h1 
          layout
          className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 drop-shadow-sm"
        >
          Explore TN
        </motion.h1>
        <motion.p 
          layout
          className="text-xl md:text-2xl text-white/60 font-medium"
        >
          AI-Powered Semantic Discovery for Tamil Nadu
        </motion.p>
      </motion.header>

      {/* Main Search Area */}
      <div className="w-full flex flex-col items-center">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {/* State Indicators */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 text-purple-400 font-bold tracking-widest uppercase text-sm mb-8"
            >
              <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              Processing Semantic Intent...
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium mb-12"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        {!initialState && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <div className="max-w-7xl mx-auto mb-8 px-4 flex items-center justify-between">
              <h2 className="text-white/40 font-bold uppercase tracking-widest text-xs">
                Top semantic matches for your journey
              </h2>
            </div>
            <ResultsGrid results={results} />
          </motion.div>
        )}

        {initialState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
             {['Hill Stations', 'Ancient Temples', 'Serene Beaches', 'Wildlife Safaris'].map((tag, i) => (
               <span key={i} className="px-5 py-2 rounded-full glass border border-white/5 text-white/40 text-xs font-bold uppercase tracking-widest">
                 {tag}
               </span>
             ))}
          </motion.div>
        )}
      </div>

      <footer className="mt-auto py-10 text-white/20 text-xs font-mono tracking-widest uppercase">
        Built with FastAPI • FAISS • React • Framer Motion
      </footer>
    </div>
  );
}

export default App;
