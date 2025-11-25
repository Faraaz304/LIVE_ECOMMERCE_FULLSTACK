'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts'; 
import { Button } from '@/components/ui/button';
import { Plus, PackageOpen } from 'lucide-react';

import ProductFilterBar from '@/components/products/ProductFilterBar';
import ProductGridView from '@/components/products/ProductGridView';
import ProductListView from '@/components/products/ProductListView';

const SharedProductList = ({ basePath }) => {
  const router = useRouter();
  const { products, isLoading, error, getAllProducts, deleteProduct } = useProducts();

  const [currentView, setCurrentView] = useState('grid');
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // --- Filtering Logic (Same as before) ---
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

  // --- Handlers ---
  const handleCheckboxChange = (productId, isChecked) => {
    setSelectedProductIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isChecked) newSelected.add(productId);
      else newSelected.delete(productId);
      return newSelected;
    });
  };

  const handleMasterCheckboxChange = (isChecked) => {
    if (isChecked) {
      const allProductIds = new Set(displayedProducts.map((p) => p.id));
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleBulkAction = async (action) => {
    if (action === 'Delete Selected') {
      if (window.confirm(`Are you sure you want to delete ${selectedProductIds.size} products?`)) {
        for (const id of selectedProductIds) {
          await deleteProduct(id);
        }
        setSelectedProductIds(new Set());
        getAllProducts();
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId);
      if (result && result.success) {
        getAllProducts();
      }
    }
  };

  // --- Render ---
  if (isLoading) return <div className="h-screen flex items-center justify-center bg-muted/30 text-muted-foreground animate-pulse">Loading inventory...</div>;
  if (error) return <div className="h-screen flex items-center justify-center bg-muted/30 text-destructive">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your catalog, track stock, and organize products.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push(`${basePath}/products/add`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* Filters */}
        <ProductFilterBar
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setFilterStatus}
          onCategoryFilterChange={setFilterCategory}
          onSortChange={setSortBy}
          currentView={currentView}
          onViewChange={setCurrentView}
          showBulkActions={selectedProductIds.size > 0}
          onBulkAction={handleBulkAction}
        />

        {/* Content */}
        {displayedProducts.length === 0 ? (
          <div className="bg-card text-card-foreground rounded-xl border border-dashed border-border p-20 text-center shadow-sm">
            <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No matching products' : 'No products found'}
            </h3>
            <Button variant="outline" onClick={() => router.push(`${basePath}/products/add`)}>
              Add New Product
            </Button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {currentView === 'grid' ? (
              <ProductGridView 
                products={displayedProducts} 
                basePath={basePath} 
              />
            ) : (
              <ProductListView
                products={displayedProducts}
                selectedProductIds={selectedProductIds}
                onCheckboxChange={handleCheckboxChange}
                onMasterCheckboxChange={handleMasterCheckboxChange}
                isAllSelected={selectedProductIds.size === displayedProducts.length}
                onDeleteProduct={handleDeleteProduct}
                basePath={basePath}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedProductList;