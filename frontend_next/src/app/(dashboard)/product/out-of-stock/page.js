'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// NO METADATA EXPORT IN THIS FILE, as requested.

const dummyOutOfStockProducts = [
  {
    id: 'GE-22K-TMP-003',
    icon: '👂',
    name: '22K Gold Temple Jhumka Earrings',
    sku: 'GE-22K-TMP-003',
    category: 'Earrings',
    price: '85,000',
    stock: 0,
    lastUpdate: '3 days ago',
  },
  {
    id: 'GR-18K-SOL-007',
    icon: '💍',
    name: '18K Gold Solitaire Ring',
    sku: 'GR-18K-SOL-007',
    category: 'Rings',
    price: '95,000',
    stock: 0,
    lastUpdate: '1 week ago',
  },
  {
    id: 'GB-22K-DES-012',
    icon: '📿',
    name: '22K Gold Designer Bracelet',
    sku: 'GB-22K-DES-012',
    category: 'Bracelets',
    price: '78,000',
    stock: 0,
    lastUpdate: '5 days ago',
  },
  {
    id: 'GB-22K-PLN-015',
    icon: '⚪',
    name: '22K Gold Plain Bangles (Pair)',
    sku: 'GB-22K-PLN-015',
    category: 'Bangles',
    price: '125,000',
    stock: 0,
    lastUpdate: '2 days ago',
  },
  {
    id: 'GC-18K-LINK-020',
    icon: '🔗',
    name: '18K Gold Link Chain',
    sku: 'GC-18K-LINK-020',
    category: 'Chains',
    price: '55,000',
    stock: 0,
    lastUpdate: '4 days ago',
  },
];

const OutOfStockPage = () => {
  const [products, setProducts] = useState(dummyOutOfStockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockProductId, setRestockProductId] = useState(null);
  const [restockProductName, setRestockProductName] = useState('');
  const [restockProductIcon, setRestockProductIcon] = useState('');
  const [currentStockInModal, setCurrentStockInModal] = useState(0);
  const [restockQuantity, setRestockQuantity] = useState(1);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalOutOfStock = filteredProducts.length;
  const isBulkActionsVisible = selectedProductIds.size > 0;
  const isAllSelected = selectedProductIds.size === filteredProducts.length && filteredProducts.length > 0;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const toggleAllCheckboxes = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allProductIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedProductIds(allProductIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const showRestockModal = (productName, productId, icon, currentStock) => {
    setRestockProductName(productName);
    setRestockProductId(productId);
    setRestockProductIcon(icon);
    setCurrentStockInModal(currentStock);
    setRestockQuantity(1); // Reset quantity
    setIsRestockModalOpen(true);
  };

  const closeRestockModal = () => {
    setIsRestockModalOpen(false);
    setRestockProductId(null);
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    console.log(`Restocking product ${restockProductId} with quantity: ${restockQuantity}`);
    // Here you would typically make an API call to update the stock
    alert(`Product ${restockProductName} restocked with ${restockQuantity} units.`);
    setProducts((prev) =>
      prev.filter((p) => p.id !== restockProductId)
    ); // Remove from out of stock list
    closeRestockModal();
  };

  const handleBulkRestock = (selectedIds) => {
    console.log('Bulk restock initiated for:', Array.from(selectedIds));
    // Implement bulk restock logic here
    alert(`Bulk restock initiated for ${selectedIds.size} items.`);
    setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id))); // Remove selected from out of stock list
    setSelectedProductIds(new Set()); // Clear selection
  };


  return (
    <div className="p-8 flex-1 bg-[#f9fafb]">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#111827] flex items-center gap-3">
          Out of Stock Products
          <span
            className="py-1.5 px-3 rounded-lg text-sm font-semibold"
            style={{ background: '#fef2f2', color: '#dc2626' }}
          >
            ⚠️ {totalOutOfStock} Items
          </span>
        </h1>
        <p className="text-base text-[#6b7280] mt-2">
          Products that need restocking to continue selling
        </p>
      </div>

      {/* Alert Banner */}
      {totalOutOfStock > 0 && (
        <div
          className="rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center gap-4"
          style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
        >
          <div
            className="w-12 h-12 bg-[#fee2e2] rounded-full flex items-center justify-center text-2xl flex-shrink-0"
          >
            ⚠️
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-[#991b1b] mb-1">Attention Required!</h3>
            <p className="text-sm text-[#dc2626]">
              You have {totalOutOfStock} products out of stock. Restock these items to avoid missing sales
              opportunities.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              className="py-2.5 px-5 bg-[#dc2626] text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#b91c1c]"
              onClick={() => handleBulkRestock(selectedProductIds.size > 0 ? selectedProductIds : new Set(filteredProducts.map(p => p.id)))}
            >
              Restock All
            </button>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-lg">
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border-2 border-[#e5e7eb] rounded-lg text-sm transition-all focus:outline-none focus:border-[#667eea]"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <select
            className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
            onChange={(e) => console.log('Category Filter:', e.target.value)}
          >
            <option>All Categories</option>
            <option>Necklace Sets</option>
            <option>Rings</option>
            <option>Earrings</option>
            <option>Bridal Collections</option>
            <option>Bracelets</option>
            <option>Bangles</option>
          </select>
          <select
            className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer text-[#4b5563] focus:outline-none focus:border-[#667eea]"
            onChange={(e) => console.log('Sort By:', e.target.value)}
          >
            <option>Sort by: Last Updated</option>
            <option>Sort by: Price High-Low</option>
            <option>Sort by: Price Low-High</option>
            <option>Sort by: Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {isBulkActionsVisible && (
        <div
          className="rounded-lg p-3 mb-5 flex justify-between items-center"
          style={{ background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)' }}
        >
          <span className="text-[#dc2626] font-medium text-sm">
            {selectedProductIds.size} products selected
          </span>
          <button
            className="py-2 px-4 bg-white border border-[#fecaca] text-[#dc2626] rounded-lg text-sm font-semibold cursor-pointer"
            onClick={() => handleBulkRestock(selectedProductIds)}
          >
            Restock Selected
          </button>
        </div>
      )}

      {/* Products Table or Empty State */}
      {totalOutOfStock === 0 ? (
        <div
          className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center"
        >
          <div
            className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          >
            ✅
          </div>
          <h3 className="text-2xl font-bold text-[#374151] mb-2">All Products In Stock!</h3>
          <p className="text-base text-[#6b7280] mb-6">
            Great job! You don't have any products currently out of stock.
          </p>
          <Link
            href="/products/add"
            className="py-3 px-6 text-white rounded-lg text-base font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            ➕ Add New Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
                <th style={{ width: '50px' }} className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded-sm cursor-pointer accent-[#667eea]"
                    checked={isAllSelected}
                    onChange={toggleAllCheckboxes}
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Product</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Stock Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Last Update</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-[#fef2f2] last:border-b-0">
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      className="w-4.5 h-4.5 rounded-sm cursor-pointer accent-[#667eea]"
                      checked={selectedProductIds.has(product.id)}
                      onChange={(e) => handleCheckboxChange(product.id, e.target.checked)}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-50 rounded-lg border-2 border-[#e5e7eb] flex items-center justify-center text-3xl flex-shrink-0">
                        {product.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-[#374151] mb-1 truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-[#6b7280]">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-gray-100 py-1 px-2 rounded-md text-sm text-[#4b5563]">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-base font-semibold text-[#374151]">₹{product.price}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#dc2626] font-semibold text-sm">
                      <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span>
                      Out of Stock
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-[#6b7280]">{product.lastUpdate}</span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      className="py-2.5 px-4 text-white rounded-md text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px"
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                      onClick={() => showRestockModal(product.name, product.id, product.icon, product.stock)}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restock Modal */}
      {isRestockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-[#111827] mb-1">Restock Product</h3>
              <p className="text-sm text-[#6b7280]">Update the inventory for this product</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                {restockProductIcon}
              </div>
              <div className="text-base font-semibold text-[#374151]">{restockProductName}</div>
            </div>

            <form onSubmit={handleRestockSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-[#374151] mb-2">Quantity to Add</label>
                <input
                  type="number"
                  className="w-full py-3 px-4 border-2 border-[#e5e7eb] rounded-lg text-lg transition-all focus:outline-none focus:border-[#667eea] focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  required
                />
              </div>

              <div
                className="rounded-lg p-3 mb-6 flex justify-between items-center"
                style={{ background: '#fef2f2', border: '1px solid #fecaca' }}
              >
                <span className="text-sm text-[#6b7280]">Current Stock</span>
                <span className="text-lg font-bold text-[#dc2626]">{currentStockInModal}</span>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-2 border-[#e5e7eb] bg-white text-[#374151] hover:bg-gray-50"
                  onClick={closeRestockModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutOfStockPage;