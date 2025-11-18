'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Import the new components
import ReservationFilterBar from '@/components/reservation/ReservationFilterBar';
import ReservationTable from '@/components/reservation/ReservationTable';

// Dummy data for display
const mockReservations = [
  {
    id: 1,
    bookingId: 'RES-D5942E',
    customerName: 'John Doe Really Long Name Here',
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
  const effectiveReservations = mockReservations; // Always use mock data now

  const [selectedReservationIds, setSelectedReservationIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('Custom Range');
  const [sortBy, setSortBy] = useState('Date (Newest First)');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalReservations = effectiveReservations.length;
  const totalPages = Math.ceil(totalReservations / rowsPerPage);

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

    // Apply date range filter (simplified for now, actual logic would be more complex)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Normalize to start of day

    currentReservations = currentReservations.filter(res => {
        const resDate = res.startTime ? new Date(res.startTime) : null;
        if (!resDate) return false;
        resDate.setHours(0, 0, 0, 0); // Normalize reservation date to start of day

        if (activeTab === 'today' || filterDateRange === 'Today') {
            return resDate.getTime() === today.getTime();
        }
        if (activeTab === 'tomorrow' || filterDateRange === 'Tomorrow') {
            return resDate.getTime() === tomorrow.getTime();
        }
        if (activeTab === 'this-week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday of current week
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday of current week
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
        default:
          return 0;
      }
    });

    return currentReservations;
  }, [effectiveReservations, searchTerm, activeTab, filterDateRange, sortBy]);

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

  const onApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters are applied
    // The useCallback for filteredAndSortedReservations will automatically re-run
  };

  const onClearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setFilterDateRange('Custom Range');
    setSortBy('Date (Newest First)');
    setCurrentPage(1);
  };

  const onCalendarViewClick = () => {
    console.log("Navigating to Calendar View...");
    // router.push('/seller/reservations/calendar'); // Example navigation
  };


  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      {/* Filter Bar Component */}
      <ReservationFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filterDateRange={filterDateRange}
        setFilterDateRange={setFilterDateRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onCalendarViewClick={onCalendarViewClick}
      />

      {/* Table Component */}
      <ReservationTable
        displayedReservations={displayedReservations}
        currentPaginatedReservations={currentPaginatedReservations}
        selectedReservationIds={selectedReservationIds}
        handleCheckboxChange={handleCheckboxChange}
        handleMasterCheckboxChange={handleMasterCheckboxChange}
        isAllSelected={isAllSelected}
        isBulkActionsVisible={isBulkActionsVisible}
        handleBulkAction={handleBulkAction}
        currentPage={currentPage}
        set="setCurrentPage" // Corrected to `setCurrentPage`
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalReservations={totalReservations}
        totalPages={totalPages}
        formatDateTime={formatDateTime}
        getCustomerInitials={getCustomerInitials}
      />
    </div>
  );
};

export default ReservationsPage;