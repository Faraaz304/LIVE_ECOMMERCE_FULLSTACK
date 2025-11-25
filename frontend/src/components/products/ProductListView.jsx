import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext
} from '@/components/ui/pagination';

const ProductListView = ({
  products,
  selectedProductIds,
  onCheckboxChange,
  onMasterCheckboxChange,
  isAllSelected,
  onDeleteProduct,
  basePath, // e.g. '/admin' or '/seller'
}) => {
  const router = useRouter();

  return (
    <>
      <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-3 px-4 w-[40px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={onMasterCheckboxChange}
                    className="border-muted-foreground/30 data-[state=checked]:border-primary"
                  />
                </th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="py-3 px-4">
                    <Checkbox
                      checked={selectedProductIds.has(product.id)}
                      onCheckedChange={(checked) => onCheckboxChange(product.id, checked)}
                      className="border-muted-foreground/30 data-[state=checked]:border-primary"
                    />
                  </td>
                  <td className="py-3 px-4">
                    {/* Dynamic Link */}
                    <Link
                      href={`${basePath}/products/view/${product.id}`}
                      className="flex items-center gap-3 group-hover:text-primary transition-colors"
                    >
                      <div className="w-10 h-10 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-border">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">📦</div>
                        )}
                      </div>
                      <span className="font-medium text-foreground text-sm line-clamp-1">{product.name}</span>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{product.category || '—'}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">₹{product.price}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={product.stock === 0 ? 'text-destructive font-medium' : 'text-foreground'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {product.live ? (
                      <Badge variant="outline" className="border-green-500/30 text-green-600 bg-green-500/10">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        // Dynamic Edit Link
                        onClick={() => router.push(`${basePath}/products/edit/${product.id}`)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProduct(product.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination UI remains the same... */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* ... (Existing pagination code) ... */}
      </div>
    </>
  );
};

export default ProductListView;