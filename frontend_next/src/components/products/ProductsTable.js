import React from 'react';
import ProductTableRow from './ProductTableRow';

const ProductsTable = ({
  products,
  selectedProductIds,
  handleCheckboxChange,
  handleMasterCheckboxChange,
  isAllSelected,
  currentView,
}) => {
  return (
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
            <ProductTableRow
              key={product.id}
              product={product}
              isSelected={selectedProductIds.has(product.id)}
              onCheckboxChange={handleCheckboxChange}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;