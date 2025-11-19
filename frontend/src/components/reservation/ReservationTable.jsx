// --- START OF FILE ReservationTable.jsx ---

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import { CalendarClock, MoreHorizontal, Mail } from 'lucide-react';

const ReservationTable = ({
  displayedReservations,
  currentPaginatedReservations,
  selectedReservationIds,
  handleCheckboxChange,
  handleMasterCheckboxChange,
  isAllSelected,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalReservations,
  totalPages,
  formatDateTime,
  getCustomerInitials,
  products, // Receive full product list
}) => {

  // Helper to resolve product IDs string (e.g., "101,102" or "Item IDs: 101,102") to Product Objects
  const getReservationProducts = (productIdsString) => {
    if (!productIdsString) return [];
    
    // Extract numbers from string (handles "Item IDs: 101, 102" or just "101,102")
    const ids = productIdsString.match(/\d+/g); 
    if (!ids) return [];

    // Map IDs to actual product objects from the 'products' prop
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  const indexOfFirstReservation = (currentPage - 1) * rowsPerPage;
  const indexOfLastReservation = currentPage * rowsPerPage;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Bulk Action Header */}
      {selectedReservationIds.size > 0 && (
         <div className="bg-primary-50 px-6 py-3 flex items-center justify-between border-b border-primary-100">
            <span className="text-sm font-medium text-primary-700">
              {selectedReservationIds.size} selected
            </span>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" className="bg-white border-primary-200 text-primary-700 hover:bg-primary-50">
                 <Mail className="w-4 h-4 mr-2"/> Send Reminder
               </Button>
            </div>
         </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {currentPaginatedReservations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
               <CalendarClock className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No Reservations Found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-medium">
                <th className="py-4 px-6 w-[50px]">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleMasterCheckboxChange} />
                </th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Selected Products</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentPaginatedReservations.map((res) => {
                const reservedProducts = getReservationProducts(res.productName || ""); // using productName field as it holds the IDs currently

                return (
                  <tr key={res.id} className="hover:bg-gray-50/80 transition-colors group">
                    {/* Checkbox */}
                    <td className="py-4 px-6">
                      <Checkbox
                        checked={selectedReservationIds.has(res.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(res.id, checked)}
                      />
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                             {getCustomerInitials(res.customerName)}
                           </div>
                           {/* Status Dot (Mock logic: Assuming active if future) */}
                           <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">{res.customerName}</div>
                          <div className="text-xs text-gray-500">{res.customerPhone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Products (Images) */}
                    <td className="py-4 px-6">
                      {reservedProducts.length > 0 ? (
                        <div className="flex items-center -space-x-3 overflow-hidden hover:space-x-1 transition-all duration-300 py-1">
                          {reservedProducts.map((prod, idx) => (
                            <div key={`${res.id}-prod-${prod.id}`} className="relative group/img">
                                <img 
                                  src={prod.imageUrl || "https://placehold.co/40x40?text=Img"} 
                                  alt={prod.name}
                                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100"
                                  title={prod.name}
                                />
                            </div>
                          ))}
                           {reservedProducts.length > 4 && (
                             <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-600 z-10">
                               +{reservedProducts.length - 4}
                             </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No products selected</span>
                      )}
                    </td>

                    {/* Date & Time (Start Only) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="bg-gray-100 p-1.5 rounded text-gray-500">
                           <CalendarClock className="w-4 h-4"/>
                        </span>
                        <span className="text-sm font-medium">
                           {formatDateTime(res.startTime)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                           <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50/30 text-sm text-gray-600">
        <div>
          Showing <strong>{totalReservations > 0 ? indexOfFirstReservation + 1 : 0}-{Math.min(indexOfLastReservation, totalReservations)}</strong> of <strong>{totalReservations}</strong>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder={rowsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="h-8 px-2"
                />
              </PaginationItem>
              {/* Simple Page Indicator */}
              <PaginationItem className="px-2 font-medium">
                 Page {currentPage} of {totalPages || 1}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 px-2"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;