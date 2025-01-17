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
const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/'                 , element: <IndexPage />            },
      { path: '/planificaciones'  , element: <PlanificacionesPage />  },
      { path: '/turnos'           , element: <TurnosPage />           },
      { path: '/videos'           , element: <VideosPage />           },
      { path: '/admin'            , element: <AdminPage />            },
      { path: '/sign-in/*'        , element: <SignInPage />           },
      { path: '/sign-up/*'        , element: <SignUpPage />           },
      {
        element: <DashboardLayout />,
        path: 'dashboard',
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
        ],
      }
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)