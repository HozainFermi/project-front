// auth.js
import api from '../api/instance';
import { authStore } from '../api/authStore';

// Вход/отправка кода
export async function sendCode(phoneNumber) {
  try {
    const response = await api.post('/auth/send-code', { phoneNumber });
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Ошибка отправки кода' 
    };
  }
}

// Подтверждение кода
export async function verifyCode(phoneNumber, code) {
  try {
    const response = await api.post('/auth/verify-code', { phoneNumber, code });
    
    // В ответе ожидаем: { role: 'user', user: { id, name, ... } }
    authStore.setAuth(response.data);
    
    return { success: true, role: response.data.role };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Неверный код' 
    };
  }
}

// Выход
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    authStore.clearAuth();
    window.location.href = '/auth/login';
  }
}

// Проверка авторизации при загрузке
export async function checkAuth() {
  try {
    const response = await api.get('/auth/me');
    authStore.setAuth(response.data);
    return true;
  } catch (error) {
    authStore.clearAuth();
    return false;
  }
}