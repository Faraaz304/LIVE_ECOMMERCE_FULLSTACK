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
} from '@/components/ui/pagination';
import { CalendarClock, MoreHorizontal, Mail, Image as ImageIcon } from 'lucide-react';

const ReservationTable = ({
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
  products,
}) => {

  const getReservationProducts = (productIdsString) => {
    if (!productIdsString) return [];
    const ids = productIdsString.match(/\d+/g); 
    if (!ids) return [];
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  };

  const indexOfFirstReservation = (currentPage - 1) * rowsPerPage;
  const indexOfLastReservation = currentPage * rowsPerPage;

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
      
      {/* Bulk Action Header */}
      {selectedReservationIds.size > 0 && (
         <div className="bg-primary/10 px-6 py-3 flex items-center justify-between border-b border-primary/20 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm font-medium text-primary">
              {selectedReservationIds.size} selected
            </span>
            <div className="flex gap-2">
               <Button size="sm" variant="outline" className="bg-background border-input text-foreground hover:bg-muted">
                 <Mail className="w-3.5 h-3.5 mr-2 text-muted-foreground"/> Send Reminder
               </Button>
            </div>
         </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {currentPaginatedReservations.length === 0 ? (
          <div className="p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
               <CalendarClock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No Reservations Found</h3>
            <p className="text-muted-foreground mt-1 text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="py-4 px-6 w-[50px]">
                  <Checkbox 
                    checked={isAllSelected} 
                    onCheckedChange={handleMasterCheckboxChange} 
                    className="border-muted-foreground/30 data-[state=checked]:border-primary"
                  />
                </th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Products</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</th>
                <th className="py-3 px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentPaginatedReservations.map((res) => {
                const reservedProducts = getReservationProducts(res.productName || "");

                return (
                  <tr key={res.id} className="group hover:bg-muted/30 transition-colors">
                    {/* Checkbox */}
                    <td className="py-4 px-6">
                      <Checkbox
                        checked={selectedReservationIds.has(res.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(res.id, checked)}
                        className="border-muted-foreground/30 data-[state=checked]:border-primary"
                      />
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                           <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                             {getCustomerInitials(res.customerName)}
                           </div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm line-clamp-1">{res.customerName}</div>
                          <div className="text-xs text-muted-foreground">{res.customerPhone}</div>
                        </div>
                      </div>
                    </td>

                    {/* Products (Images) */}
                    <td className="py-4 px-6">
                      {reservedProducts.length > 0 ? (
                        <div className="flex items-center -space-x-3 overflow-hidden py-1 pl-1">
                          {reservedProducts.map((prod) => (
                            <div key={`${res.id}-prod-${prod.id}`} className="relative group/img z-0 hover:z-10 transition-all duration-200">
                                <img 
                                  src={prod.imageUrl || "https://placehold.co/40x40?text=Img"} 
                                  alt={prod.name}
                                  className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-sm bg-muted"
                                  title={prod.name}
                                />
                            </div>
                          ))}
                           {reservedProducts.length > 4 && (
                             <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-bold text-muted-foreground z-10">
                               +{reservedProducts.length - 4}
                             </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> No items
                        </span>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-foreground">
                        <span className="bg-muted p-1.5 rounded text-muted-foreground">
                           <CalendarClock className="w-4 h-4"/>
                        </span>
                        <span className="text-sm font-medium">
                           {formatDateTime(res.startTime)}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
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
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border bg-muted/20 gap-4 text-sm text-muted-foreground">
        <div>
          Showing <strong className="text-foreground">{totalReservations > 0 ? indexOfFirstReservation + 1 : 0}-{Math.min(indexOfLastReservation, totalReservations)}</strong> of <strong className="text-foreground">{totalReservations}</strong>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[70px] h-8 bg-background border-input text-foreground">
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
                  className="h-8 px-2 cursor-pointer disabled:opacity-50"
                />
              </PaginationItem>
              <PaginationItem className="px-2 font-medium text-foreground">
                 Page {currentPage} of {totalPages || 1}
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 px-2 cursor-pointer disabled:opacity-50"
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