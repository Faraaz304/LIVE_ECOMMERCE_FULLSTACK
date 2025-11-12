// app/admin/page.js
'use client'; // This directive makes it a Client Component

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminDashboard = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // In a real application, you'd verify the user's role and authentication
    // more securely, often on the server-side or via an authentication library.
    // For now, we're relying on localStorage set during login.
    const storedEmail = localStorage.getItem('userEmail');
    const storedRole = localStorage.getItem('userRole');

    // if (!storedEmail || storedRole !== 'admin') {
    //   // If no email or not an admin, redirect them away
    //   router.push('/login'); // Or to a unauthorized page
    // } else {
    //   setUserEmail(storedEmail);
    //   setUserRole(storedRole);
    // }
  }, [router]);

  const handleLogout = () => {
    // Clear all stored user data and redirect to login
    localStorage.removeItem('accessToken'); // If you end up using localStorage for tokens
    localStorage.removeItem('refreshToken'); // If you end up using localStorage for tokens
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (!userEmail || userRole !== 'admin') {
    // Optionally show a loading state or redirecting message
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl font-medium text-gray-700">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-8 flex flex-col items-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold text-indigo-800 mb-4">Admin Dashboard</h1>
        <p className="text-lg text-gray-700 mb-6">
          Welcome, <span className="font-semibold text-indigo-600">{userEmail}</span>!
          You are logged in as an <span className="font-semibold text-purple-600 capitalize">{userRole}</span>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/users" className="block p-5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Manage Users
          </Link>
          <Link href="/admin/products" className="block p-5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Manage Products
          </Link>
          <Link href="/admin/orders" className="block p-5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            View Orders
          </Link>
          <Link href="/admin/settings" className="block p-5 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
            Site Settings
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;