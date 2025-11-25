'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageOff } from 'lucide-react';

const formatPrice = (price) => {
  if (!price) return price;
  const clean = price.toString().replace(/,/g, "").trim();
  const num = Number(clean);
  return isNaN(num) ? price : num.toLocaleString("en-IN");
};

const ProductCard = ({ product, basePath = '/user' }) => {
  const router = useRouter();

  const handleCardClick = () => {
    // Dynamically route based on the base path passed from the parent
    router.push(`${basePath}/products/view/${product.id}`);
  };

  return (
    <Card
      className="group overflow-hidden border-border bg-card text-card-foreground hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ImageOff className="w-12 h-12" />
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.live ? (
            <Badge className="bg-green-500/90 hover:bg-green-500 text-white backdrop-blur-md border-none shadow-sm">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 hover:bg-background/90 text-foreground shadow-sm">
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {product.category || 'Uncategorized'}
          </p>
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-lg font-bold text-foreground">
            ₹{formatPrice(product.price)}
          </span>
        </div>

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
            <span className={product.stock > 0 ? 'text-muted-foreground' : 'text-destructive font-medium'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;