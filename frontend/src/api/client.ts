import axios from 'axios';

export const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('orbit-token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem('orbit-token');
    return Promise.reject(error);
  },
);

export const apiMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) return error.response?.data?.error?.message ?? 'The request could not be completed.';
  return 'The request could not be completed.';
};
