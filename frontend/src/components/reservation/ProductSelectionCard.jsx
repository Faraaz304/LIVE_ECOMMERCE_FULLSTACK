import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Search, ShoppingBag, X } from 'lucide-react';
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
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <ShoppingBag size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Add Products</CardTitle>
            <CardDescription className="text-slate-500">Optional: Select items of interest</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            className="pl-9 border-slate-200 focus:ring-slate-900 focus:border-slate-900"
            value={productSelection.searchTerm}
            onChange={handleProductSearchChange}
            disabled={isSubmittingReservation}
          />
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar bg-slate-50/50 p-2 rounded-lg border border-slate-100">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No products found matching your search.</div>
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
                      ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:border-slate-400"
                  )}
                >
                  <div className={cn(
                    "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                    isSelected ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300 group-hover:border-slate-400"
                  )}>
                    {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                  
                  <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                     <img src={product.imageUrl || 'https://placehold.co/60x60'} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">{product.name}</div>
                    <div className="text-xs text-slate-500 truncate">{product.sku || 'No SKU'}</div>
                  </div>
                  <div className="font-semibold text-sm text-slate-700">
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
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Selected ({selectedProductsForDisplay.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProductsForDisplay.map(product => (
                <span key={product.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                  {product.name}
                  <button
                    type="button"
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
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