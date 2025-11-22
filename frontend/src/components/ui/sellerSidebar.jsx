'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/seller/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/seller/products', icon: '📦', label: 'Products' },
  { href: '/seller/orders', icon: '🛒', label: 'Orders' },
  { href: '/seller/reservations/booking', icon: '📅', label: 'Reservations' },
  { href: '/seller/streams', icon: '📺', label: 'Live Streams' },
  { href: '/seller/analytics', icon: '📈', label: 'Analytics' },
  { href: '/seller/settings', icon: '⚙️', label: 'Settings' },
];

const SellerSidebar = ({ sidebarOpen, handleGoLive, handleLogout, userName = 'Seller' }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-transform duration-300 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
    >
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            S
          </div>
          ShopLive <span className="text-xs font-normal bg-sidebar-accent text-sidebar-accent-foreground px-2 py-0.5 rounded-full">Seller</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* CTA Button for Sellers */}
        <div className="mb-6 px-1">
          <button
            onClick={handleGoLive}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <span>🎥</span> Go Live Now
          </button>
        </div>

        <div className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2 px-3">
          Management
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-md bg-sidebar-accent/20 p-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary/10 flex items-center justify-center text-sidebar-foreground text-sm font-bold border border-sidebar-border">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Merchant</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SellerSidebar;