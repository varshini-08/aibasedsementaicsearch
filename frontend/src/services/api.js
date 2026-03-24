import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = {
  search: async (query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/search`, {
        query: query
      });
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },
  health: async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  }
};

export default api;
