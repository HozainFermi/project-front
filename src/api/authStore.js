//простое глобальное состояние
class AuthStore {
  constructor() {
    this.role = null; // 'user', 'worker', 'admin'
    this.userData = null;
    this.listeners = [];
    this.initFromStorage();
  }

  // Подписка на изменения
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Уведомление подписчиков
  notify() {
    this.listeners.forEach(listener => listener());
  }

  // Установка данных после логина
  setAuth(data) {
    this.role = data.role;
    this.userData = data.user;
    localStorage.setItem('userRole', data.role); // Только для быстрого доступа при загрузке
    this.notify();
  }

  // Очистка при логауте
  clearAuth() {
    this.role = null;
    this.userData = null;
    localStorage.removeItem('userRole');
    this.notify();
  }

  // Проверка ролей
  hasRole(roles) {
    if (!this.role) return false;
    if (typeof roles === 'string') return this.role === roles;
    return roles.includes(this.role);
  }

  // Загрузка роли из localStorage при старте
  initFromStorage() {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      this.role = savedRole;
    }
  }
}

export const authStore = new AuthStore();