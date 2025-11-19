// --- START OF FILE ReservationFilterBar.jsx ---

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
import { Calendar, Search, X } from 'lucide-react';

const ReservationFilterBar = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  sortBy,
  setSortBy,
  onClearFilters,
}) => {
  return (
    <div className="mb-8 space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your upcoming appointments</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search customer..."
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
               <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                 <X className="w-3 h-3" />
               </button>
            )}
          </div>
          <Button variant="outline" className="hidden md:flex items-center gap-2">
            <Calendar className="w-4 h-4" /> View Calendar
          </Button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-1">
         {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['All', 'Today', 'Tomorrow', 'Past'].map((tabName) => {
            const value = tabName.toLowerCase().replace(' ', '-');
            const isActive = activeTab === value;
            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(value)}
                className={`
                  pb-3 text-sm font-medium transition-all relative whitespace-nowrap
                  ${isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'}
                `}
              >
                {tabName}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 uppercase hidden sm:block">Sort:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="Date (Newest First)">Date (Newest First)</SelectItem>
              <SelectItem value="Date (Oldest First)">Date (Oldest First)</SelectItem>
              <SelectItem value="Customer Name (A-Z)">Customer Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ReservationFilterBar;