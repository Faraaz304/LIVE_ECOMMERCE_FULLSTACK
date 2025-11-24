import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Search, ShoppingBag, X, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductSelectionCard = ({
  productSelection,
  setProductSelection,
  products, 
  filteredProducts, 
  isSubmittingReservation,
}) => {
  
  const handleProductSearchChange = (e) => {
    setProductSelection(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleProductSelect = (productId) => {
    setProductSelection(prev => {
      const newSelected = new Set(prev.selectedProductIds || new Set());
      if (newSelected.has(productId)) newSelected.delete(productId); 
      else newSelected.add(productId);    
      return { ...prev, selectedProductIds: newSelected };
    });
  };

  const handleRemoveSelectedProduct = (productId) => {
    setProductSelection(prev => {
      const newSelected = new Set(prev.selectedProductIds || new Set());
      newSelected.delete(productId);
      return { ...prev, selectedProductIds: newSelected };
    });
  };

  const selectedProductsForDisplay = products.filter(p => productSelection.selectedProductIds.has(p.id));

  return (
    <Card className="border-border shadow-sm bg-card text-card-foreground overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20">
            <ShoppingBag size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Add Products</CardTitle>
            <CardDescription className="text-muted-foreground">Optional: Select items of interest</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            className="pl-9 border-input bg-background focus-visible:ring-primary"
            value={productSelection.searchTerm}
            onChange={handleProductSearchChange}
            disabled={isSubmittingReservation}
          />
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar bg-muted/10 p-2 rounded-lg border border-border">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">No products found matching your search.</div>
          ) : (
            filteredProducts.map(product => {
              const isSelected = productSelection.selectedProductIds.has(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => !isSubmittingReservation && handleProductSelect(product.id)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all select-none border group",
                    isSelected
                      ? "bg-card border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                      : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center transition-colors flex-shrink-0",
                    isSelected ? "bg-emerald-500 border-emerald-500" : "bg-background border-input group-hover:border-primary/50"
                  )}>
                    {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  
                  <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0 border border-border flex items-center justify-center">
                    {product.imageUrl ? (
                       <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                       <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground truncate">{product.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{product.sku || 'No SKU'}</div>
                  </div>
                  <div className="font-semibold text-sm text-foreground">
                    ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Tags */}
        {selectedProductsForDisplay.length > 0 && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Selected ({selectedProductsForDisplay.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProductsForDisplay.map(product => (
                <span key={product.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-medium border border-emerald-500/20">
                  {product.name}
                  <button
                    type="button"
                    className="hover:bg-emerald-500/20 rounded-full p-0.5 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSelectedProduct(product.id);
                    }}
                    disabled={isSubmittingReservation}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductSelectionCard;