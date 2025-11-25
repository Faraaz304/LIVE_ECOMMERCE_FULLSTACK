'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useProducts from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  Edit, 
  Trash2, 
  Package, 
  Tag, 
  Clock, 
  IndianRupee,
  Layers,
  Image as ImageIcon
} from 'lucide-react';

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { productid } = params;

  const { 
    product, 
    isLoading, 
    error, 
    getProductById, 
    deleteProduct 
  } = useProducts();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (productid) {
      getProductById(productid);
    }
  }, [productid, getProductById]);

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-16 h-16 bg-muted rounded-full" />
           <p className="text-muted-foreground font-medium">Retrieving product details...</p>
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
          <p className="text-muted-foreground mb-6">{error || "The product you are looking for doesn't exist or has been removed."}</p>
          <Button onClick={() => router.push('/seller/products')} className="w-full">
            Return to Inventory
          </Button>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; 
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
  if (!price) return price;
  const clean = price.toString().replace(/,/g, "").trim();
  if (clean.length > 15) return clean;
  const num = Number(clean);
  return isNaN(num) ? price : num.toLocaleString("en-IN");
};

  const handleDeleteProduct = async () => {
    setShowDeleteModal(false);
    try {
      const result = await deleteProduct(productid);
      if (result.success) {
        setTimeout(() => router.push('/seller/products'), 300);
      } else {
        alert(`Failed to delete product: ${result.error}`);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header / Breadcrumb Area */}
      <div className="bg-background border-b border-border px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-foreground tracking-tight">Product Details</h1>
              <span className="text-xs text-muted-foreground">ID: {product.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/seller/products/edit/${productid}`)}
              className="bg-background border-border"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Top Summary Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Image Column */}
          <div className="md:col-span-4 lg:col-span-4">
            <Card className="overflow-hidden border-border h-full shadow-sm bg-card">
              <div className="relative aspect-square bg-muted flex items-center justify-center group">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
                    <ImageIcon className="w-16 h-16" />
                    <span className="text-sm">No Image</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge className={product.live 
                    ? "bg-green-500 hover:bg-green-600 text-white border-0 shadow-md" 
                    : "bg-secondary text-secondary-foreground"
                  }>
                    {product.live ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Key Metrics Column */}
          <div className="md:col-span-8 lg:col-span-8 flex flex-col gap-6">
            <Card className="border-border shadow-sm flex-1">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div>
                    <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5">
                      {product.category || 'Uncategorized'}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                      {product.name}
                    </h1>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <IndianRupee className="w-4 h-4" /> Price
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        ₹{formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Package className="w-4 h-4" /> Stock
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-foreground">{product.stock}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                           {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted/40 border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <Layers className="w-4 h-4" /> Category
                      </div>
                      <div className="text-lg font-semibold text-foreground truncate" title={product.category}>
                        {product.category}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Description */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Product Description</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-6">
                <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description || 'No description provided for this product.'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Meta Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Metadata</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <div className="flex flex-col divide-y divide-border">
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4" /> ID
                    </span>
                    <span className="text-sm font-mono text-foreground">{product.id}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Created
                    </span>
                    <span className="text-sm text-foreground text-right">{formatDate(product.createdAt)}</span>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Edit className="w-4 h-4" /> Updated
                    </span>
                    <span className="text-sm text-foreground text-right">{formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-border shadow-2xl bg-card">
              <CardHeader>
                <CardTitle className="text-xl">Confirm Deletion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Are you sure you want to delete <span className="font-bold text-foreground">{product.name}</span>? This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-3 justify-end mt-6">
                  <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteProduct}>
                    Confirm Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;