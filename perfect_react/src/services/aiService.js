import apiRequest from './httpClient.js';
import { API_ENDPOINTS } from '../utils/constants.js';

export const aiService = {
  
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiRequest.upload(`${API_ENDPOINTS.AI_TRY_ON}/upload`, formData);
    return response;
  },

  
  processTryOn: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/process`, data);
    return response;
  },

  
  generateVariations: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/variations`, data);
    return response;
  },

  
  getTryOnHistory: async (params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/history`, { params });
    return response;
  },

  
  saveTryOnResult: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/save`, data);
    return response;
  },

  
  deleteTryOnResult: async (id) => {
    const response = await apiRequest.delete(`${API_ENDPOINTS.AI_TRY_ON}/${id}`);
    return response;
  },

  
  getProcessingStatus: async (taskId) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/status/${taskId}`);
    return response;
  },

  
  cancelProcessing: async (taskId) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/cancel/${taskId}`);
    return response;
  },

  
  getModelInfo: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/model-info`);
    return response;
  },

  
  updateAISettings: async (settings) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.AI_TRY_ON}/settings`, settings);
    return response;
  },

  
  getAICredits: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/credits`);
    return response;
  },

  
  purchaseAICredits: async (amount) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/purchase-credits`, { amount });
    return response;
  },
};
