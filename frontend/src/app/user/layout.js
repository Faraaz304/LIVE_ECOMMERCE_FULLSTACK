'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserSidebar from '@/components/ui/adminSidebar';
import { Button } from '@/components/ui/button';

export default function UserLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState('User');
  const router = useRouter();

  //   useEffect(() => {
//     const role = localStorage.getItem("userRole")
    
//     if (role!="SELLER") {
//       router.push('/login');
//       return;
//     }
    
//     setIsAuthorized(true);
//   }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <UserSidebar
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
