'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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

// Removed: useReservation import as we are explicitly using dummy data
// Removed: useProducts import as it's no longer needed

// Dummy data for display
const mockReservations = [
  {
    id: 1,
    bookingId: 'RES-D5942E',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    productName: 'Premium Package',
    people: 4,
    status: 'cancelled',
    startTime: '2024-12-01T14:00:00',
    endTime: '2024-12-01T16:00:00',
    createdAt: '2025-11-04T15:20:19',
  },
  {
    id: 2,
    bookingId: 'RES-50BDBB',
    customerName: 'Jane Smith',
    customerPhone: '+1987654321',
    productName: 'shose',
    people: 2,
    status: 'Pending',
    startTime: '2025-11-19T10:00:00', // Example for 'Tomorrow'
    endTime: '2025-11-19T10:30:00',
    createdAt: '2025-11-04T15:47:12',
  },
  {
    id: 3,
    bookingId: 'RES-AEB5B0',
    customerName: 'Dilshad Alam',
    customerPhone: '+0987654321',
    productName: 'Mobile Phone',
    people: 7,
    status: 'Confirmed',
    startTime: '2025-11-18T14:00:00', // Example for 'Today'
    endTime: '2025-11-18T14:30:00',
    createdAt: '2025-11-04T15:50:53',
  },
  {
    id: 4,
    bookingId: 'RES-X123YZ',
    customerName: 'Alice Johnson',
    customerPhone: '+1122334455',
    productName: 'Camera Gear',
    people: 1,
    status: 'Confirmed',
    startTime: '2025-11-25T11:00:00', // Example for 'This Week'
    endTime: '2025-11-25T11:30:00',
    createdAt: '2025-11-10T10:00:00',
  },
  {
    id: 5,
    bookingId: 'RES-A7B8C9',
    customerName: 'Bob Williams',
    customerPhone: '+1555123456',
    productName: 'Laptop Repair',
    people: 3,
    status: 'Pending',
    startTime: '2025-10-15T09:00:00', // Example for 'Past'
    endTime: '2025-10-15T09:30:00',
    createdAt: '2025-10-01T08:00:00',
  },
  {
    id: 6,
    bookingId: 'RES-M1N2P3',
    customerName: 'Charlie Brown',
    customerPhone: '+1222333444',
    productName: 'Tablet Setup',
    people: 1,
    status: 'Confirmed',
    startTime: '2025-11-20T16:00:00',
    endTime: '2025-11-20T16:30:00',
    createdAt: '2025-11-12T11:00:00',
  },
  {
    id: 7,
    bookingId: 'RES-Q4R5S6',
    customerName: 'Diana Prince',
    customerPhone: '+1777888999',
    productName: 'Smartwatch Demo',
    people: 2,
    status: 'Pending',
    startTime: '2025-11-21T11:30:00',
    endTime: '2025-11-21T12:00:00',
    createdAt: '2025-11-13T14:00:00',
  },
];


const ReservationsPage = () => {
  const router = useRouter();
  // No longer using useReservation hook directly for data here, only mock data
  // const { reservations, isLoading, error, getAllReservations } = useReservation();

  const effectiveReservations = mockReservations; // Always use mock data now

  const [selectedReservationIds, setSelectedReservationIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterDateRange, setFilterDateRange] = useState('Custom Range');
  const [sortBy, setSortBy] = useState('Date (Newest First)');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalReservations = effectiveReservations.length;
  const totalPages = Math.ceil(totalReservations / rowsPerPage);

  // No API fetching needed now
  // useEffect(() => {
  //   getAllReservations();
  // }, [getAllReservations]);

  // Helper function to format date and time
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return { date: formattedDate, time: formattedTime };
    } catch (e) {
      console.error("Error formatting date:", isoString, e);
      return { date: 'Invalid Date', time: 'N/A' };
    }
  };

  // Helper function to get status badge variant (matching your HTML CSS)
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-[#d1fae5] text-[#065f46] hover:bg-[#d1fae5]'; // success-500
      case 'pending':
        return 'bg-[#fef3c7] text-[#92400e] hover:bg-[#fef3c7]'; // warning-500
      case 'completed':
        return 'bg-[#dbeafe] text-[#1e40af] hover:bg-[#dbeafe]'; // info-500
      case 'cancelled':
        return 'bg-[#fee2e2] text-[#991b1b] hover:bg-[#fee2e2]'; // error-500
      case 'no-show':
        return 'bg-[#f3f4f6] text-[#4b5563] hover:bg-[#f3f4f6]'; // gray-600
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  // Helper to get customer initials
  const getCustomerInitials = (fullName) => {
    if (!fullName) return 'NA';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedReservations = useCallback(() => {
    let currentReservations = effectiveReservations;

    // Apply search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentReservations = currentReservations.filter(res =>
        res.customerName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.customerPhone?.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.bookingId?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply status filter
    if (filterStatus !== 'All Status') {
      currentReservations = currentReservations.filter(res => res.status?.toLowerCase() === filterStatus.toLowerCase());
    }

    // Apply date range filter (simplified for now, actual logic would be more complex)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    currentReservations = currentReservations.filter(res => {
        const resDate = res.startTime ? new Date(res.startTime) : null;
        if (!resDate) return false;

        if (activeTab === 'today' || filterDateRange === 'Today') {
            return resDate.toDateString() === today.toDateString();
        }
        if (activeTab === 'tomorrow' || filterDateRange === 'Tomorrow') {
            return resDate.toDateString() === tomorrow.toDateString();
        }
        if (activeTab === 'this-week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Adjust to Sunday of current week
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Adjust to Saturday of current week
            return resDate >= startOfWeek && resDate <= endOfWeek;
        }
        if (activeTab === 'past') {
            return resDate < today;
        }
        return true;
    });


    // Apply sort
    currentReservations.sort((a, b) => {
      switch (sortBy) {
        case 'Date (Newest First)':
          return new Date(b.startTime || b.createdAt) - new Date(a.startTime || a.createdAt);
        case 'Date (Oldest First)':
          return new Date(a.startTime || a.createdAt) - new Date(b.startTime || b.createdAt);
        case 'Customer Name (A-Z)':
          return (a.customerName || '').localeCompare(b.customerName || '');
        case 'Customer Name (Z-A)':
          return (b.customerName || '').localeCompare(a.customerName || '');
        case 'Status':
          return (a.status || '').localeCompare(b.status || '');
        default:
          return 0;
      }
    });

    return currentReservations;
  }, [effectiveReservations, searchTerm, filterStatus, activeTab, filterDateRange, sortBy]);

  const displayedReservations = filteredAndSortedReservations();

  // Get current reservations for the displayed page
  const indexOfLastReservation = currentPage * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentPaginatedReservations = displayedReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const handleCheckboxChange = (reservationId, isChecked) => {
    setSelectedReservationIds((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (isChecked) {
        newSelected.add(reservationId);
      } else {
        newSelected.delete(reservationId);
      }
      return newSelected;
    });
  };

  const handleMasterCheckboxChange = (isChecked) => {
    if (isChecked) {
      const allReservationIds = new Set(currentPaginatedReservations.map((res) => res.id));
      setSelectedReservationIds(allReservationIds);
    } else {
      setSelectedReservationIds(new Set());
    }
  };

  const isAllSelected = selectedReservationIds.size === currentPaginatedReservations.length && currentPaginatedReservations.length > 0;
  const isBulkActionsVisible = selectedReservationIds.size > 0;

  const handleBulkAction = (action) => {
    alert(`Bulk action: ${action} on ${selectedReservationIds.size} reservations.`);
    // Implement actual API calls for bulk actions here
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  // No loading state needed when using dummy data
  // No error message display from API needed now

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
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
          <Button variant="outline" className="text-primary-500 border-primary-500 hover:bg-gray-50">
            <span>📅</span> Calendar View
          </Button>
          {/* Removed the Use Real/Dummy Data toggle button */}
        </div>
      </div>

      {/* API Error Message (Removed, as we are now intentionally using dummy data) */}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">Status</label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No-show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                <SelectItem value="Status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => console.log('Apply Filters')} className="bg-primary-500 hover:bg-primary-600">Apply Filters</Button>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setFilterStatus('All Status');
            setFilterDateRange('Custom Range');
            setSortBy('Date (Newest First)');
          }} className="border-gray-300 text-gray-700 hover:bg-gray-50">Clear All</Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {/* Table Header with Bulk Actions */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-wrap gap-4">
          <div className="text-lg font-semibold text-gray-900">
            {displayedReservations.length} Reservations {activeTab === 'all' ? '' : `for ${activeTab}`}
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
            <table>
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                    <Checkbox checked={isAllSelected} onCheckedChange={handleMasterCheckboxChange} />
                  </th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Booking ID</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Customer</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Date & Time</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">People</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">Status</th>
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
                        <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold text-sm">
                          {getCustomerInitials(res.customerName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">{res.customerName}</span>
                          <span className="text-gray-500 text-xs flex items-center gap-1">
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
                    <td className="py-4 px-4">
                      <Badge className={getStatusBadgeClass(res.status)}>
                        {res.status}
                      </Badge>
                    </td>
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
            <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
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
                      onClick={() => handlePageChange(i + 1)}
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
    </div>
  );
};

export default ReservationsPage;