'use client';

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

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

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]); // Dependency array includes getAllProducts

  // Memoized filter and sort logic to avoid re-calculating on every render
  const filteredAndSortedProducts = useCallback(() => {
    let currentProducts = products || [];

    // Filter by search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProducts = currentProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.sku.toLowerCase().includes(lowerCaseSearchTerm) // Assuming SKU exists on product
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
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt); // Assuming `createdAt` field
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return currentProducts;
  }, [products, searchTerm, filterStatus, filterCategory, sortBy]);

  const displayedProducts = filteredAndSortedProducts();


  const handleCheckboxChange = (productId, isChecked) => {
    setSelectedProductIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(productId);
      } else {
        newSelected.delete(productId);
      }
      return newSelected;
    });
  };

  const handleMasterCheckboxChange = (isChecked) => { // Updated to receive boolean directly
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
        getAllProducts(); // Re-fetch products after deletion
      }
    } else {
      console.log(`Bulk action: ${action} on products:`, Array.from(selectedProductIds));
      alert(`Bulk action "${action}" not implemented yet.`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId);
      if (result && result.success) {
        getAllProducts(); // Re-fetch products after deletion
      }
    }
  };

  const handleAddProductClick = () => {
    router.push('/seller/products/add');
  };


  if (isLoading) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#6b7280]">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#ef4444]">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex-1">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#111827]">Products</h1>
        <Button
          size="lg"
          onClick={handleAddProductClick}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          ➕ Add Product
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
        isBulkActionsVisible={isBulkActionsVisible}
        onBulkAction={handleBulkAction}
      />


      {/* Conditionally render Grid or List View, or Empty State */}
      {displayedProducts.length === 0 ? (
        // Pass a handler for the "Add First Product" button
        <ProductGridView products={[]} onAddProductClick={handleAddProductClick} />
      ) : (
        currentView === 'grid' ? (
          <ProductGridView products={displayedProducts} />
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
  );
};

export default ProductsPage;