import { Outlet } from 'react-router-dom'
import Aside from '@/components/Aside';

function Layout() {
  
  return (
    <div className='flex h-full w-screen'>
      <Aside />
      <main className='bg-primary-foreground w-full p-10'>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout