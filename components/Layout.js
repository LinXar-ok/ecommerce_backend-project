import { Inter } from 'next/font/google';
import { useSession, signIn } from "next-auth/react";
import { Nav } from '@/components';
import { MdMenu, MdStore } from 'react-icons/md';
import { useState } from 'react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Layout({children}) {
  const { data: session } = useSession()
  const [showNav, setShowNav] = useState(false);

  // Toggle function for the navigation
  const toggleNav = () => {
    setShowNav(prevState => !prevState);
  }

  if (!session) {
    return (
      <div className='bg-bgGray w-screen h-screen flex items-center'>
      <div className='text-center w-full'>
        <button onClick={() => signIn('google')} className='bg-white p-2 px-4 rounded-lg'>Login with Google</button>
      </div>
    </div>
    );
  }

  return (
    <div className=' bg-bgGray min-h-screen'>
      <div className=' md:hidden flex items-center p-4'>
        <button onClick={toggleNav}>  {/* Use toggle function here */}
          <MdMenu className='text-[25px]' />
        </button>
        <div className='flex grow justify-center mr-6'>
          <Link href='/' className='flex gap-1'>
            <MdStore className='text-[25px]'/>
            <span className=''>
              EcommerceAdmin
            </span>
          </Link>
        </div>

      </div>


      {/* Backdrop overlay to detect outside clicks */}
      {showNav && (
        <div
          className='fixed inset-0 z-10'
          onClick={toggleNav}
        ></div>
      )}

      <div className='flex'>
        <Nav show={showNav} />
        <div className='flex-grow p-4'>
          {children}
        </div>
      </div>
    </div>
  )
}
