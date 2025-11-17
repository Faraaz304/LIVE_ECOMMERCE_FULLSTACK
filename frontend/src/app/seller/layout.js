'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';
import SellerSidebar from '@/components/ui/sellerSidebar';
import { Button } from '@/components/ui/button';

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName] = useState('Seller'); // Consider making this dynamic
  const [isAuthorized, setIsAuthorized] = useState(false); // State to track authorization
  const [loading, setLoading] = useState(true); // State to manage loading status
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = () => {
      const role = localStorage.getItem("userRole");
      if (role !== "SELLER") { // Check if the role is NOT "SELLER"
        router.push('/login');
      } else {
        setIsAuthorized(true);
      }
      setLoading(false); // Set loading to false once the check is done
    };

    checkAuthorization();
  }, [router]);

  const handleGoLive = () => {
    router.push('/seller/streams/create');
  };

  const handleLogout = () => {
    localStorage.clear();
    // If your accessToken cookie is not HttpOnly and client-side accessible,
    // you might want to explicitly clear it here:
    // document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Lax';
    router.push('/login');
  };

  // Show a loading indicator while authorization is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading authorization...
      </div>
    );
  }

  // If not authorized (and not redirecting immediately), return null or a specific message
  if (!isAuthorized) {
    return null; // Or render an "Access Denied" message if not redirecting immediately
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