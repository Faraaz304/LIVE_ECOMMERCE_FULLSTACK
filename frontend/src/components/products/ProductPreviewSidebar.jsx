import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Box } from 'lucide-react';

const ProductPreviewSidebar = ({
  formData,
  imagePreview,
  handleInputChange,
  isLoading,
}) => {
  const previewName = formData.name || 'Product Name';
  const previewPrice = formData.price ? Number(formData.price).toLocaleString('en-IN') : '0';
  
  return (
    <div className="sticky top-24 space-y-6">
      
      {/* Visibility Control */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium text-slate-900">Published</label>
            <p className="text-xs text-slate-500">Make this product visible to customers</p>
          </div>
          <Switch 
             checked={formData.live}
             onCheckedChange={(checked) => handleInputChange({ target: { name: 'live', type: 'checkbox', checked }})}
             disabled={isLoading}
             className="data-[state=checked]:bg-indigo-600"
          />
        </CardContent>
      </Card>

      {/* Live Preview Card */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <Eye className="w-4 h-4" /> Live Preview
        </h3>
        
        {/* Mirroring ProductCard.jsx style */}
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-slate-300 flex flex-col items-center gap-2">
                 <Box className="w-10 h-10" />
                 <span className="text-xs">No Image</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge variant={formData.live ? 'default' : 'secondary'} className={formData.live ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-900/70 text-white"}>
                {formData.live ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900 line-clamp-2 leading-tight mb-3">
              {previewName}
            </h3>
            
            <div className="flex items-baseline justify-between">
               <span className="text-lg font-bold text-slate-900">₹{previewPrice}</span>
            </div>

             <div className="flex items-center justify-between text-xs pt-3 mt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${formData.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <span className={formData.stock > 0 ? 'text-slate-600' : 'text-red-600 font-medium'}>
                    {formData.stock > 0 ? `${formData.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <span className="text-slate-400">{formData.category || 'Uncategorized'}</span>
              </div>
          </CardContent>
        </Card>
      </div>

      {/* Helper Text */}
       <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
          <h5 className="text-xs font-semibold text-indigo-700 mb-2">Listing Tips</h5>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-3">
            <li>Use high-quality, well-lit images (1080x1080).</li>
            <li>Include keywords in your description for search.</li>
            <li>Double check your inventory count.</li>
          </ul>
        </div>

    </div>
  );
};

export default ProductPreviewSidebar;