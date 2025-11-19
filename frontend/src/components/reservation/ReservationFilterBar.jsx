import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ReservationFilterBar = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  filterDateRange,
  setFilterDateRange,
  sortBy,
  setSortBy,
  onApplyFilters,
  onClearFilters,
  onCalendarViewClick,
}) => {
  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <div className="flex gap-4 items-center flex-wrap">
          <Input
            type="text"
            placeholder="Search by customer name, phone, booking ID..."
            className="w-[300px] border-gray-200 focus:border-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" className="text-primary-500 border-primary-500 hover:bg-gray-50" onClick={onCalendarViewClick}>
            <span>📅</span> Calendar View
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200 overflow-x-auto">
        {['All', 'Today', 'Tomorrow', 'This Week', 'Past'].map((tabName) => (
          <button
            key={tabName}
            className={`
              py-3 px-6 bg-transparent border-none font-semibold cursor-pointer relative whitespace-nowrap transition-all
              ${activeTab === tabName.toLowerCase().replace(' ', '-')
                ? 'text-primary-500 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-primary-500'
                : 'text-gray-600 hover:text-primary-500'
              }
            `}
            onClick={() => setActiveTab(tabName.toLowerCase().replace(' ', '-'))}
          >
            {tabName} <Badge className="ml-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">{/* Mock count */ Math.floor(Math.random() * 20) + 5}</Badge>
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Date Range</label>
            <Select value={filterDateRange} onValueChange={setFilterDateRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Custom Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Custom Range">Custom Range</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                <SelectItem value="Next 7 Days">Next 7 Days</SelectItem>
                <SelectItem value="Next 30 Days">Next 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Date (Newest First)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Date (Newest First)">Date (Newest First)</SelectItem>
                <SelectItem value="Date (Oldest First)">Date (Oldest First)</SelectItem>
                <SelectItem value="Customer Name (A-Z)">Customer Name (A-Z)</SelectItem>
                <SelectItem value="Customer Name (Z-A)">Customer Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClearFilters} className="border-gray-300 text-gray-700 hover:bg-gray-50">Clear All</Button>
        </div>
      </div>
    </>
  );
};

export default ReservationFilterBar;