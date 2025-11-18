import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils'; // Assuming cn utility

const ProductSelectionCard = ({
  productSelection,
  setProductSelection,
  products, // All available products from useProducts
  filteredProducts, // Filtered products based on search term
  isSubmittingReservation,
}) => {
  const handleProductSearchChange = (e) => {
    setProductSelection(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleProductSelect = (productId) => {
    setProductSelection(prev => {
      const newSelected = new Set(prev.selectedProductIds);
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
      const newSelected = new Set(prev.selectedProductIds);
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

        <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No products found.</p>
          ) : (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className={cn(
                  "flex gap-4 p-4 border-2 rounded-md cursor-pointer transition-all",
                  productSelection.selectedProductIds.has(product.id)
                    ? "border-primary-500 bg-primary-500/[0.05]"
                    : "border-gray-200 hover:border-primary-500 hover:bg-primary-500/[0.02]"
                )}
                onClick={() => handleProductSelect(product.id)}
                aria-disabled={isSubmittingReservation}
                tabIndex={isSubmittingReservation ? -1 : 0}
              >
                <Checkbox
                  checked={productSelection.selectedProductIds.has(product.id)}
                  onCheckedChange={() => handleProductSelect(product.id)}
                  className="mt-1"
                  disabled={isSubmittingReservation}
                />
                <img src={product.imageUrl} alt={product.name} className="w-[60px] h-[60px] rounded-md object-cover border border-gray-200" />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900 mb-1">{product.name}</div>
                  <div className="text-xs text-gray-500 mb-1">{product.meta}</div>
                  <div className="font-bold text-base text-primary-500">₹{product.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedProductsForDisplay.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              Selected Products ({selectedProductsForDisplay.length}):
            </div>
            <div>
              {selectedProductsForDisplay.map(product => (
                <span key={product.id} className="
                  inline-flex items-center gap-2 px-3 py-2 rounded-full
                  bg-primary-500 text-white text-xs mr-2 mb-2
                ">
                  {product.name}
                  <span
                    className="font-bold cursor-pointer"
                    onClick={() => handleRemoveSelectedProduct(product.id)}
                    aria-disabled={isSubmittingReservation}
                    tabIndex={isSubmittingReservation ? -1 : 0}
                  >
                    ✕
                  </span>
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