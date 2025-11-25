'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useReservation } from '@/hooks/useReservation';
import useProducts from '@/hooks/useProducts';

import ReservationFilterBar from '@/components/reservation/ReservationFilterBar';
import ReservationTable from '@/components/reservation/ReservationTable';
import { Loader2, AlertCircle } from 'lucide-react';

const ReservationsPage = () => {
  const { reservations, isLoading: isLoadingReservations, error, getAllReservations } = useReservation();
  const { products, getAllProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('Date (Newest First)');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    getAllReservations();
    getAllProducts();
  }, [getAllReservations, getAllProducts]);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const date = new Date(isoString);
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

  const filteredAndSortedReservations = useCallback(() => {
    let currentReservations = [...reservations];

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentReservations = currentReservations.filter(res =>
        res.customerName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.customerPhone?.toLowerCase().includes(lowerCaseSearchTerm) ||
        (res.bookingId && res.bookingId.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    currentReservations = currentReservations.filter(res => {
        const resDate = res.startTime ? new Date(res.startTime) : null;
        if (!resDate) return false;
        resDate.setHours(0, 0, 0, 0);

        if (activeTab === 'today') return resDate.getTime() === today.getTime();
        if (activeTab === 'tomorrow') return resDate.getTime() === tomorrow.getTime();
        if (activeTab === 'past') return resDate < today;
        
        return true;
    });

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
  }, [reservations, searchTerm, activeTab, sortBy]);

  const displayedReservations = filteredAndSortedReservations();

  const indexOfLastReservation = currentPage * rowsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - rowsPerPage;
  const currentPaginatedReservations = displayedReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const onClearFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSortBy('Date (Newest First)');
    setCurrentPage(1);
  };

  if (isLoadingReservations) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/30 p-4">
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-lg max-w-md text-center">
          <AlertCircle className="w-10 h-10 mx-auto mb-3" />
          <p className="font-semibold">Error Loading Data</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
          currentPaginatedReservations={currentPaginatedReservations}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalReservations={displayedReservations.length}
          totalPages={Math.ceil(displayedReservations.length / rowsPerPage)}
          formatDateTime={formatDateTime}
          getCustomerInitials={getCustomerInitials}
          products={products}
        />
      </div>
    </div>
  );
};

export default ReservationsPage;