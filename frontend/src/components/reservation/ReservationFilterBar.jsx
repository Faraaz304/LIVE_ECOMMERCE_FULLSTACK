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
import { cn } from '@/lib/utils';

const ReservationFilterBar = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Reservations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your upcoming appointments and bookings.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search customer..."
              className="pl-9 bg-background border-input text-foreground focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
               <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                 <X className="w-3 h-3" />
               </button>
            )}
          </div>
          <Button variant="outline" className="bg-background border-input hover:bg-muted hidden md:flex items-center gap-2 text-foreground">
            <Calendar className="w-4 h-4" /> View Calendar
          </Button>
        </div>
      </div>

      {/* Tabs & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-0.5">
         {/* Custom Tabs */}
        <div className="flex gap-6 overflow-x-auto w-full sm:w-auto hide-scrollbar">
          {['All', 'Today', 'Tomorrow', 'Past'].map((tabName) => {
            const value = tabName.toLowerCase().replace(' ', '-');
            const isActive = activeTab === value;
            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(value)}
                className={cn(
                  "pb-3 text-sm font-medium transition-all relative whitespace-nowrap px-1",
                  isActive 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border"
                )}
              >
                {tabName}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3 w-full sm:w-auto pb-2 sm:pb-0">
          <span className="text-xs font-semibold text-muted-foreground uppercase hidden sm:block">Sort:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 text-sm bg-background border-input text-foreground">
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