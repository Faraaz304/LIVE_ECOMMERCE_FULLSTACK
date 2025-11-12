'use client';

import React, { useState, useEffect } from 'react';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilterBar from '@/components/products/ProductsFilterBar';
import BulkActionsBar from '@/components/products/BulkActionsBar';
import EmptyProductsState from '@/components/products/EmptyProductsState';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductsTable from '@/components/products/ProductsTable';
import ProductsPagination from '@/components/products/ProductsPagination';

const ProductsPage = () => {
  const [currentView, setCurrentView] = useState('grid');
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8082/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const formattedProducts = data.map(p => ({
          id: p.id.toString(), // Ensure ID is string
          name: p.name,
          price: new Intl.NumberFormat('en-IN').format(p.price), // Format price for display
          stock: p.stock,
          status: p.live ? 'active' : 'inactive',
          imageUrl: p.imageUrl ? `http://localhost:8082${p.imageUrl}` : null,
          sku: p.sku || 'N/A', // Assuming SKU might be a field from API, added a fallback
          icon: p.icon || '🛍️' // Assuming an icon might be needed if no image, added a fallback
        }));
        setProducts(formattedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

  const handleMasterCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allProductIds = new Set(products.map((p) => p.id));
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const isAllSelected = selectedProductIds.size === products.length && products.length > 0;
  const isBulkActionsVisible = selectedProductIds.size > 0;

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} on products:`, Array.from(selectedProductIds));
    alert(`Bulk action "${action}" not implemented for real data. Check console.`);
    setSelectedProductIds(new Set());
  };

  // Placeholder for filter changes (actual filtering logic would go here)
  const handleSearchChange = (value) => console.log('Search:', value);
  const handleStatusFilterChange = (value) => console.log('Filter Status:', value);
  const handleCategoryFilterChange = (value) => console.log('Filter Category:', value);
  const handleSortFilterChange = (value) => console.log('Sort By:', value);


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
      <ProductsHeader />

      <ProductsFilterBar
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
        onCategoryFilterChange={handleCategoryFilterChange}
        onSortFilterChange={handleSortFilterChange}
        currentView={currentView}
        onSetView={setCurrentView}
      />

      <BulkActionsBar
        selectedProductCount={selectedProductIds.size}
        onBulkAction={handleBulkAction}
        isVisible={isBulkActionsVisible}
      />

      {products.length === 0 ? (
        <EmptyProductsState />
      ) : (
        <>
          <ProductsGrid
            products={products}
            selectedProductIds={selectedProductIds}
            handleCheckboxChange={handleCheckboxChange}
            currentView={currentView}
          />

          <ProductsTable
            products={products}
            selectedProductIds={selectedProductIds}
            handleCheckboxChange={handleCheckboxChange}
            handleMasterCheckboxChange={handleMasterCheckboxChange}
            isAllSelected={isAllSelected}
            currentView={currentView}
          />

          <ProductsPagination totalProducts={products.length} />
        </>
      )}
    </div>
  );
};

export default ProductsPage;