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
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your products and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-primary">
            <p className="text-muted-foreground text-sm font-medium">My Products</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.myProducts}</p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-chart-1">
            <p className="text-muted-foreground text-sm font-medium">Pending Orders</p>
            <p className="text-3xl font-bold text-chart-1 mt-2">{stats.pendingOrders}</p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-chart-5">
            <p className="text-muted-foreground text-sm font-medium">Total Sales</p>
            <p className="text-3xl font-bold text-chart-5 mt-2">{stats.totalSales}</p>
          </div>
          <div className="bg-card rounded-lg shadow-md p-6 border-l-4 border-chart-2">
            <p className="text-muted-foreground text-sm font-medium">Monthly Revenue</p>
            <p className="text-3xl font-bold text-chart-2 mt-2">${stats.monthlyRevenue}</p>
          </div>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/seller/products/add"
            className="bg-primary text-primary-foreground rounded-lg shadow-md p-8 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-foreground/20 rounded-full p-4">
                <span className="text-4xl">➕</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Add New Product</h3>
                <p className="text-primary-foreground/80 mt-1">List a new item for sale</p>
              </div>
            </div>
          </Link>

          <Link
            href="/seller/products"
            className="bg-card rounded-lg shadow-md p-8 hover:shadow-lg transition-all border-2 border-border"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-accent rounded-full p-4">
                <span className="text-4xl">📦</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">My Products</h3>
                <p className="text-muted-foreground mt-1">View and manage your listings</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-card-foreground">Recent Orders</h2>
            <Link href="/seller/orders" className="text-primary hover:text-primary/80 font-medium">
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
    Pending: 'bg-muted text-muted-foreground',
    Shipped: 'bg-chart-2/20 text-chart-2',
    Delivered: 'bg-chart-5/20 text-chart-5',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="flex-1">
        <p className="font-semibold text-foreground">{orderId}</p>
        <p className="text-sm text-muted-foreground">{product}</p>
        <p className="text-xs text-muted-foreground mt-1">Customer: {customer}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-foreground">{amount}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${statusColors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
}
