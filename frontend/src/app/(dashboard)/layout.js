"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for client-side navigation
import Sidebar from "../../components/Sidebar";

// This component will wrap all pages in the (dashboard) group
export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    // Check for the token in localStorage when the component mounts
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token is found, redirect to the login page
      router.push("/login");
    } else {
      // For a more robust solution, you would typically also:
      // 1. Send the token to your backend to verify its validity (e.g., not expired, signed correctly).
      // 2. Based on the backend's response, set isAuthenticated.
      // For now, we'll assume the presence of a token means authenticated.
      setIsAuthenticated(true);
    }
    setLoading(false); // Set loading to false once the check is complete
  }, [router]); // Depend on router to ensure effect runs correctly if router changes (though it typically won't)

  const toggleSidebar = () => setIsOpen(!isOpen);

  // While checking, you might want to show a loading spinner or an empty screen
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--background)]">
        <p className="text-[var(--foreground)]">Loading...</p>
      </div>
    );
  }

  // Only render the dashboard layout if the user is authenticated
  if (!isAuthenticated) {
    // This case should ideally be handled by the router.push above,
    // but it's a good fallback to return null or another loading state.
    return null;
  }

  return (
    // Note: We use a <div> here instead of <body>
    // The <body> tag is managed by the root layout.js
    <div className="flex h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] transition-all">
      <Sidebar isOpen={isOpen} />
      <div className="flex flex-col flex-1">
        {/* You might want to uncomment Navbar and pass toggleSidebar if you have one */}
        {/* <Navbar toggleSidebar={toggleSidebar} /> */}
        {/* The 'children' prop is where your page content will be rendered */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}