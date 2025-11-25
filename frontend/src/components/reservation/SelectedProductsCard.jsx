import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingBag, IndianRupee } from 'lucide-react';

const SelectedProductsCard = ({ products, isLoading, totalValue }) => {
  return (
    <Card className="h-full shadow-sm border-border bg-card text-card-foreground flex flex-col">
      <CardHeader className="pb-4 border-b border-border bg-muted/30">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-emerald-500" /> Selected Products
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 flex-1 flex flex-col">
        
        {isLoading ? (
          <div className="space-y-4" >
            
             {[1, 2, 3].map(i => (
               <div key={i} className="h-20 bg-muted animate-pulse rounded-lg border border-border"></div>
             ))}
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-3 flex-1">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex gap-3 p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors bg-background"
              >
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-14 h-14 object-cover rounded-md bg-muted border border-border" 
                  />
                ) : (
                  <div className="w-14 h-14 bg-muted rounded-md flex items-center justify-center text-muted-foreground border border-border">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
                  <div className="flex items-center justify-between mt-1">
                     <p className="text-xs text-muted-foreground truncate max-w-[120px]">{product.category}</p>
                     <p className="text-sm font-bold text-foreground">₹{product.price ? product.price.toLocaleString('en-IN') : '0'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 flex flex-col items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border">
            <ShoppingBag className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">No specific products selected</p>
          </div>
        )}
        
        {products.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-1">
               <span className="text-sm text-muted-foreground">Items Count</span>
               <span className="text-sm font-medium text-foreground">{products.length}</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-base text-foreground font-semibold">Estimated Total</span>
              <span className="text-2xl font-bold text-primary flex items-center">
                <IndianRupee className="w-5 h-5 mr-0.5" />
                {totalValue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default SelectedProductsCard;