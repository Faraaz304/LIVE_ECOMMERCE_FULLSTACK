"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

// This component will wrap all pages in the (dashboard) group
export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    // Note: We use a <div> here instead of <body>
    // The <body> tag is managed by the root layout.js
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-all">
      <Sidebar isOpen={isOpen} />
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} />
        {/* The 'children' prop is where your page content will be rendered */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}