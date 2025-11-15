'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/productCard';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

const ProductsPage = () => {
  const router = useRouter();
  const { products, isLoading, error, getAllProducts, deleteProduct } = useProducts();

  const [currentView, setCurrentView] = useState('grid');
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  

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

  const handleBulkAction = async (action) => {
    if (action === 'Delete Selected') {
      if (window.confirm(`Are you sure you want to delete ${selectedProductIds.size} products?`)) {
        for (const id of selectedProductIds) {
          await deleteProduct(id);
        }
        setSelectedProductIds(new Set());
        getAllProducts();
      }
    } else {
      console.log(`Bulk action: ${action} on products:`, Array.from(selectedProductIds));
      alert(`Bulk action "${action}" not implemented yet.`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(productId);
      if (result.success) {
        getAllProducts();
      }
    }
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
          onClick={() => router.push('/seller/products/add')}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          ➕ Add Product
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
              <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
            </span>
            <Input
              type="text"
              placeholder="Search by name or SKU..."
              className="pl-10"
              onChange={(e) => console.log('Search:', e.target.value)}
            />
          </div>

          <Select onValueChange={(value) => console.log('Filter Status:', value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => console.log('Filter Category:', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="necklace-sets">Necklace Sets</SelectItem>
              <SelectItem value="rings">Rings</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
              <SelectItem value="bridal">Bridal Collections</SelectItem>
              <SelectItem value="bracelets">Bracelets</SelectItem>
              <SelectItem value="bangles">Bangles</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => console.log('Sort By:', value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by: Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort by: Newest</SelectItem>
              <SelectItem value="oldest">Sort by: Oldest</SelectItem>
              <SelectItem value="price-low">Sort by: Price Low-High</SelectItem>
              <SelectItem value="price-high">Sort by: Price High-Low</SelectItem>
              <SelectItem value="name">Sort by: Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant={currentView === 'grid' ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => setCurrentView('grid')}
            >
              📱
            </Button>
            <Button
              variant={currentView === 'list' ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => setCurrentView('list')}
            >
              📋
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {isBulkActionsVisible && (
        <div className="bg-[#667eea]/[0.1] border border-[#667eea]/[0.2] rounded-lg p-3 mb-5 flex justify-between items-center">
          <span className="text-[#667eea] font-medium text-sm">
            {selectedProductIds.size} products selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBulkAction('Change Status')}
            >
              Change Status
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleBulkAction('Delete Selected')}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Products Grid View */}
      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-[#374151] mb-2">No Products Found</h3>
          <p className="text-base text-[#6b7280] mb-6">
            It looks like you haven't added any products yet.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/seller/products/add')}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
          >
            ➕ Add Your First Product
          </Button>
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
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleMasterCheckboxChange}
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
                      <Checkbox
                        checked={selectedProductIds.has(product.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(product.id, checked)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <Link href={`/seller/products/view/${product.id}`} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded-md" />
                          ) : (
                              '📦'
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
                      <Badge variant={product.status === 'active' ? 'success' : 'inactive'}>
                        {product.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => router.push(`/seller/products/edit/${product.id}`)}
                        >
                          ✏️
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                        >
                          🗑️
                        </Button>
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
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious className="cursor-not-allowed opacity-50" />
                </PaginationItem>
                <PaginationItem>
                  <Button variant="outline" size="icon-sm">1</Button>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductsPage;