import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const ProductHeader = ({ title = "Product Details", onBack, actionButtons }) => {
  return (
    <div className="bg-background border-b border-border px-6 py-4 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-foreground tracking-tight">{title}</h1>
          </div>
        </div>
        {/* Inject specific buttons here (Seller only) */}
        <div className="flex items-center gap-3">
          {actionButtons}
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;