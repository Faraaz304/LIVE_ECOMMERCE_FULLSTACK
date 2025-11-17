'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/seller/products/view/${product.id}`);
  };

  return (
    <Card
      key={product.id}
      className="overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-px cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative bg-gray-50 h-52 flex items-center justify-center text-6xl">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          product.icon
        )}

        <Badge
          variant={product.status === 'active' ? 'success' : 'inactive'}
          className="absolute top-3 right-3"
        >
          {product.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <CardContent className="p-4">
        <h3 className="text-base font-semibold text-[#374151] mb-2 truncate">
          {product.name}
        </h3>
        <div className="text-2xl font-bold text-[#667eea] mb-2">₹{product.price}</div>
        <div className="flex justify-between items-center text-sm text-[#6b7280]">
          <span>
            Stock:{' '}
            <span
              className={`font-semibold ${
                product.stock === 0 ? 'text-[#ef4444]' : 'text-[#374151]'
              }`}
            >
              {product.stock}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;