import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full max-w-3xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for your next adventure in Tamil Nadu..."
          className="w-full px-6 py-5 pl-16 bg-white/5 border border-white/10 rounded-2xl text-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all duration-300 glass shadow-2xl"
        />
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-purple-400 transition-colors">
          <Search size={28} />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isLoading ? 'Searching...' : 'Explore'}
        </button>
      </form>
    </motion.div>
  );
};

export default SearchBar;
