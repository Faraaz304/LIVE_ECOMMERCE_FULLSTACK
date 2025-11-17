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

const ProductFilterBar = ({
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  onSortChange,
  currentView,
  onViewChange,
  showBulkActions = false, // New prop, defaults to false
  onBulkAction,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#e5e7eb] mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'><path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/></svg>
          </span>
          <Input
            type="text"
            placeholder="Search by name"
            className="pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
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


        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={currentView === 'grid' ? 'outline' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewChange('grid')}
          >
            📱
          </Button>
          <Button
            variant={currentView === 'list' ? 'outline' : 'ghost'}
            size="icon-sm"
            onClick={() => onViewChange('list')}
          >
            📋
          </Button>
        </div>

        {showBulkActions && ( // Conditionally render bulk actions
          <Select onValueChange={onBulkAction}>
            <SelectTrigger className="w-[180px] bg-blue-50 border-blue-200 text-blue-700">
              <SelectValue placeholder="Bulk Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Delete Selected">Delete Selected</SelectItem>
              {/* Add other bulk actions here if needed */}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default ProductFilterBar;