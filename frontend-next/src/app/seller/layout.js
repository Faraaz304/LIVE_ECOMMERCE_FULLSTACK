'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SellerSidebar from '@/components/SellerSidebar';

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Seller');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    
    if (role!="SELLER") {
      router.push('/login');
      return;
    }
    
    setIsAuthorized(true);
  }, [router]);

  const handleGoLive = () => {
    router.push('/seller/streams/create');
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Show loading or nothing while checking authorization
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SellerSidebar
        sidebarOpen={sidebarOpen}
        handleGoLive={handleGoLive}
        handleLogout={handleLogout}
        userName={userName}
      />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        <span className="text-2xl">{sidebarOpen ? '✕' : '☰'}</span>
      </button>

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
