import { createBrowserRouter, RouterProvider, redirect } from 'react-router-dom'; // Добавили redirect
// Импорты  Layout и Pages ...

const authLoader = () => {
  const hasCookie = document.cookie.includes("jwt");
  if (!hasCookie) {
    return redirect("/auth/login");
  }
  return null; 
};

const router = createBrowserRouter([
  // Группа роутов под MainLayout
  {
    path: "/",
    element: <MainLayout />,
    loader: authLoader, // Защитит сразу ВСЕХ детей внутри 
    children: [
      { index: true, element: <Home /> },
      {
        path: "user/profile",
        element: <Profile />,
      },
      {
        path: "company/profile",
        element: <CompanyProfile />,
      }      
    ]
  },

  // Группа COMPANY
  {
    path: "/company",
    element: <CompanyLayout />,
    loader: authLoader, // Если компаниям тоже нужна авторизация
    children: [
      {
        path: "users",
        element: <CompanyUsers />,
      },
      {
        path: "users/:id", 
        element: <UserDetails />, 
      },
      {
        path: "dashboard",
        element: <CompanyDashBoard />,
      },
    ]
  },

  // Группа SERVICE
  {
    path: "/service",
    element: <ServiceLayout />,
    loader: authLoader,
    children: [
      { path: "requests", element: <CreateRequest /> },
      { path: "requests/:id", element: <RequestDetails /> },
      { path: "meter-readings", element: <CreateMeterReadings /> },
      { path: "meter-readings/:id", element: <MeterReadingsDetails /> }
    ] 
  },

  // AUTH
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
