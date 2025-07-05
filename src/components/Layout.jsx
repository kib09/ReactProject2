import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const { currentUser } = useAuth();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  useEffect(() => {
    setCurrentUser(currentUser);
  }, [currentUser, setCurrentUser]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <main className='flex-grow'>
        <Outlet />
      </main>
    </div>
  );
}
// Compare this snippet from src/pages/HomePage.jsx:
