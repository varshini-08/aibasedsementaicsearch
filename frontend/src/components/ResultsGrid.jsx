import React from 'react';
import ResultCard from './ResultCard';
import { motion, AnimatePresence } from 'framer-motion';

const ResultsGrid = ({ results }) => {
  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-white/40">
        <p className="text-xl">No results found. Try a different query!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {results.map((result, index) => (
            <ResultCard key={`${result.name}-${index}`} result={result} index={index} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResultsGrid;
