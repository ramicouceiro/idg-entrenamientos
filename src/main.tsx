import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import DashboardLayout from './layouts/dashboard-layout'

// Import the components
import IndexPage from './routes'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import DashboardPage from './routes/dashboard'
import AdminPage from './routes/admin'
import PlanificacionesPage from './routes/planificaciones'
import TurnosPage from './routes/turnos'
import VideosPage from './routes/videos'
import PaquetesPage from './routes/paquetes'
import CrearHorariosPage from './routes/crearHorarios'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <IndexPage /> },
      { path: 'planificaciones', element: <PlanificacionesPage /> },
      { path: 'turnos', element: <TurnosPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'paquetes', element: <PaquetesPage /> },
      { path: 'sign-in/*', element: <SignInPage /> },
      { path: 'sign-up/*', element: <SignUpPage /> },

      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [{ path: '', element: <DashboardPage /> }],
      },

      {
        path: 'admin',
        element: <AdminPage />,
        children: [{ path: 'horarios', element: <CrearHorariosPage /> }],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);
