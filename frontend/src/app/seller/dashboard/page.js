'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SellerDashboard() {
  const [stats, setStats] = useState({
    myProducts: 0,
    pendingOrders: 0,
    totalSales: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    // Fetch seller stats from API
    setStats({
      myProducts: 12,
      pendingOrders: 5,
      totalSales: 87,
      monthlyRevenue: 3450,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your products and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">My Products</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats.myProducts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Total Sales</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalSales}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">${stats.monthlyRevenue}</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/seller/products/add"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-4">
                <span className="text-4xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Add New Product</h3>
                <p className="text-blue-100 mt-1">List a new item for sale</p>
              </div>
            </div>
          </Link>

          <Link
            href="/seller/products"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-gray-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-full p-4">
                <span className="text-4xl">📦</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">My Products</h3>
                <p className="text-gray-600 mt-1">View and manage your listings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/seller/orders" className="text-purple-600 hover:text-purple-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            <OrderItem
              orderId="#ORD-1234"
              product="Wireless Headphones"
              customer="John Doe"
              amount="$89.99"
              status="Pending"
            />
            <OrderItem
              orderId="#ORD-1233"
              product="Smart Watch"
              customer="Jane Smith"
              amount="$199.99"
              status="Shipped"
            />
            <OrderItem
              orderId="#ORD-1232"
              product="Laptop Stand"
              customer="Mike Johnson"
              amount="$45.00"
              status="Delivered"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderItem({ orderId, product, customer, amount, status }) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Shipped: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{orderId}</p>
        <p className="text-sm text-gray-600">{product}</p>
        <p className="text-xs text-gray-500 mt-1">Customer: {customer}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900">{amount}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
