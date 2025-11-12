'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/products/ProductCard'; // Corrected import path

// NO METADATA EXPORT IN THIS FILE, as requested.

const ProductsPage = () => {
  const router = useRouter();

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
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Products</h1>
        </div>
        <button
          className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
          }}
          onClick={() => router.push('/seller/products/add')}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
        >
          ➕ Add Product
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
            </span>
            <input
              type="text"
              id="searchInput"
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-4 py-2 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
              onChange={(e) => console.log('Search:', e.target.value)}
            />
          </div>

          <select
            className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
            id="statusFilter"
            onChange={(e) => console.log('Filter Status:', e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Out of Stock</option>
          </select>

          <select
            className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
            id="categoryFilter"
            onChange={(e) => console.log('Filter Category:', e.target.value)}
          >
            <option>All Categories</option>
            <option value="Necklace Sets">Necklace Sets</option>
            <option value="Rings">Rings</option>
            <option value="Earrings">Earrings</option>
            <option value="Bridal Collections">Bridal Collections</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Bangles">Bangles</option>
            <option value="study">Study</option>
          </select>

          <select
            className="py-2 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
            id="sortFilter"
            onChange={(e) => console.log('Sort By:', e.target.value)}
          >
            <option>Sort by: Newest</option>
            <option>Sort by: Oldest</option>
            <option>Sort by: Price Low-High</option>
            <option>Sort by: Price High-Low</option>
            <option>Sort by: Name A-Z</option>
          </select>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              className={`p-2 rounded-md cursor-pointer transition-all text-xl ${
                currentView === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setCurrentView('grid')}
            >
              📱
            </button>
            <button
              className={`p-2 rounded-md cursor-pointer transition-all text-xl ${
                currentView === 'list' ? 'bg-white shadow-sm' : ''
              }`}
              onClick={() => setCurrentView('list')}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div
        className={`bg-[#667eea]/[0.1] border border-[#667eea]/[0.2] rounded-lg p-3 mb-5 flex justify-between items-center ${
          isBulkActionsVisible ? 'flex' : 'hidden'
        }`}
      >
        <span className="text-[#667eea] font-medium text-sm">
          {selectedProductIds.size} products selected
        </span>
        <div className="flex gap-2">
          <button onClick={() => handleBulkAction('Change Status')} className="py-2 px-4 bg-white border border-gray-300 rounded-lg cursor-pointer text-sm font-medium text-[#374151] transition-all hover:bg-gray-50">
            Change Status
          </button>
          <button onClick={() => handleBulkAction('Delete Selected')} className="py-2 px-4 bg-white border border-[#fecaca] rounded-lg cursor-pointer text-sm font-medium text-[#ef4444] transition-all hover:bg-gray-50">
            Delete Selected
          </button>
        </div>
      </div>

      {/* Products Grid View */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-[#374151] mb-2">No Products Found</h3>
          <p className="text-base text-[#6b7280] mb-6">
            It looks like you haven't added any products yet.
          </p>
          <Link
            href="/product/add"
            className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            ➕ Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <div
            id="gridView"
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8 ${
              currentView === 'grid' ? 'block' : 'hidden'
            }`}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selectedProductIds={selectedProductIds}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </div>

          {/* Products List View */}
          <div
            id="listView"
            className={`bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-8 ${
              currentView === 'list' ? 'block' : 'hidden'
            }`}
          >
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded-sm cursor-pointer accent-[#667eea]"
                      checked={isAllSelected}
                      onChange={handleMasterCheckboxChange}
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Product</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">SKU</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Price</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Stock</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-sm cursor-pointer accent-[#667eea]"
                        checked={selectedProductIds.has(product.id)}
                        onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/product/view/${product.id}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
                          ) : (
                              product.icon
                          )}
                        </div>
                        <span className="font-medium text-[#374151] text-sm">{product.name}</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#6b7280]">{product.sku}</td>
                    <td className="py-4 px-4 text-sm font-medium text-[#111827]">₹{product.price}</td>
                    <td className="py-4 px-4 text-sm">
                      <span
                        className={`font-medium ${
                          product.stock === 0 ? 'text-[#ef4444]' : 'text-[#374151]'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-semibold ${
                          product.status === 'active'
                            ? 'bg-[#d1fae5] text-[#065f46]'
                            : 'bg-gray-100 text-[#4b5563]'
                        }`}
                      >
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/product/edit/${product.id}`)}
                          className="p-1.5 rounded-md cursor-pointer text-[#6b7280] transition-all hover:bg-gray-100 hover:text-[#667eea]"
                        >
                          ✏️
                        </button>
                        <button
                           onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            alert('Delete product (functionality not implemented)');
                          }}
                          className="p-1.5 rounded-md cursor-pointer text-[#6b7280] transition-all hover:bg-gray-100 hover:text-[#667eea]"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex justify-between items-center">
            <div className="text-sm text-[#6b7280]">
              Showing <span className="font-semibold text-[#374151]">1</span> to{' '}
              <span className="font-semibold text-[#374151]">{products.length}</span> of{' '}
              <span className="font-semibold text-[#374151]">{products.length}</span> results
            </div>
            <div className="flex gap-2">
              <button className="py-2 px-4 border-2 border-[#e5e7eb] bg-white rounded-lg text-sm font-medium cursor-not-allowed text-[#374151] opacity-50">
                Previous
              </button>
              <button className="py-2 px-4 border-2 border-[#667eea] bg-[#667eea] text-white rounded-lg text-sm font-medium cursor-pointer">
                1
              </button>
              <button className="py-2 px-4 border-2 border-[#e5e7eb] bg-white rounded-lg text-sm font-medium cursor-pointer text-[#374151] hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;