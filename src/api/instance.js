// api.js
import axios from 'axios';

// Создаем экземпляр axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // ВАЖНО: чтобы куки отправлялись автоматически
  headers: {
    'Content-Type': 'application/json',
  },
});

// Флаг для предотвращения бесконечного цикла рефреша
let isRefreshing = false;
// Очередь запросов, которые ждут рефреш
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на рефреш
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Если это уже запрос на рефреш, просто выходим
      if (originalRequest.url === '/auth/refresh') {
        // Редирект на логин
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Если уже обновляем токен, добавляем в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        await api.post('/auth/refresh');
        
        // Успешно обновили
        processQueue(null);
        isRefreshing = false;
        
        // Повторяем исходный запрос
        return api(originalRequest);
      } catch (refreshError) {
        // Ошибка рефреша - выкидываем на логин
        processQueue(refreshError);
        isRefreshing = false;
        
        // Очищаем роль
        localStorage.removeItem('userRole');
        
        // Редирект на логин
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;