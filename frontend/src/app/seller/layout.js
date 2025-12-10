'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SellerSidebar from '@/components/ui/sellerSidebar';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };

  return (
    <ProtectedRoute role="SELLER">
      <div className="flex h-screen overflow-hidden">
        <SellerSidebar
          sidebarOpen={sidebarOpen}
          handleLogout={handleLogout}
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
    </ProtectedRoute>
  );
}
