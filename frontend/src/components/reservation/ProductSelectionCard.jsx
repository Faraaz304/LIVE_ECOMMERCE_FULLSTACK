import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
// REMOVE: import { Checkbox } from '@/components/ui/checkbox'; 
import { Check } from 'lucide-react'; // Import Check icon
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

      if (newSelected.has(productId)) {
        newSelected.delete(productId); 
      } else {
        newSelected.add(productId);    
      }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <span>🛍️</span> Product Selection (Optional)
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Select products the customer is interested in
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search Input */}
        <div className="relative mb-4">
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            className="pr-10"
            value={productSelection.searchTerm}
            onChange={handleProductSearchChange}
            disabled={isSubmittingReservation}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>

        {/* Product List */}
        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No products found.</p>
          ) : (
            filteredProducts.map(product => {
              const isSelected = productSelection.selectedProductIds.has(product.id);
              
              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex gap-4 p-4 border-2 rounded-md cursor-pointer transition-all select-none",
                    isSelected
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-500 hover:bg-gray-50"
                  )}
                  onClick={() => !isSubmittingReservation && handleProductSelect(product.id)}
                >
                  {/* --- REPLACEMENT START --- 
                      We replace the Shadcn Checkbox with a simple Div + Icon. 
                      This removes the internal Ref logic causing the crash.
                  */}
                  <div
                    className={cn(
                      "mt-1 h-4 w-4 shrink-0 rounded-sm border flex items-center justify-center",
                      isSelected 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "border-gray-400 bg-transparent"
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                  {/* --- REPLACEMENT END --- */}
                  
                  <img 
                    src={product.imageUrl || 'https://placehold.co/60x60?text=No+Img'} 
                    alt={product.name} 
                    className="w-[60px] h-[60px] rounded-md object-cover border border-gray-200" 
                  />
                  
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{product.name}</div>
                    <div className="text-xs text-gray-500 mb-1">
                      {product.sku ? `SKU: ${product.sku}` : product.meta}
                    </div>
                    <div className="font-bold text-base text-primary-600">
                      ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Tags Display */}
        {selectedProductsForDisplay.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Selected Products ({selectedProductsForDisplay.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedProductsForDisplay.map(product => (
                <span key={product.id} className="
                  inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-primary-100 text-primary-700 text-xs font-medium border border-primary-200
                ">
                  {product.name}
                  <button
                    type="button"
                    className="hover:text-primary-900 font-bold ml-1 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSelectedProduct(product.id);
                    }}
                    disabled={isSubmittingReservation}
                  >
                    ✕
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