'use client';

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProductCard = ({ product }) => {
  const router = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState(null); // State to store the user's role

  useEffect(() => {
    // Read the user's role from localStorage when the component mounts
    const role = localStorage.getItem('userRole');
    setCurrentUserRole(role);
  }, []); // Empty dependency array means this runs once on mount

  const handleCardClick = () => {
    let path = `/user/products/view/${product.id}`; // Default path for a general user

    // If the current user is a SELLER, redirect to the seller's specific view page
    if (currentUserRole === 'SELLER') {
      path = `/seller/products/view/${product.id}`;
    }
    // You could add other role-based logic here if needed (e.g., for ADMIN)

    router.push(path);
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
          product.icon // Fallback if no image URL, assuming 'icon' exists or display a default placeholder
        )}

        <Badge
          // Assuming 'product.live' indicates the active status, aligning with Add/Edit pages
          variant={product.live ? 'success' : 'inactive'}
          className="absolute top-3 right-3"
        >
          {product.live ? 'Active' : 'Inactive'}
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