
import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "../utils/auth.js"; 


const api = axios.create({
  
  baseURL: '/', 
  withCredentials: true, 
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});


api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    
    
    
    const isAuthPath = typeof config.url === 'string' && config.url.includes('/auth/'); 
    
    
    
    
    if (token && !isAuthPath) { 
      config.headers.Authorization = `Bearer ${token}`;
      console.debug("Attaching token to request:", config.url); 
    } else if (token && isAuthPath) {
      console.debug("Skipping token attachment for auth path:", config.url); 
    }
    

    return config;
  },
  (error) => {
    
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);



const isAuthPathCheck = (url) => typeof url === "string" && url.includes("/auth/"); 

let isRefreshing = false;
let failedQueue = []; 

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
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    
    if (status === 401 && !originalRequest._retry && !isAuthPathCheck(originalRequest.url)) {
      
      
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest); 
        }).catch(err => {
          return Promise.reject(err); 
        });
      }

      
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
