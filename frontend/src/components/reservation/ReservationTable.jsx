import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Although not used directly, might be part of Shadcn setup
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge'; // Although Status Badge is removed, Badge component might be used for other purposes
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

const ReservationTable = ({
  displayedReservations,
  currentPaginatedReservations,
  selectedReservationIds,
  handleCheckboxChange,
  handleMasterCheckboxChange,
  isAllSelected,
  isBulkActionsVisible,
  handleBulkAction,
  currentPage,
  setCurrentPage, // Corrected prop name
  rowsPerPage,
  setRowsPerPage,
  totalReservations,
  totalPages,
  formatDateTime,
  getCustomerInitials,
}) => {
  // Removed: getStatusBadgeClass as the Status column is removed

  const indexOfFirstReservation = (currentPage - 1) * rowsPerPage;
  const indexOfLastReservation = currentPage * rowsPerPage;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Table Header with Bulk Actions */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-wrap gap-4">
        <div className="text-lg font-semibold text-gray-900">
          {displayedReservations.length} Reservations {/* No specific tab message here, the filtered count is enough */}
        </div>
        {isBulkActionsVisible && (
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-600">{selectedReservationIds.size} selected</span>
            <Button variant="secondary" onClick={() => handleBulkAction('Send Reminder')}>📤 Send Reminder</Button>
            <Button variant="outline" onClick={() => handleBulkAction('Export')} className="border-gray-300 text-gray-700 hover:bg-gray-50">📥 Export</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {currentPaginatedReservations.length === 0 ? (
          <div className="empty-state p-8 text-center">
            <div className="empty-state-icon text-6xl text-gray-300 mb-4">🗓️</div>
            <h3 className="empty-state-title text-lg font-semibold text-gray-700 mb-2">No Reservations Found</h3>
            <p className="empty-state-description text-gray-500 mb-6">
              It looks like there are no reservations matching your current filters.
            </p>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 w-[50px]">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleMasterCheckboxChange} />
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 w-[120px]">Booking ID</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 w-[180px]">Customer</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 w-[180px]">Date & Time</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 w-[80px]">People</th>
                {/* Removed Status column header */}
              </tr>
            </thead>
            <tbody>
              {currentPaginatedReservations.map((res) => (
                <tr key={res.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={selectedReservationIds.has(res.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(res.id, checked)}
                    />
                  </td>
                  <td className="py-4 px-4"><strong>#{res.bookingId}</strong></td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                        {getCustomerInitials(res.customerName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{res.customerName}</span>
                        <span className="text-gray-500 text-xs flex items-center gap-1 flex-wrap">
                          📞 {res.customerPhone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <strong>{formatDateTime(res.startTime).date}</strong><br />
                    <span className="text-gray-500 text-xs">{formatDateTime(res.startTime).time} - {formatDateTime(res.endTime).time}</span>
                  </td>
                  <td className="py-4 px-4">{res.people}</td>
                  {/* Removed Status data cell */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center p-6 border-t border-gray-200 flex-wrap gap-4">
        <div className="text-sm text-gray-600">
          Showing <strong>{indexOfFirstReservation + 1}-{Math.min(indexOfLastReservation, totalReservations)}</strong> of <strong>{totalReservations}</strong> reservations
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 mr-2">Rows per page:</span>
          <Select value={String(rowsPerPage)} onValueChange={setRowsPerPage}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={rowsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                    className={currentPage === i + 1 ? 'bg-primary-500 text-white' : ''}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
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