'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats from your API
    // This is a placeholder - replace with actual API calls
    setStats({
      totalUsers: 150,
      totalProducts: 45,
      totalOrders: 230,
      totalRevenue: 15420,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="bg-blue-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            color="bg-green-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="🛒"
            color="bg-purple-500"
          />
          <StatCard
            title="Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon="💰"
            color="bg-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ActionButton
              href="/admin/users"
              title="Manage Users"
              description="View and manage user accounts"
              icon="👤"
            />
            <ActionButton
              href="/admin/products"
              title="Manage Products"
              description="Add, edit, or remove products"
              icon="📦"
            />
            <ActionButton
              href="/admin/orders"
              title="View Orders"
              description="Track and manage orders"
              icon="📋"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="New order received"
              description="Order #1234 from John Doe"
              time="5 minutes ago"
            />
            <ActivityItem
              title="Product added"
              description="New product 'Wireless Headphones' added to catalog"
              time="1 hour ago"
            />
            <ActivityItem
              title="User registered"
              description="New user registration: jane@example.com"
              time="2 hours ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ href, title, description, icon }) {
  return (
    <Link
      href={href}
      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function ActivityItem({ title, description, time }) {
  return (
    <div className="flex items-start space-x-3 pb-4 border-b border-gray-200 last:border-0">
      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
