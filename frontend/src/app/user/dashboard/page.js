'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UserDashboard() {
  const [userData, setUserData] = useState({
    name: 'User',
    totalOrders: 0,
    activeOrders: 0,
    wishlistItems: 0,
  });

  useEffect(() => {
    // Fetch user data from API
    setUserData({
      name: 'John',
      totalOrders: 15,
      activeOrders: 2,
      wishlistItems: 8,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your account</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Orders</p>
                <p className="text-4xl font-bold mt-2">{userData.totalOrders}</p>
              </div>
              <span className="text-5xl opacity-50">📦</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Orders</p>
                <p className="text-4xl font-bold mt-2">{userData.activeOrders}</p>
              </div>
              <span className="text-5xl opacity-50">🚚</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Wishlist</p>
                <p className="text-4xl font-bold mt-2">{userData.wishlistItems}</p>
              </div>
              <span className="text-5xl opacity-50">❤️</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/products"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-4 group-hover:bg-green-200 transition-colors">
                <span className="text-3xl">🛍️</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Browse Products</h3>
                <p className="text-gray-600 text-sm">Discover new items</p>
              </div>
            </div>
          </Link>

          <Link
            href="/user/orders"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 rounded-full p-4 group-hover:bg-blue-200 transition-colors">
                <span className="text-3xl">📋</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">My Orders</h3>
                <p className="text-gray-600 text-sm">Track your purchases</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          <div className="space-y-4">
            <UserOrderItem
              orderId="#1234"
              productName="Wireless Headphones"
              date="Nov 10, 2025"
              status="Delivered"
              amount="$89.99"
            />
            <UserOrderItem
              orderId="#1233"
              productName="Smart Watch Pro"
              date="Nov 8, 2025"
              status="In Transit"
              amount="$199.99"
            />
            <UserOrderItem
              orderId="#1232"
              productName="USB-C Cable"
              date="Nov 5, 2025"
              status="Delivered"
              amount="$12.99"
            />
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/user/orders"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserOrderItem({ orderId, productName, date, status, amount }) {
  const statusStyles = {
    Delivered: 'bg-green-100 text-green-700 border-green-200',
    'In Transit': 'bg-blue-100 text-blue-700 border-blue-200',
    Processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  return (
    <div className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-green-200 transition-colors">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-bold text-gray-900">{productName}</p>
            <p className="text-sm text-gray-500">Order {orderId} • {date}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 mb-2">{amount}</p>
        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
