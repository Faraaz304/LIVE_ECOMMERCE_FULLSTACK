'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '@/components/ui/userSidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth'; // Import the hook (Adjust path if needed)

export default function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('User'); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const { fetchUserById } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const storedUserId = localStorage.getItem('userid');
        
        if (!storedUserId) {
          router.push('/login');
          return;
        }

        // Fetch fresh user data
        const user = await fetchUserById(storedUserId);

        // Check if user exists and has USER role
        if (user && user.role === 'USER') {
          setIsAuthorized(true);
          setUserName(user.username || 'User');
        } else {
          console.warn('Unauthorized access to User area.');
          router.push('/login');
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [router, fetchUserById]);

  const handleLogout = () => {
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading User Dashboard...
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        userName={userName}
      />

      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 shadow-lg"
      >
        <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
      </Button>

      <main className="flex-1 overflow-y-auto md:ml-[260px]">
        {children}
      </main>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}