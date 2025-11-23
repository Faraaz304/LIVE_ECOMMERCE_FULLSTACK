import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Box, ImageOff, Lightbulb } from 'lucide-react';

const ProductPreviewSidebar = ({
  formData,
  imagePreview,
  handleInputChange,
  isLoading,
}) => {
  const previewName = formData.name || 'Product Name';
  // formatting price safely
  const previewPrice = formData.price 
    ? Number(formData.price).toLocaleString('en-IN') 
    : '0';
  
  return (
    <div className="sticky top-24 space-y-6">
      
      {/* Visibility Control */}
      <Card className="border-border shadow-sm bg-card text-card-foreground">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Published</label>
            <p className="text-xs text-muted-foreground">Make visible to store</p>
          </div>
          <Switch 
             checked={formData.live}
             onCheckedChange={(checked) => handleInputChange({ target: { name: 'live', type: 'checkbox', checked }})}
             disabled={isLoading}
             className="data-[state=checked]:bg-primary"
          />
        </CardContent>
      </Card>

      {/* Live Preview Card */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Live Preview
        </h3>
        
        {/* Mirroring ProductCard.jsx style EXACTLY */}
        <Card className="overflow-hidden border-border bg-card text-card-foreground shadow-sm">
          <div className="relative aspect-[4/3] bg-muted overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-muted-foreground/30 flex flex-col items-center gap-2">
                 <ImageOff className="w-10 h-10" />
                 <span className="text-xs">No Image</span>
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Badge 
                className={formData.live 
                  ? "bg-green-500/90 hover:bg-green-500 text-white backdrop-blur-md border-none" 
                  : "backdrop-blur-md bg-background/80 text-foreground"
                }
              >
                {formData.live ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="mb-2">
              <h3 className="font-semibold text-foreground line-clamp-1 leading-tight mb-1">
                {previewName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formData.category || 'Uncategorized'}
              </p>
            </div>
            
            <div className="flex items-baseline justify-between mb-4">
               <span className="text-lg font-bold text-foreground">₹{previewPrice}</span>
            </div>

            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.stock > 0 ? 'bg-green-500' : 'bg-destructive'}`} />
                <span className={formData.stock > 0 ? 'text-muted-foreground' : 'text-destructive font-medium'}>
                  {formData.stock > 0 ? `${formData.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Helper Text */}
       <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <h5 className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5" /> Listing Tips
          </h5>
          <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-3">
            <li>Use high-quality, square images (1080x1080).</li>
            <li>Include specific keywords in your description.</li>
            <li>Keep your stock count accurate to avoid issues.</li>
          </ul>
        </div>
    </div>
  );
};

export default ProductPreviewSidebar;