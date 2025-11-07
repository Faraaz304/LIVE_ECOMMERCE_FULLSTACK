// app/(dashboard)/reservation/page.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// NO METADATA EXPORT IN THIS FILE, as requested.

const ReservationsPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('Tomorrow'); // 'Today', 'Tomorrow', 'This Week', 'Past', 'All'
  const [selectedReservations, setSelectedReservations] = useState(new Set());
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterDateRange, setFilterDateRange] = useState('Tomorrow'); // Retain for UI control
  const [filterProduct, setFilterProduct] = useState('All Products'); // Retain for UI control
  const [sortOrder, setSortOrder] = useState('Date (Newest First)'); // Retain for UI control

  const [allReservations, setAllReservations] = useState([]); // Store all fetched data
  const [displayedReservations, setDisplayedReservations] = useState([]); // Filtered/sorted data for display
  const [isLoading, setIsLoading] = useState(true); // For initial API fetch
  const [error, setError] = useState(null);

  // --- Data Fetching Function ---
  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8088/api/reservations'); // Your backend API
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const formattedReservations = data.map(res => {
        const startTime = res.startTime ? new Date(res.startTime) : null;
        const endTime = res.endTime ? new Date(res.endTime) : null;
        
        return {
          id: res.id.toString(), // Ensure ID is string
          bookingId: res.bookingId,
          customerName: res.customerName,
          customerPhone: res.customerPhone,
          productName: res.productName,
          people: res.people,
          status: res.status.toLowerCase(), // Ensure consistent lowercase status
          date: startTime ? startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
          time: startTime && endTime ? `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}` : 'N/A',
          createdAt: new Date(res.createdAt).toLocaleString(), // For potential sorting/filtering
          // You might fetch actual productImage URLs from another API if available
          productImage: `https://via.placeholder.com/40/${Math.floor(Math.random()*16777215).toString(16)}/ffffff?text=${res.productName.substring(0,3)}`,
        };
      });
      setAllReservations(formattedReservations);

    } catch (err) {
      console.error('Failed to fetch reservations:', err);
      setError('Failed to load reservations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means fetchReservations itself doesn't change

  // --- Effect to call fetchReservations on component mount ---
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);


  // --- Filtering and Sorting Logic ---
  useEffect(() => {
    let filtered = [...allReservations]; // Start with all fetched reservations

    // Filter by Status
    if (filterStatus !== 'All Status') {
      filtered = filtered.filter(res => res.status.toLowerCase() === filterStatus.toLowerCase());
    }

    // Filter by Date Range (simplified for demonstration, needs robust date comparison)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (activeTab === 'Today' || filterDateRange === 'Today') {
        // Filter reservations whose date matches today
        filtered = filtered.filter(res => {
            const resDate = res.startTime ? new Date(res.startTime) : null;
            return resDate && resDate.toDateString() === today.toDateString();
        });
    } else if (activeTab === 'Tomorrow' || filterDateRange === 'Tomorrow') {
        // Filter reservations whose date matches tomorrow
        filtered = filtered.filter(res => {
            const resDate = res.startTime ? new Date(res.startTime) : null;
            return resDate && resDate.toDateString() === tomorrow.toDateString();
        });
    }
    // Add more date range logic as needed for 'This Week', 'Past', 'All', 'Custom Range'

    // Filter by Product (basic substring match for demo)
    if (filterProduct !== 'All Products') {
        filtered = filtered.filter(res => res.productName.toLowerCase().includes(filterProduct.toLowerCase()));
    }

    // Sort Order
    if (sortOrder === 'Date (Newest First)') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'Date (Oldest First)') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === 'Customer Name (A-Z)') {
      filtered.sort((a, b) => a.customerName.localeCompare(b.customerName));
    } else if (sortOrder === 'Customer Name (Z-A)') {
      filtered.sort((a, b) => b.customerName.localeCompare(a.customerName));
    } else if (sortOrder === 'Status') {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }


    setDisplayedReservations(filtered);
    setSelectedReservations(new Set()); // Clear selection when filters change
  }, [activeTab, filterStatus, filterDateRange, filterProduct, sortOrder, allReservations]);


  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-[#d1fae5] text-[#065f46]'; // Greenish
      case 'pending':
        return 'bg-[#fef3c7] text-[#92400e]'; // Orangish
      case 'cancelled':
        return 'bg-[#fee2e2] text-[#991b1b]'; // Reddish
      case 'completed': // Assuming a completed status exists or can be derived
        return 'bg-[#dbeafe] text-[#1e40af]'; // Bluish
      case 'no-show': // Assuming a no-show status exists
        return 'bg-[#f3f4f6] text-[#4b5563]'; // Grayish
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleToggleAllReservations = (e) => {
    if (e.target.checked) {
      const allIds = new Set(displayedReservations.map((res) => res.id));
      setSelectedReservations(allIds);
    } else {
      setSelectedReservations(new Set());
    }
  };

  const handleToggleReservation = (id, isChecked) => {
    setSelectedReservations((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const isAllSelected = displayedReservations.length > 0 && selectedReservations.size === displayedReservations.length;
  const bulkActionsVisible = selectedReservations.size > 0;

  const handleBulkAction = (action) => {
    console.log(`Bulk action "${action}" on:`, Array.from(selectedReservations));
    alert(`Bulk action "${action}" on ${selectedReservations.size} reservations (functionality not implemented).`);
    setSelectedReservations(new Set()); // Clear selection after action
  };


  if (isLoading) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#6b7280]">Loading reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex-1 flex items-center justify-center bg-[#f9fafb]">
        <p className="text-xl text-[#ef4444]">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex-1">
      {/* Top Bar (simulated from ClientLayout context) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#111827]">Reservations</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            className="w-full sm:w-[300px] py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
            placeholder="Search by customer name, phone, booking ID..."
            onChange={(e) => console.log('Search:', e.target.value)}
          />
          <button
            className="py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0px 0px rgba(0,0,0,0)',
              '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            onClick={() => alert('Calendar View Clicked!')}
          >
            <span>📅</span>
            Calendar View
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 border-[#e5e7eb] overflow-x-auto">
        {['Today', 'Tomorrow', 'This Week', 'Past', 'All'].map((tabName) => (
          <button
            key={tabName}
            className={`py-3 px-6 bg-transparent border-none text-[#6b7280] text-base font-semibold cursor-pointer relative whitespace-nowrap transition-all hover:text-[#667eea] ${
              activeTab === tabName ? 'text-[#667eea]' : ''
            }`}
            style={activeTab === tabName ? { borderBottom: '2px solid #667eea', marginBottom: '-2px' } : {}}
            onClick={() => setActiveTab(tabName)}
          >
            {tabName}{' '}
            {/* Badges would ideally be dynamic counts from your filtered data */}
            {tabName === 'Tomorrow' && <span className="inline-block bg-[#667eea] text-white py-0.5 px-2 rounded-full text-xs ml-2">{displayedReservations.length}</span>}
            {/* Add badges for other tabs based on actual counts */}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#374151] mb-2">Status</label>
            <select
              className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-[#667eea]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option> {/* Added Cancelled based on API */}
              {/* Add other status options if your API provides them, e.g., 'Completed', 'No-show' */}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#374151] mb-2">Date Range</label>
            <select
              className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-[#667eea]"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
            >
              <option>Custom Range</option>
              <option>Today</option>
              <option>Tomorrow</option>
              <option>Next 7 Days</option>
              <option>Next 30 Days</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#374151] mb-2">Product</label>
            <select
              className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-[#667eea]"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              <option>All Products</option>
              {/* Dynamically populate product options from your fetched data */}
              {[...new Set(allReservations.map(res => res.productName))].map(pName => (
                  <option key={pName} value={pName}>{pName}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-[#374151] mb-2">Sort By</label>
            <select
              className="py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-[#667eea]"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option>Date (Newest First)</option>
              <option>Date (Oldest First)</option>
              <option>Customer Name (A-Z)</option>
              <option>Customer Name (Z-A)</option>
              <option>Status</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            className="py-2.5 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 0px 0px rgba(0,0,0,0)',
              '--tw-shadow': '0 10px 30px rgba(102, 126, 234, 0.3)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--tw-shadow)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            onClick={() => console.log('Apply Filters clicked')}
          >
            Apply Filters
          </button>
          <button
            className="py-2.5 px-5 bg-white text-[#6b7280] border border-[#d1d5db] rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-50"
            onClick={() => {
                setFilterStatus('All Status');
                setFilterDateRange('Tomorrow');
                setFilterProduct('All Products');
                setSortOrder('Date (Newest First)');
                console.log('Clear All Filters clicked');
            }}
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header with Bulk Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-[#e5e7eb] gap-3">
          <div className="text-lg font-semibold text-[#111827]">
            {displayedReservations.length} Reservations for {activeTab}
          </div>
          {bulkActionsVisible && (
            <div className="flex gap-3 items-center">
              <span className="text-sm text-[#6b7280]">{selectedReservations.size} selected</span>
              <button
                className="py-2 px-4 bg-white text-[#667eea] border-2 border-[#667eea] rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-[#667eea]/[0.05]"
                onClick={() => handleBulkAction('Send Reminder')}
              >
                📤 Send Reminder
              </button>
              <button
                className="py-2 px-4 bg-white text-[#6b7280] border border-[#d1d5db] rounded-lg text-sm font-semibold cursor-pointer transition-all hover:bg-gray-50"
                onClick={() => handleBulkAction('Export')}
              >
                📥 Export
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-[#e5e7eb]">
                <th className="py-4 px-4 text-left">
                  <input
                    type="checkbox"
                    className="w-4.5 h-4.5 rounded-sm cursor-pointer accent-[#667eea]"
                    checked={isAllSelected}
                    onChange={handleToggleAllReservations}
                  />
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Booking ID</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Customer</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Date & Time</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Product</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">People</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Status</th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151] whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedReservations.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16 text-[#6b7280] text-base">
                    No reservations found for this selection.
                  </td>
                </tr>
              ) : (
                displayedReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-[#e5e7eb] hover:bg-gray-50 last:border-b-0">
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 rounded-sm cursor-pointer accent-[#667eea]"
                        checked={selectedReservations.has(reservation.id)}
                        onChange={(e) => handleToggleReservation(reservation.id, e.target.checked)}
                      />
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-[#111827]">{reservation.bookingId}</strong>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full bg-[#667eea] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0"
                        >
                          {reservation.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#111827]">{reservation.customerName}</span>
                          <span className="text-[#6b7280] text-xs flex items-center gap-1">
                            📞 {reservation.customerPhone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <strong className="text-[#111827]">{reservation.date}</strong><br />
                      <span className="text-[#6b7280] text-xs">{reservation.time}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {reservation.productImage && (
                          <img src={reservation.productImage} alt={reservation.productName} className="w-10 h-10 rounded-lg object-cover border border-[#e5e7eb]" />
                        )}
                        <span className="font-medium text-[#374151]">{reservation.productName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#374151] font-semibold">{reservation.people}</td>
                    <td className="py-4 px-4">
                      <span className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusBadgeClass(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          className="py-1.5 px-3 bg-[#667eea] text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-[#5568d3]"
                          onClick={() => alert(`View ${reservation.id} clicked`)}
                        >
                          View
                        </button>
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              className="py-1.5 px-3 bg-[#10b981] text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-[#059669]"
                              onClick={() => alert(`Confirm ${reservation.id} clicked`)}
                            >
                              ✓ Confirm
                            </button>
                            <button
                              className="py-1.5 px-3 bg-[#ef4444] text-white rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-[#dc2626]"
                              onClick={() => alert(`Cancel ${reservation.id} clicked`)}
                            >
                              ✗
                            </button>
                          </>
                        )}
                        {/* No Call/Chat for Confirmed/Completed unless you want to re-add */}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-[#e5e7eb] gap-4">
          <div className="text-sm text-[#6b7280]">
            Showing <strong className="text-[#374151]">1-{displayedReservations.length}</strong> of{' '}
            <strong className="text-[#374151]">{displayedReservations.length}</strong> reservations
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-[#6b7280]">Rows per page:</span>
            <select
              className="py-1.5 px-3 border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
              onChange={(e) => console.log('Rows per page:', e.target.value)}
            >
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
            <button className="py-1.5 px-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] text-sm cursor-not-allowed opacity-50" disabled>
              ‹
            </button>
            <button className="py-1.5 px-3 border border-[#667eea] bg-[#667eea] text-white rounded-lg text-sm cursor-pointer">
              1
            </button>
            <button className="py-1.5 px-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] text-sm cursor-pointer hover:bg-gray-50">
              2
            </button>
            <button className="py-1.5 px-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] text-sm cursor-pointer hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;