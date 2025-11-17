import React from 'react';
import ProductCard from '@/components/products/productCard';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ProductGridView = ({ products, onAddProductClick, showAddProductButton = true }) => {
  const router = useRouter();

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#e5e7eb] p-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-2xl font-bold text-[#374151] mb-2">
          {showAddProductButton ? 'No Products Found' : 'No products match your criteria'}
        </h3>
        <p className="text-base text-[#6b7280] mb-6">
          {showAddProductButton
            ? "It looks like you haven't added any products yet."
            : "Try adjusting your filters or search term."}
        </p>
        {showAddProductButton && (
          <Button
            size="lg"
            onClick={onAddProductClick}
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] hover:opacity-90"
          >
            ➕ Add Your First Product
          </Button>
        )}
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
        />
      ))}
    </div>
  );
};

export default ProductGridView;