import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ImagePlus, 
  Trash2, 
  Type, 
  AlignLeft, 
  IndianRupee, 
  Package, 
  Layers,
  FileText
} from 'lucide-react';

const ProductForm = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  imagePreview,
  setImageFile,
  setImagePreview,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* General Information */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> 
            General Information
          </h2>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="productName" className="text-sm font-medium text-foreground">
              Product Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                id="productName"
                placeholder="e.g., 22K Gold Traditional Necklace Set"
                maxLength="100"
                name="name"
                className="pl-9 bg-background border-input"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right">{formData.name.length}/100</p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="productDescription" className="text-sm font-medium text-foreground">
              Description <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="productDescription"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] pl-9 resize-y"
                placeholder="Detail product features, materials, and craftsmanship..."
                maxLength="1000"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              ></textarea>
            </div>
            <p className="text-xs text-muted-foreground text-right">{formData.description.length}/1000</p>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/20">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-primary" /> 
            Product Media
          </h2>
        </div>
        <div className="p-6">
          {!imagePreview ? (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-10 text-center hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => !isLoading && document.getElementById('fileInput').click()}
            >
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Click to upload image</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">SVG, PNG, JPG or GIF (max. 5MB)</p>
              <Button type="button" variant="outline" size="sm" disabled={isLoading} className="border-border bg-background">
                Select File
              </Button>
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isLoading}
              />
            </div>
          ) : (
            <div className="relative w-full max-w-md mx-auto rounded-xl overflow-hidden border border-border group bg-muted">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-contain sm:object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="shadow-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove Image
                  </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pricing */}
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
            <IndianRupee className="w-4 h-4 text-primary" /> Pricing
          </h2>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Base Price</label>
            <div className="relative">
               <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0.00"
                min="0"
                name="price"
                className="pl-9 bg-background border-input"
                value={formData.price}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" /> Inventory
          </h2>
           <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Quantity in Stock</label>
            <div className="relative">
               <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0"
                min="0"
                name="stock"
                className="pl-9 bg-background border-input"
                value={formData.stock}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden p-6">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" /> Organization
        </h2>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Category</label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) => handleSelectChange(value, 'category')}
            required
            disabled={isLoading}
          >
            <SelectTrigger className="w-full bg-background border-input text-foreground">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Jewelry">Jewelry</SelectItem>
              <SelectItem value="Kitchen">Kitchen</SelectItem>
              <SelectItem value="Bridal Collections">Bridal Collections</SelectItem>
              <SelectItem value="Cosmetics">Cosmetics</SelectItem>
              <SelectItem value="Stationary">Stationary</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  );
};

export default ProductForm;