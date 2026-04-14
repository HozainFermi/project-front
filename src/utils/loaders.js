// loaders.js
import { redirect } from 'react-router-dom';
import { authStore } from '../api/authStore';
import api from '../api/instance';

// Вспомогательная функция для проверки авторизации
async function requireAuth() {
  // Временно всегда возвращаем true
  return true;
  
  // // Если роль уже есть в сторе, используем её
  // if (authStore.role) {
  //   return true;
  // }
  
  // // Иначе пробуем проверить на сервере
  // try {
  //   const response = await api.get('/auth/me');
  //   authStore.setAuth(response.data);
  //   return true;
  // } catch (error) {
  //   return false;
  // }
}

// Загрузчик для авторизованных пользователей (USER)
export async function userLoader() {
  const isAuth = await requireAuth();
  
  if (!isAuth) {
    return redirect('/auth/login');
  }
  
  return null;
}

// Загрузчик для работников (WORKER и ADMIN)
export async function workerLoader() {
  const isAuth = await requireAuth();
  
  if (!isAuth) {
    return redirect('/auth/login');
  }
  
  // if (!authStore.hasRole(['worker', 'admin'])) {
  //   return redirect('/unauthorized');
  // }
  
  return null;
}

// Загрузчик для админов (только ADMIN)
export async function adminLoader() {
  const isAuth = await requireAuth();
  
  if (!isAuth) {
    return redirect('/auth/login');
  }
  
  // if (!authStore.hasRole('admin')) {
  //   return redirect('/unauthorized');
  // }
  
  return null;
}