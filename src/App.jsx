import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  redirect,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
//import { checkAuth } from './utils/auth';
import { authStore } from './api/authStore';

// Лейауты
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import WorkerLayout from './layouts/WorkerLayout';
import AdminLayout from './layouts/AdminLayout';

// Страницы для всех
import Unauthorized from './pages/Unauthorized';

// Страницы аутентификации
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Страницы жильцов
import Home from './pages/user/Home';
import UserProfile from './pages/user/Profile';
import UserMeters from './pages/user/Meters';
import UserRequests from './pages/user/Requests';
import UserNews from './pages/user/News';
import UserPayments from './pages/user/Payments';
import UserSettings from './pages/user/Settings';

// Страницы работников/админов
import WorkerDashboard from './pages/worker/Dashboard';
import WorkerRequests from './pages/worker/Requests';
import RequestDetails from './pages/worker/RequestDetails';
import WorkerMeterReadings from './pages/worker/MeterReadings';
import CompanyUsers from './pages/worker/Users';
import UserDetails from './pages/worker/UserDetails';
import WorkerMessages from './pages/worker/Messages';
import WorkerSettings from './pages/worker/Settings';

// Страницы только для админов
import AdminDashboard from './pages/admin/Dashboard';
import CompanyProfile from './pages/admin/CompanyProfile';
import AdminWorkers from './pages/admin/Workers';
import AdminStats from './pages/admin/Stats';
import { HStack, Stack, VStack } from "@chakra-ui/react";
import { Spinner, Text } from "@chakra-ui/react";

// Загрузчики
import { userLoader, workerLoader, adminLoader } from './utils/loaders';
import { Toaster } from "./components/ui/toaster";

// Компонент для проверки авторизации при загрузке
function AppInitializer({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Просто убираем загрузку
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <VStack colorPalette="teal" h="100vh" w="100vw" alignItems="center" justifyContent="center" >
            <Spinner color="colorPalette.600" />
            <Text color="colorPalette.600">Loading...</Text>
            </VStack>
  }

  return children;
}

// Создаём роутер
const router = createBrowserRouter([
  // Публичные роуты (без авторизации)
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { 
        path: "login", 
        element: <Login />,
        // Если уже авторизован - редирект на главную по роли
        loader: async () => {
          if (authStore.role) {
            return redirect(authStore.role === 'user' ? '/' : '/worker/dashboard');
          }
          return null;
        }
      },
      { path: "register", element: <Register /> }
    ]
  },
  
  // Страница "Нет доступа"
  {
    path: "/unauthorized",
    element: <Unauthorized />
  },

  // Группа роутов для жильцов (USER)
  {
    path: "/",
    element: <MainLayout />,
    loader: userLoader,
    children: [
      { index: true, element: <Home /> },
      { path: "profile", element: <UserProfile /> },
      { path: "meters", element: <UserMeters /> },
      { path: "requests", element: <UserRequests /> },
      { path: "news", element: <UserNews /> },
      {path: "payments",element: <UserPayments/>} ,
      {path: "settings", element:<UserSettings/>},
    ]
  },

  // Группа роутов для работников (WORKER/ADMIN)
  {
    path: "/worker",
    element: <WorkerLayout />,
    loader: workerLoader,
    children: [
      { index: true, element: <Navigate to="/worker/dashboard" replace /> },
      { path: "dashboard", element: <WorkerDashboard /> },
      { path: "requests", element: <WorkerRequests /> },
      { path: "requests/:id", element: <RequestDetails /> },
      { path: "meter-readings", element: <WorkerMeterReadings /> },
      { path: "users", element: <CompanyUsers /> },
      { path: "users/:id", element: <UserDetails /> },
      { path: "messages", element:<WorkerMessages/>},
      { path: "settings", element:<WorkerSettings/>},
    ]
  },

  // Группа роутов для админа (ADMIN ONLY)
  {
    path: "/admin",
    element: <AdminLayout />,
    loader: adminLoader,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "company/profile", element: <CompanyProfile /> },
      { path: "workers", element: <AdminWorkers /> },
      { path: "stats", element: <AdminStats /> },
    ]
  }
]);

function App() {
  return (
    <AppInitializer>
      <RouterProvider router={router} />
      <Toaster />
    </AppInitializer>
  );
}

export default App;