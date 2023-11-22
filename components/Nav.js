import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { MdStore, MdHome, MdSettings, MdListAlt, MdInventory, MdCategory, MdLogout } from 'react-icons/md';

const Nav = ({show}) => {
  const inactiveIcon = 'text-[25px]';
  const activeIcon = inactiveIcon + ' text-primary';
  const inactiveLink = 'flex gap-1 p-1';
  const activeLink = inactiveLink+ " bg-highlight text-black rounded-md";

  const router = useRouter();
  const { pathname } = router;

  async function logout() {
    await router.push('/');
    await signOut();
  }

  return (
    <aside className={(show?'left-0':'-left-full') + ' top-0 z-20 transition-all duration-300 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto'}>

      <Link href='/' className='flex gap-1 mb-4 mr-4'>
        <MdStore className='text-[25px]'/>
        <span className=''>
          EcommerceAdmin
        </span>
      </Link>
      <nav className='flex flex-col gap-2'>
        <Link href="/" className={pathname === '/' ? activeLink : inactiveLink}>
          <MdHome className={pathname === '/' ? activeIcon : inactiveIcon}/>
          Dashboard
        </Link>

        <Link href="/products" className={pathname.includes('/products') ? activeLink : inactiveLink}>
          <MdInventory className={pathname.includes('/products') ? activeIcon : inactiveIcon}/>
          Products
        </Link>

        <Link href="/categories" className={pathname.includes('/categories') ? activeLink : inactiveLink}>
          <MdCategory className={pathname.includes('/categories') ? activeIcon : inactiveIcon}/>
          Categories
        </Link>

        <Link href="/orders" className={pathname.includes('/orders') ? activeLink : inactiveLink}>
          <MdListAlt className={pathname.includes('/orders') ? activeIcon : inactiveIcon}/>
          Orders
        </Link>

        <Link href="/settings" className={pathname.includes('/settings') ? activeLink : inactiveLink}>
          <MdSettings className={`fill=none ${pathname.includes('/settings') ? activeIcon : inactiveIcon}`}/>
          Settings
        </Link>
        <button
          className={inactiveLink}
          onClick={logout}
        >
          <MdLogout className='text-[25px] scale-x-[-1]'/>
            Logout
        </button>
      </nav>
    </aside>
  )
}

export default Nav