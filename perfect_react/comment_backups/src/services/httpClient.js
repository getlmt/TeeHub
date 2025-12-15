// src/services/httpClient.js (ĐÃ SỬA)
import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "../utils/auth.js"; // Thêm .js

// ⚠️ .env(.development) cần có: VITE_API_BASE=http://localhost:8080 (hoặc '/' nếu dùng proxy Vite)
const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE || '/', // Dùng '/' nếu proxy Vite đã cấu hình
  baseURL: '/', // Thường là '/' khi dùng proxy Vite cho /api
  withCredentials: true, // gửi cookie refresh_token
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Interceptor gắn Authorization header, TRỪ KHI request là /auth/*
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    // === THAY ĐỔI CHÍNH NẰM Ở ĐÂY ===
    // Kiểm tra xem URL có chứa '/auth/' không
    const isAuthPath = typeof config.url === 'string' && config.url.includes('/auth/'); 
    
    // Chỉ đính kèm token nếu:
    // 1. Có token trong storage (token tồn tại)
    // 2. Request KHÔNG phải là đường dẫn /auth/ (isAuthPath là false)
    if (token && !isAuthPath) { 
      config.headers.Authorization = `Bearer ${token}`;
      console.debug("Attaching token to request:", config.url); // Log để kiểm tra (tùy chọn)
    } else if (token && isAuthPath) {
      console.debug("Skipping token attachment for auth path:", config.url); // Log (tùy chọn)
    }
    // === KẾT THÚC THAY ĐỔI ===

    return config;
  },
  (error) => {
    // Nên log lỗi request ở đây nếu cần
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);


// Interceptor xử lý refresh token (Giữ nguyên logic của bạn, nó đã tốt)
const isAuthPathCheck = (url) => typeof url === "string" && url.includes("/auth/"); // Đổi tên biến để tránh trùng lặp

let isRefreshing = false;
let failedQueue = []; // Đổi tên thành failedQueue cho rõ ràng hơn

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Mọi response thành công đều đi qua đây
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Chỉ xử lý 401, không phải request /auth/* và chưa thử lại
    if (status === 401 && !originalRequest._retry && !isAuthPathCheck(originalRequest.url)) {
      
      // Nếu đang trong quá trình refresh, đưa request vào hàng đợi
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest); // Thử lại request với token mới
        }).catch(err => {
          return Promise.reject(err); // Nếu refresh fail, reject request đang chờ
        });
      }

      // Đánh dấu đã thử lại
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.debug("Access token expired or invalid. Attempting to refresh...");
        const rs = await api.post('/auth/refresh'); 
        const { accessToken: newAccessToken } = rs.data;

        if (!newAccessToken) {
            throw new Error("Refresh endpoint did not return an access token.");
        }

        console.debug("Refresh successful. New access token obtained.");
        setAccessToken(newAccessToken); 
        processQueue(null, newAccessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
        return api(originalRequest);

      } catch (refreshError) {
        console.error("!!! Refresh token failed:", refreshError?.response?.data || refreshError?.message);
        processQueue(refreshError, null);
        clearAuth(); 
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
