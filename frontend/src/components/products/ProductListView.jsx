import React from 'react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2 } from 'lucide-react';

const ProductListView = ({
  products,
  selectedProductIds,
  onCheckboxChange,
  onMasterCheckboxChange,
  isAllSelected,
  onDeleteProduct,
  showActions = true,
}) => {
  const router = useRouter();

  return (
    <>
      <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {showActions && (
                  <th className="py-3 px-4 w-[40px]">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={onMasterCheckboxChange}
                      className="border-muted-foreground/30 data-[state=checked]:border-primary"
                    />
                  </th>
                )}
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                {showActions && (
                  <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors group">
                  {showActions && (
                    <td className="py-3 px-4">
                      <Checkbox
                        checked={selectedProductIds.has(product.id)}
                        onCheckedChange={(checked) => onCheckboxChange(product.id, checked)}
                        className="border-muted-foreground/30 data-[state=checked]:border-primary"
                      />
                    </td>
                  )}
                  <td className="py-3 px-4">
                    <Link
                      href={showActions ? `/seller/products/view/${product.id}` : `/user/products/view/${product.id}`}
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
                  {showActions && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                          onClick={() => router.push(`/seller/products/edit/${product.id}`)}
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">1</span> to{' '}
          <span className="font-medium text-foreground">{products.length}</span> results
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className="cursor-not-allowed opacity-50" />
            </PaginationItem>
            <PaginationItem>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-primary text-primary-foreground border-primary hover:bg-primary/90">1</Button>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default ProductListView;