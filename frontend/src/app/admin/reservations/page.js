// --- START OF FILE page.js ---

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useReservation } from '@/hooks/useReservation';
import useProducts from '@/hooks/useProducts'; // Import Product Hook

import ReservationFilterBar from '@/components/reservation/ReservationFilterBar';
import ReservationTable from '@/components/reservation/ReservationTable';

const ReservationsPage = () => {
  const router = useRouter();
  
  // 1. Fetch Reservations
  const { reservations, isLoading: isLoadingReservations, error, getAllReservations } = useReservation();

  // 2. Fetch Products (to display images in the table)
  const { products, getAllProducts } = useProducts();

  // Filter & Pagination states
  const [selectedReservationIds, setSelectedReservationIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('Custom Range');
  const [sortBy, setSortBy] = useState('Date (Newest First)');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch data on mount
  useEffect(() => {
    getAllReservations();
    getAllProducts(); // Fetch products to resolve IDs to Images
  }, [getAllReservations, getAllProducts]);


  // --- Helper Functions ---
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
      // Format: "Nov 20, 2:30 PM"
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return 'Invalid Date';
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
        (res.bookingId && res.bookingId.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    // Apply date filters
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    currentReservations = currentReservations.filter(res => {
        const resDate = res.startTime ? new Date(res.startTime) : null;
        if (!resDate) return false;
        resDate.setHours(0, 0, 0, 0);

        if (activeTab === 'today' || filterDateRange === 'Today') return resDate.getTime() === today.getTime();
        if (activeTab === 'tomorrow' || filterDateRange === 'Tomorrow') return resDate.getTime() === tomorrow.getTime();
        if (activeTab === 'past') return resDate < today;
        
        return true;
    });

    // Apply sort
    currentReservations.sort((a, b) => {
      const dateA = new Date(a.startTime || a.createdAt);
      const dateB = new Date(b.startTime || b.createdAt);
      
      switch (sortBy) {
        case 'Date (Newest First)': return dateB - dateA;
        case 'Date (Oldest First)': return dateA - dateB;
        case 'Customer Name (A-Z)': return (a.customerName || '').localeCompare(b.customerName || '');
        case 'Customer Name (Z-A)': return (b.customerName || '').localeCompare(a.customerName || '');
        default: return 0;
      }
    });

    return currentReservations;
  }, [reservations, searchTerm, activeTab, filterDateRange, sortBy]);

  const displayedReservations = filteredAndSortedReservations();

  // Pagination Slice
  const indexOfLastReservation = currentPage * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentPaginatedReservations = displayedReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  // Checkbox Logic
  const handleCheckboxChange = (reservationId, isChecked) => {
    setSelectedReservationIds((prev) => {
      const newSelected = new Set(prev);
      isChecked ? newSelected.add(reservationId) : newSelected.delete(reservationId);
      return newSelected;
    });
  };

  const handleMasterCheckboxChange = (isChecked) => {
    if (isChecked) {
      setSelectedReservationIds(new Set(currentPaginatedReservations.map((res) => res.id)));
    } else {
      setSelectedReservationIds(new Set());
    }
  };

  const isAllSelected = currentPaginatedReservations.length > 0 && selectedReservationIds.size === currentPaginatedReservations.length;

  const onApplyFilters = () => setCurrentPage(1);
  const onClearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSortBy('Date (Newest First)');
    setCurrentPage(1);
  };

  if (isLoadingReservations) {
    return <div className="flex h-screen items-center justify-center text-gray-500">Loading reservations...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 bg-red-50 rounded m-8 border border-red-200">Error: {error}</div>;
  }

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <ReservationFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={onClearFilters}
      />

      <ReservationTable
        displayedReservations={displayedReservations}
        currentPaginatedReservations={currentPaginatedReservations}
        selectedReservationIds={selectedReservationIds}
        handleCheckboxChange={handleCheckboxChange}
        handleMasterCheckboxChange={handleMasterCheckboxChange}
        isAllSelected={isAllSelected}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalReservations={displayedReservations.length}
        totalPages={Math.ceil(displayedReservations.length / rowsPerPage)}
        formatDateTime={formatDateTime}
        getCustomerInitials={getCustomerInitials}
        products={products} // PASS PRODUCTS TO TABLE
      />
    </div>
  );
};

export default ReservationsPage;