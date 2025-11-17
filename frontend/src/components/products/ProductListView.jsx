import React from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';

const ProductListView = ({
  products,
  selectedProductIds,
  onCheckboxChange,
  onMasterCheckboxChange,
  isAllSelected,
  onDeleteProduct,
  showActions = true, // New prop, defaults to true
}) => {
  const router = useRouter();

  return (
    <>
      <div
        id="listView"
        className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden mb-8"
      >
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
              {showActions && ( // Conditionally render master checkbox
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onMasterCheckboxChange}
                  />
                </th>
              )}
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Product</th>
              {/* Removed SKU column header */}
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Price</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Stock</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Status</th>
              {showActions && ( // Conditionally render Actions column header
                <th className="py-3 px-4 text-left text-sm font-semibold text-[#374151]">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                {showActions && ( // Conditionally render individual checkboxes
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedProductIds.has(product.id)}
                      onCheckedChange={(checked) => onCheckboxChange(product.id, checked)}
                    />
                  </td>
                )}
                <td className="py-4 px-4">
                  <Link
                    href={showActions ? `/seller/products/view/${product.id}` : `/user/products/view/${product.id}`}
                    className="flex items-center gap-3"
                  >
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
                {/* Removed SKU data cell */}
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
                  <Badge variant={product.live ? 'success' : 'inactive'}>
                    {product.live ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                {showActions && ( // Conditionally render Actions column cells
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
                          onDeleteProduct(product.id);
                        }}
                      >
                        🗑️
                      </Button>
                    </div>
                  </td>
                )}
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
  );
};

export default ProductListView;