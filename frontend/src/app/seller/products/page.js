'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react'; // Icons

// Import the new components
import ProductFilterBar from '@/components/products/ProductFilterBar';
import ProductGridView from '@/components/products/ProductGridView';
import ProductListView from '@/components/products/ProductListView';

const ProductsPage = () => {
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

  // Memoized filter and sort logic
  const filteredAndSortedProducts = useCallback(() => {
    let currentProducts = products || [];

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        (product.name?.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (product.sku?.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      currentProducts = currentProducts.filter(product => {
        if (filterStatus === 'active') return product.live;
        if (filterStatus === 'inactive') return !product.live;
        if (filterStatus === 'out-of-stock') return product.stock === 0;
        return true;
      });
    }

    // Filter by category
    if (filterCategory !== 'all') {
      currentProducts = currentProducts.filter(product => product.category === filterCategory);
    }

    // Sort products
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

  const isAllSelected = selectedProductIds.size === displayedProducts.length && displayedProducts.length > 0;
  const isBulkActionsVisible = selectedProductIds.size > 0;

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

  const handleAddProductClick = () => {
    router.push('/seller/products/add');
  };

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading products...</div>;
  }

  if (error) {
    return <div className="h-screen flex items-center justify-center bg-slate-50 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your product catalog, prices, and stock levels.</p>
          </div>
          <Button
            size="lg"
            onClick={handleAddProductClick}
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>

        {/* Filter Bar */}
        <ProductFilterBar
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setFilterStatus}
          onCategoryFilterChange={setFilterCategory}
          onSortChange={setSortBy}
          currentView={currentView}
          onViewChange={setCurrentView}
          showBulkActions={isBulkActionsVisible}
          onBulkAction={handleBulkAction}
        />

        {/* Content Area */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-20 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {searchTerm || filterStatus !== 'all' ? 'No matching products' : 'No products found'}
            </h3>
            <p className="text-slate-500 mb-6 text-sm max-w-md mx-auto">
               {searchTerm || filterStatus !== 'all' ? 'Try adjusting your filters or search query.' : 'Get started by adding your first product to the inventory.'}
            </p>
            <Button variant="outline" onClick={handleAddProductClick}>
              Add New Product
            </Button>
          </div>
        ) : (
          currentView === 'grid' ? (
            <ProductGridView products={displayedProducts} onAddProductClick={handleAddProductClick} />
          ) : (
            <ProductListView
              products={displayedProducts}
              selectedProductIds={selectedProductIds}
              onCheckboxChange={handleCheckboxChange}
              onMasterCheckboxChange={handleMasterCheckboxChange}
              isAllSelected={isAllSelected}
              onDeleteProduct={handleDeleteProduct}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProductsPage;