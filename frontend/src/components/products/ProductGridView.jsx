import React from 'react';
import ProductCard from '@/components/products/productCard'; // Assuming this path
import { useRouter } from 'next/navigation'; // Only if ProductCard or this component needs it directly
import { Button } from '@/components/ui/button';

const ProductGridView = ({ products, onAddProductClick }) => {
  const router = useRouter(); // If you need router directly here for the add product button

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-[#374151] mb-2">No Products Found</h3>
        <p className="text-base text-[#6b7280] mb-6">
          It looks like you haven't added any products yet.
        </p>
        <Button
          size="lg"
          onClick={onAddProductClick}
          className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
        >
          ➕ Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div
      id="gridView"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          // Pass any other necessary props to ProductCard, e.g., onDelete, onEdit
        />
      ))}
    </div>
  );
};

export default ProductGridView;