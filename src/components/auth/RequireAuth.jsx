import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '../stores/authStore';

export function RequireAuth({ children, allowedRoles }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    const unsubscribe = authStore.subscribe(() => {
      if (!authStore.role) {
        navigate('/auth/login', { state: { from: location.pathname } });
      } else if (allowedRoles && !authStore.hasRole(allowedRoles)) {
        navigate('/unauthorized');
      }
    });

    
    if (!authStore.role) {
      navigate('/auth/login', { state: { from: location.pathname } });
    } else if (allowedRoles && !authStore.hasRole(allowedRoles)) {
      navigate('/unauthorized');
    }

    return unsubscribe;
  }, [navigate, location, allowedRoles]);

  return authStore.role ? children : null;
}