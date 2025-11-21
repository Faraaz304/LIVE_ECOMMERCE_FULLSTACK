'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box } from 'lucide-react';

// Safe price formatter — NEVER produces NaN
const formatPrice = (price) => {
  if (!price) return price;

  const clean = price.toString().replace(/,/g, "").trim();

  // If price is too large for JS number, return as-is (string)
  if (clean.length > 15) return clean;

  const num = Number(clean);
  return isNaN(num) ? price : num.toLocaleString("en-IN");
};

const ProductCard = ({ product }) => {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    setCurrentUserRole(storedRole);
  }, []);

  const handleCardClick = () => {
    let path = `/user/products/view/${product.id}`;
    if (currentUserRole === 'SELLER') {
      path = `/seller/products/view/${product.id}`;
    }
    router.push(path);
  };

  return (
    <Card
      className="group overflow-hidden border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <Box className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {product.live ? (
            <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm">
              Active
            </Badge>
          ) : (
            <Badge className="bg-slate-900/70 text-white hover:bg-slate-900/80 border-0 backdrop-blur-sm">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors mb-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-lg font-bold text-slate-900">
            ₹{formatPrice(product.price)}
          </span>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between text-xs pt-3 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <span
              className={
                product.stock > 0
                  ? 'text-slate-600'
                  : 'text-red-600 font-medium'
              }
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <span className="text-slate-400">
            {product.category || 'Uncategorized'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

