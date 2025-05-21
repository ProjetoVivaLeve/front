import axios from 'axios';
import { getToken, clearToken, clearUserData } from '../storage';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3001',
});

const getAuthConfig = (config?: any) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  return {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

export const authApi = {
  get: (url: string, config?: any) => {
    return api.get(url, getAuthConfig(config));
  },

  post: (url: string, data?: any, config?: any) => {
    console.log('Enviando requisição autenticada para:', url);
    console.log('Token usado:', getToken());
    return api.post(url, data, getAuthConfig(config));
  },

  put: (url: string, data?: any, config?: any) => {
    return api.put(url, data, getAuthConfig(config));
  },

  delete: (url: string, config?: any) => {
    return api.delete(url, getAuthConfig(config));
  },
};

export const publicApi = {
  get: api.get,
  post: api.post,
  put: api.put,
  delete: api.delete,
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response)
    if (error.response?.status === 401) {
      clearToken();
      clearUserData();
    }
    return Promise.reject(error);
  }
);