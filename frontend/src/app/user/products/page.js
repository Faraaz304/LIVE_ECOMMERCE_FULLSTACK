'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useProducts from '@/hooks/useProducts';

// Import the shared components
import ProductFilterBar from '@/components/products/ProductFilterBar';
import ProductGridView from '@/components/products/ProductGridView';
import ProductListView from '@/components/products/ProductListView';

const UserProductsPage = () => {
  const { products, isLoading, error, getAllProducts } = useProducts(); // No deleteProduct needed here

  const [currentView, setCurrentView] = useState('grid');
  // No selectedProductIds needed for user view
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Memoized filter and sort logic remains the same
  const filteredAndSortedProducts = useCallback(() => {
    let currentProducts = products || [];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        (product.name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (product.sku?.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    if (filterStatus !== 'all') {
      currentProducts = currentProducts.filter(product => {
        if (filterStatus === 'active') return product.live;
        if (filterStatus === 'inactive') return !product.live;
        if (filterStatus === 'out-of-stock') return product.stock === 0;
        return true;
      });
    }

    if (filterCategory !== 'all') {
      currentProducts = currentProducts.filter(product => product.category === filterCategory);
    }

    currentProducts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : 0;
      const dateB = b.createdAt ? new Date(b.createdAt) : 0;

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'price-low') return (a.price ?? 0) - (b.price ?? 0);
      if (sortBy === 'price-high') return (b.price ?? 0) - (a.price ?? 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return currentProducts;
  }, [products, searchTerm, filterStatus, filterCategory, sortBy]);

  const displayedProducts = filteredAndSortedProducts();


  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-muted/30 text-muted-foreground animate-pulse">Loading products...</div>;
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-muted/30 text-destructive">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore Products</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Browse and discover products from our catalog.
            </p>
          </div>
        </div>

        {/* Filters */}
        <ProductFilterBar
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setFilterStatus}
          onCategoryFilterChange={setFilterCategory}
          onSortChange={setSortBy}
          currentView={currentView}
          onViewChange={setCurrentView}
          showBulkActions={false} // Crucial: Disable bulk actions for users
          // onBulkAction is not passed as showBulkActions is false
        />

        {/* Content */}
        {displayedProducts.length === 0 ? (
          <ProductGridView
            products={[]}
            showAddProductButton={false} // Crucial: Hide add product button
          />
        ) : (
          <div className="animate-in fade-in duration-500">
            {currentView === 'grid' ? (
              <ProductGridView
                products={displayedProducts}
                showAddProductButton={false} // Crucial: Hide add product button
              />
            ) : (
              <ProductListView
                products={displayedProducts}
                selectedProductIds={new Set()} // No selections for users
                onCheckboxChange={() => {}} // No-op for users
                onMasterCheckboxChange={() => {}} // No-op for users
                isAllSelected={false} // No selections for users
                onDeleteProduct={() => {}} // No-op for users
                showActions={false} // Crucial: Hide actions column and checkboxes for users
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProductsPage;