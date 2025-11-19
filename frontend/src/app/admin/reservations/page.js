'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/hooks/useReservation'; // Imported Hook

// Import the new components
import ReservationFilterBar from '@/components/reservation/ReservationFilterBar';
import ReservationTable from '@/components/reservation/ReservationTable';

const ReservationsPage = () => {
  const router = useRouter();
  
  // 1. USE HOOK
  const { reservations, isLoading, error, getAllReservations } = useReservation();

  // Filter & Pagination states
  const [selectedReservationIds, setSelectedReservationIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('Custom Range');
  const [sortBy, setSortBy] = useState('Date (Newest First)');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data on mount using the hook
  useEffect(() => {
    getAllReservations();
  }, [getAllReservations]);


  // Pagination Logic
  const totalReservations = reservations.length;
  const totalPages = Math.ceil(totalReservations / rowsPerPage);

  // Helper function to format date and time for UI display
  const formatDateTime = (isoString) => {
    if (!isoString) return { date: 'N/A', time: 'N/A' };
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
      return { date: 'Invalid', time: 'N/A' };
    }
  };

  const getCustomerInitials = (fullName) => {
    if (!fullName) return 'NA';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedReservations = useCallback(() => {
    let currentReservations = [...reservations];

    // Apply search term
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentReservations = currentReservations.filter(res =>
        res.customerName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.customerPhone?.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.bookingId?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Apply date range filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    currentReservations = currentReservations.filter(res => {
        const resDate = res.startTime ? new Date(res.startTime) : null;
        if (!resDate) return false;
        resDate.setHours(0, 0, 0, 0);

        if (activeTab === 'today' || filterDateRange === 'Today') {
            return resDate.getTime() === today.getTime();
        }
        if (activeTab === 'tomorrow' || filterDateRange === 'Tomorrow') {
            return resDate.getTime() === tomorrow.getTime();
        }
        if (activeTab === 'this-week') {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); 
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
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
  }, [reservations, searchTerm, activeTab, filterDateRange, sortBy]);

  const displayedReservations = filteredAndSortedReservations();

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
  };

  const onApplyFilters = () => {
    setCurrentPage(1);
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
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-screen-xl mx-auto flex justify-center items-center h-96">
        <div className="text-gray-500 text-lg">Loading reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-screen-xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {error}. Please ensure your backend is running on port 8088.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
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
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalReservations={displayedReservations.length}
        totalPages={Math.ceil(displayedReservations.length / rowsPerPage)}
        formatDateTime={formatDateTime}
        getCustomerInitials={getCustomerInitials}
      />
    </div>
  );
};

export default ReservationsPage;