import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import DashboardPage from './dashboard'

export default function IndexPage() {
  return (
    <>
      <SignedOut>
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-cover'>
          <div className='flex flex-col justify-around bg-gray-900/95 w-1/4 h-1/2 rounded-xl p-10 gap-4 text-center'>
            <img className='self-center rounded-full' src="/img/logo-idg.jpg" alt="" />
            <h2 className='text-4xl'><span className='text-green-700'>IDG</span> ENTRENAMIENTOS</h2>
            <ul className='flex items-center gap-4'>
              <li className='w-3/4 bg-gray-700 hover:bg-gray-500 rounded-3xl h-10 cursor-pointer duration-200'>
                <Link className='w-full h-full flex items-center justify-center text-white hover:text-white' to="/sign-in">Iniciar Sesión</Link>
              </li>
              <li className='w-3/4 bg-green-900 hover:bg-green-700 rounded-3xl h-10 cursor-pointer duration-200'>
                <Link className='w-full h-full flex items-center justify-center text-white hover:text-white' to="/sign-up">Registrarse</Link>
              </li>
            </ul>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <DashboardPage />
      </SignedIn>
    </>
  )
}