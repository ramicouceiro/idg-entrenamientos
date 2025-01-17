import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaDumbbell, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { MdSlowMotionVideo } from 'react-icons/md';
import { UserResource } from "@clerk/types";
import { SignOutButton } from '@clerk/clerk-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserResource | null | undefined;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  const location = useLocation();
  const isAdmin = user?.publicMetadata.role === 'admin';

  const isActive = (path: string) => location.pathname === path;

  console.log("render");
  return (
    <div className="grid grid-cols-[16rem_1fr] min-h-screen w-screen bg-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col bg-gray-900 text-white p-5">
        <img src="/img/logo-idg.jpg" alt="Logo" className="rounded-full w-20 self-center" />
        <nav className="flex flex-col gap-4 mt-10 text-xl">
          <Link to="/" className={`flex items-center gap-3 hover:text-green-500 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all ${isActive('/') ? 'text-green-500 hover:bg-transparent' : 'text-white'}`}>
            <IoMdHome />
            <span className="hidden md:inline">Principal</span>
          </Link>
          <Link to="/planificaciones" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-2 rounded-lg transition-all ${isActive('/planificaciones') ? 'text-green-500' : 'text-white'}`}>
            <FaDumbbell />
            <span className="hidden md:inline">Planificaciones</span>
          </Link>
          <Link to="/turnos" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-2 rounded-lg transition-all ${isActive('/turnos') ? 'text-green-500' : 'text-white'}`}>
            <FaCalendarAlt />
            <span className="hidden md:inline">Turnos</span>
          </Link>
          <Link to="/videos" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-2 rounded-lg transition-all ${isActive('/videos') ? 'text-green-500' : 'text-white'}`}>
            <MdSlowMotionVideo />
            <span className="hidden md:inline">Videos</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-2 rounded-lg transition-all ${isActive('/admin') ? 'text-green-500' : 'text-white'}`}>
              <FaUserShield />
              <span className="hidden md:inline">Administrador</span>
            </Link>
          )}
          <div>
            <SignOutButton>
              <button>Cerrar Sesión</button>
            </SignOutButton>
          </div>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="p-5">
        {children}
      </main>

      {/* Barra de navegación móvil */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex justify-around p-2 md:hidden">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-green-500' : ''}`}>
          <IoMdHome />
        </Link>
        <Link to="/planificaciones" className={`flex flex-col items-center ${isActive('/planificaciones') ? 'text-green-500' : ''}`}>
          <FaDumbbell />
        </Link>
        <Link to="/turnos" className={`flex flex-col items-center ${isActive('/turnos') ? 'text-green-500' : ''}`}>
          <FaCalendarAlt />
        </Link>
        <Link to="/videos" className={`flex flex-col items-center ${isActive('/videos') ? 'text-green-500' : ''}`}>
          <MdSlowMotionVideo />
        </Link>
        {isAdmin && (
          <Link to="/admin" className={`flex flex-col items-center ${isActive('/admin') ? 'text-green-500' : ''}`}>
            <FaUserShield />
          </Link>
        )}
        <SignOutButton>
          <button>
            Cerrar Sesión
          </button>
        </SignOutButton>
      </nav>
    </div>
  );
};


export default Layout;