import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaDumbbell, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { MdSlowMotionVideo } from 'react-icons/md';
import { UserResource } from "@clerk/types";
import { useClerk } from '@clerk/clerk-react';
import { TbLogout2 } from 'react-icons/tb';
import Swal from 'sweetalert2';
import { FiPackage } from 'react-icons/fi';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  user: UserResource | null | undefined;
  loading: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, user, loading }) => {
  const location = useLocation();
  const isAdmin = user?.publicMetadata.role === 'admin';

  const isActive = (path: string) => location.pathname === path;

  const { signOut } = useClerk();

  const handleSignOut = () =>{
    Swal.fire({
                title: "¿Cerrar sesión?",
                showCancelButton: true,
                confirmButtonText: "Cerrar sesión",
                cancelButtonText: `Cancelar`,
                icon: "warning",
                background: "#1F2937", // Color de fondo (gris oscuro)
                color: "#FFFFFF", // Color del texto
                confirmButtonColor: "#EF4444", // Rojo Tailwind
                denyButtonColor: "#9CA3AF", // Gris claro
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    confirmButton: 'custom-swal-confirm',
                    denyButton: 'custom-swal-deny',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                  signOut({ redirectUrl: '/' });
                }
            });
    
  }
  return (
    <div className="grid md:grid-cols-[16rem_1fr] grid-cols-1 min-h-screen w-screen bg-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col bg-gray-900 text-white p-5">
        <img src="/img/logo-idg.jpg" alt="Logo" className="rounded-full w-20 self-center" />
        <nav className="flex flex-col mt-10 text-xl">
          <Link to="/" className={`flex items-center gap-3 hover:text-green-500 hover:bg-gray-700 px-4 py-4 rounded-lg transition-all ${isActive('/') ? 'text-green-500' : 'text-white'}`}>
            <IoMdHome />
            <span className="hidden md:inline">Principal</span>
          </Link>
          <Link to="/planificaciones" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-4 rounded-lg transition-all ${isActive('/planificaciones') ? 'text-green-500' : 'text-white'}`}>
            <FaDumbbell />
            <span className="hidden md:inline">Planificaciones</span>
          </Link>
          <Link to="/turnos" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-4 rounded-lg transition-all ${isActive('/turnos') ? 'text-green-500' : 'text-white'}`}>
            <FaCalendarAlt />
            <span className="hidden md:inline">Turnos</span>
          </Link>
          <Link to="/videos" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-4 rounded-lg transition-all ${isActive('/videos') ? 'text-green-500' : 'text-white'}`}>
            <MdSlowMotionVideo />
            <span className="hidden md:inline">Videos</span>
          </Link>
          <Link to="/paquetes" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-4 rounded-lg transition-all ${isActive('/pagos') ? 'text-green-500' : 'text-white'}`}>
            <FiPackage />
            <span className="hidden md:inline">Paquetes</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`flex items-center gap-3 hover:bg-gray-700 hover:text-green-500 px-4 py-4 rounded-lg transition-all ${(location.pathname.startsWith('/admin')) ? 'text-green-500' : 'text-white'}`}>
              <FaUserShield />
              <span className="hidden md:inline">Administrador</span>
            </Link>
          )}
        </nav>
          <div className='mt-auto'>
            <button className='w-full bg-red-700 hover:bg-red-600' onClick={handleSignOut}>Cerrar Sesión</button>
          </div>
      </aside>

      {/* Contenido principal */}
      {loading ? <Loader/> : <main className="w-full p-4 overflow-hidden">
        {children}
      </main>}

      {/* Barra de navegación móvil */}
      <nav id="bottom-nav" className={`fixed mb-14 w-[95%] bottom-0 left-[50%] -translate-x-[50%] rounded-xl text-white bg-gray-900 flex justify-around text-xl md:hidden`}>
        <motion.div 
          className="absolute h-full bg-gray-700 rounded-xl"
          layoutId="activeTab"
          style={{
            width: `${100 / (isAdmin ? 7 : 6)}%`,
            left: `${location.pathname === '/' ? '0' : 
                   location.pathname === '/planificaciones' ? '14.28' : 
                   location.pathname === '/turnos' ? '28.56' : 
                   location.pathname === '/videos' ? '42.84' :
                   location.pathname === '/paquetes' ? '57.12' :
                   location.pathname.startsWith('/admin') ? '71.4' : '85.68'}%`
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <Link to="/" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${isActive('/') ? 'text-green-500' : 'text-white'}`}>
          <IoMdHome />
        </Link>
        <Link to="/planificaciones" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${isActive('/planificaciones') ? 'text-green-500' : 'text-white'}`}>
          <FaDumbbell />
        </Link>
        <Link to="/turnos" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${isActive('/turnos') ? 'text-green-500' : 'text-white'}`}>
          <FaCalendarAlt />
        </Link>
        <Link to="/videos" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${isActive('/videos') ? 'text-green-500' : 'text-white'}`}>
          <MdSlowMotionVideo />
        </Link>
        <Link to="/paquetes" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${isActive('/paquetes') ? 'text-green-500' : 'text-white'}`}>
          <FiPackage />
        </Link>
        {isAdmin && (
          <Link to="/admin" className={`relative flex flex-col items-center w-full h-full hover:text-green-500 p-4 rounded-xl z-10 transition-colors ${location.pathname.startsWith('/admin') ? 'text-green-500' : 'text-white'}`}>
            <FaUserShield />
          </Link>
        )}
        <div className="relative flex flex-col items-center w-full h-full text-red-500 cursor-pointer p-4 rounded-xl z-10" onClick={handleSignOut}>
          <TbLogout2 />
        </div>
      </nav>
    </div>
  );
};


export default Layout;