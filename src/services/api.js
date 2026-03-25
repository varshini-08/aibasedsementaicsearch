import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8000/api');

const api = {
  search: async (query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, {
        query: query
      }, { timeout: 30000 }); // 30s timeout for Render cold-start wake-up
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },
  health: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`, { timeout: 60000 }); // 60s for cold-start ping
    return response.data;
  }
};

export default api;
