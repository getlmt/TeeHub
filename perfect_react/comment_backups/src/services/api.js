// src/services/api.js 
import { authService } from './authService.js';
import { productService } from './productService';
import { aiService } from './aiService';
import designService  from './designService';
// import { CartService } from './cart_service.js';
import api from './httpClient.js';
export {
  authService,
  productService,
  aiService,
  designService
};

export default api;
