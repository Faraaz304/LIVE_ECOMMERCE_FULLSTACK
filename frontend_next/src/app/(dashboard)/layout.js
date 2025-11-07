'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => console.log('Logout clicked');
  const handleGoLive = () => console.log('Go Live clicked');
  const handleSearch = (e) => console.log('Searching for:', e.target.value);

  return (
    <html lang="en">
      <body className="flex bg-gray-50 min-h-screen">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          handleGoLive={handleGoLive}
          handleLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:ml-[260px]">
          <Navbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            handleSearch={handleSearch}
          />
          {children}
        </div>
      </body>
    </html>
  );
};

export default Layout;
