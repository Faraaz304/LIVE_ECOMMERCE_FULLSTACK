'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/ui/adminSidebar'; // Adjust path if needed
import { Button } from '@/components/ui/button'; // Adjust path if needed
import { useAuth } from '@/hooks/useAuth'; // Import the hook (Adjust path if needed)

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Admin'); 
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
  // Destructure the new function from your custom hook
  const { fetchUserById } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // 1. Check if ID exists in local storage
        const storedUserId = localStorage.getItem('userid');
        
        if (!storedUserId) {
          console.warn('No User ID found, redirecting to login.');
          router.push('/login');
          return;
        }

        // 2. Fetch fresh user data using the hook
        // This automatically handles the Token injection inside useAuth
        const user = await fetchUserById(storedUserId);

        // 3. Verify User exists and has ADMIN role
        if (user && user.role === 'ADMIN') {
          setIsAuthorized(true);
          setUserName(user.username || 'Admin'); // Set dynamic username
        } else {
          console.warn('User is not authorized or not an Admin.');
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
    // Clear all auth data
    localStorage.removeItem('userid');
    localStorage.removeItem('token');
    // localStorage.clear(); // Use this if you want to wipe everything
    
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* You can replace this with a proper Spinner component */}
        <div className="text-lg font-medium animate-pulse">Verifying Admin Access...</div>
      </div>
    );
  }

  // Double check to prevent flash of content if redirect lags
  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        handleLogout={handleLogout}
        userName={userName}
      />

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 shadow-lg"
      >
        <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
      </Button>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto md:ml-[260px]">
        {children}
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}