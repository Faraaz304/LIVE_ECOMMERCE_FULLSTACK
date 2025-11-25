'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, Trash2 } from 'lucide-react';

const ProductStateWrapper = ({ isLoading, error, product, onBack, backText, children }) => {
  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-16 h-16 bg-muted rounded-full" />
           <p className="text-muted-foreground font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center p-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
             <Trash2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The product you are looking for doesn't exist."}</p>
          <Button onClick={onBack} className="w-full">
            {backText}
          </Button>
        </Card>
      </div>
    );
  }

  // Success State
  return <>{children}</>;
};

export default ProductStateWrapper;