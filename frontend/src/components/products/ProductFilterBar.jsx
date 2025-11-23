import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, LayoutGrid, List, Filter, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const ProductFilterBar = ({
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onSortChange,
  currentView,
  onViewChange,
  showBulkActions = false,
  onBulkAction,
}) => {
  return (
    <div className="bg-card text-card-foreground p-4 rounded-xl border border-border shadow-sm">
      <div className="flex flex-col xl:flex-row gap-4 justify-between">
        
        {/* Left: Search & Filter Group */}
        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] sm:max-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-9 bg-background border-input focus-visible:ring-primary"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
             {/* Status */}
            <Select onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[130px] bg-background border-input text-foreground">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Category */}
            <Select onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-[140px] bg-background border-input text-foreground">
                 <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Jewelry">Jewelry</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Bridal Collections">Bridal</SelectItem>
                <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                <SelectItem value="Stationary">Stationary</SelectItem>
              </SelectContent>
            </Select>
            
             {/* Sort */}
            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-[140px] bg-background border-input text-foreground">
                 <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Actions & View */}
        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end pt-2 xl:pt-0 border-t xl:border-t-0 border-border">
          {showBulkActions && (
            <Select onValueChange={onBulkAction}>
              <SelectTrigger className="w-[150px] bg-destructive/10 border-destructive/20 text-destructive font-medium h-9 focus:ring-destructive">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delete Selected" className="text-destructive focus:bg-destructive/10">Delete Selected</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button
              onClick={() => onViewChange('grid')}
              className={cn(
                "p-2 rounded-md transition-all",
                currentView === 'grid' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={cn(
                "p-2 rounded-md transition-all",
                currentView === 'list' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductFilterBar;