import React from 'react';

export const metadata = {
  title: 'Authentication - ShopLive',
  description: 'Login or Register to access your ShopLive account.',
};

export default function AuthLayout({ children }) {
  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      
      {/* LEFT SIDE: Branding & Visuals (Shared across Login/Register) */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 border-r border-border p-10 relative overflow-hidden">
        
        {/* Abstract Background Shapes using your Global Colors */}
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2 font-bold text-2xl text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            S
          </div>
          ShopLive
        </div>

        {/* Testimonial / Footer Text */}
        <div className="relative z-10">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-foreground/90 leading-relaxed">
              "ShopLive has revolutionized how we handle our daily transactions. The seamless experience for both buyers and sellers is unmatched."
            </p>
            <footer className="text-sm text-muted-foreground">
              &copy; 2025 ShopLive Inc. All rights reserved.
            </footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: The Form Container */}
      {/* 'children' (the login or register page) will be injected here */}
      <div className="flex items-center justify-center py-12 px-6 sm:px-12 bg-background">
        {children}
      </div>
    </div>
  );
}