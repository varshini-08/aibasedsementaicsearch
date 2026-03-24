import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag, Info } from 'lucide-react';

const ResultCard = ({ result, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative h-full flex flex-col p-6 rounded-2xl border border-white/10 glass bg-white/5 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:bg-white/10"
    >
      {/* Category Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider text-purple-200">
          {result.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-purple-400 transition-colors">
          {result.name}
        </h3>
        
        <div className="flex items-center gap-2 text-white/60 text-sm mb-4">
          <MapPin size={16} className="text-purple-500" />
          <span className="font-medium">{result.district}</span>
        </div>

        <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
          {result.description}
        </p>
      </div>

      {/* Keywords (Mini Badges) */}
      <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-white/5">
        {result.keywords.split(', ').slice(0, 3).map((kw, idx) => (
          <span key={idx} className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-1 rounded-md font-semibold uppercase italic">
            #{kw}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default ResultCard;
