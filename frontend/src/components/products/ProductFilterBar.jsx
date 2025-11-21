import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Left Side: Search & Filters */}
        <div className="flex flex-1 w-full gap-3 flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
             {/* Status Filter */}
            <Select onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[140px] border-slate-200 text-slate-600">
                <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 opacity-70" />
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

            {/* Category Filter */}
            <Select onValueChange={onCategoryFilterChange}>
              <SelectTrigger className="w-[150px] border-slate-200 text-slate-600">
                 <div className="flex items-center gap-2 truncate">
                  <Filter className="w-3.5 h-3.5 opacity-70" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Jewelry">Jewelry</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Bridal Collections">Bridal Collections</SelectItem>
                <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                <SelectItem value="Stationary">Stationary</SelectItem>
              </SelectContent>
            </Select>
            
             {/* Sort */}
            <Select onValueChange={onSortChange}>
              <SelectTrigger className="w-[140px] border-slate-200 text-slate-600">
                 <div className="flex items-center gap-2 truncate">
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                  <SelectValue placeholder="Sort By" />
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

        {/* Right Side: Bulk Actions & View Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          {showBulkActions && (
            <Select onValueChange={onBulkAction}>
              <SelectTrigger className="w-[160px] bg-indigo-50 border-indigo-200 text-indigo-700 font-medium h-9">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delete Selected" className="text-red-600 focus:text-red-600 focus:bg-red-50">Delete Selected</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => onViewChange('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                currentView === 'grid' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                currentView === 'list' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
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