'use client';

import React, { useEffect, useState } from 'react';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [displayedReservations, setDisplayedReservations] = useState([]);
  const [selectedReservations, setSelectedReservations] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [bulkActionsVisible, setBulkActionsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  
    console.log(localStorage.getItem('userRole'));

  if(localStorage.getItem('userRole') == 'user'){
    console.log('user');
    window.location.href = '/product';
  }
  // Fetch all reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('http://localhost:8088/api/reservations');
        if (!res.ok) throw new Error('Failed to fetch reservations');
        const data = await res.json();

        // Format data
        const formatted = data.map((item) => ({
          ...item,
          date: item.startTime ? new Date(item.startTime).toLocaleDateString() : '-',
          time: item.startTime
            ? new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '-',
        }));

        setReservations(formatted);
        setDisplayedReservations(formatted);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = reservations.filter((r) =>
      [r.customerName, r.customerPhone, r.bookingId]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setDisplayedReservations(filtered);
  }, [searchTerm, reservations]);

  // Checkbox handlers
  const handleToggleReservation = (id, checked) => {
    const newSet = new Set(selectedReservations);
    if (checked) newSet.add(id);
    else newSet.delete(id);
    setSelectedReservations(newSet);
    setBulkActionsVisible(newSet.size > 0);
  };

  const handleToggleAllReservations = (e) => {
    if (e.target.checked) {
      const allIds = displayedReservations.map((r) => r.id);
      setSelectedReservations(new Set(allIds));
      setBulkActionsVisible(true);
    } else {
      setSelectedReservations(new Set());
      setBulkActionsVisible(false);
    }
  };

  const isAllSelected =
    displayedReservations.length > 0 && selectedReservations.size === displayedReservations.length;

  const handleBulkAction = (action) => {
    alert(`${action} clicked for ${selectedReservations.size} reservations`);
  };

  // Update status on frontend only
  const updateStatus = (id, newStatus) => {
    setDisplayedReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const getStatusBadgeClass = (status) => {
    const lower = status.toLowerCase();
    if (lower === 'pending') return 'bg-yellow-100 text-yellow-800';
    if (lower === 'cancelled') return 'bg-red-100 text-red-800';
    if (lower === 'confirmed') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) return <p className="text-center mt-10">Loading reservations...</p>;

  return (
    <div className="p-8 flex-1">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#111827]">Reservations</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            className="w-full sm:w-[300px] py-2.5 px-4 border-2 border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:border-[#667eea]"
            placeholder="Search by customer name, phone, booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={() => (window.location.href = '/reservation/calendar')}
          >
            <span>📅</span>
            Calendar View
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-[#e5e7eb] gap-3">
          <div className="text-lg font-semibold text-[#111827]">
            {displayedReservations.length} Reservations for {activeTab}
          </div>
          {bulkActionsVisible && (
            <div className="flex gap-3 items-center">
              <span className="text-sm text-[#6b7280]">
                {selectedReservations.size} selected
              </span>
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
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Booking ID
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Customer
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Date & Time
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Product
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  People
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Status
                </th>
                <th className="py-4 px-4 text-left text-sm font-semibold text-[#374151]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedReservations.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-16 text-[#6b7280] text-base"
                  >
                    No reservations found.
                  </td>
                </tr>
              ) : (
                displayedReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="border-b border-[#e5e7eb] hover:bg-gray-50 last:border-b-0"
                  >
                    <td className="py-4 px-4">
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 rounded-sm cursor-pointer accent-[#667eea]"
                        checked={selectedReservations.has(reservation.id)}
                        onChange={(e) =>
                          handleToggleReservation(reservation.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#111827]">
                      {reservation.bookingId}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#667eea] text-white flex items-center justify-center font-semibold text-sm">
                          {reservation.customerName
                            ? reservation.customerName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : '?'}
                        </div>
                        <div>
                          <div className="font-semibold text-[#111827]">
                            {reservation.customerName}
                          </div>
                          <div className="text-[#6b7280] text-xs flex items-center gap-1">
                            📞 {reservation.customerPhone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <strong>{reservation.date}</strong>
                      <br />
                      <span className="text-[#6b7280] text-xs">
                        {reservation.time}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-[#374151]">
                      {reservation.productName}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#374151]">
                      {reservation.people}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`py-1 px-3 rounded-full text-xs font-semibold ${getStatusBadgeClass(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          className="py-1.5 px-3 bg-[#667eea] text-white rounded-lg text-xs font-semibold hover:bg-[#5568d3]"
                          onClick={() => alert(`View ${reservation.id}`)}
                        >
                          View
                        </button>
                        {reservation.status.toLowerCase() === 'pending' && (
                          <>
                            <button
                              className="py-1.5 px-3 bg-[#10b981] text-white rounded-lg text-xs font-semibold hover:bg-[#059669]"
                              onClick={() => updateStatus(reservation.id, 'Confirmed')}
                            >
                              ✓ Confirm
                            </button>
                            <button
                              className="py-1.5 px-3 bg-[#ef4444] text-white rounded-lg text-xs font-semibold hover:bg-[#dc2626]"
                              onClick={() => updateStatus(reservation.id, 'Cancelled')}
                            >
                              ✗
                            </button>
                          </>
                        )}
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
            Showing <strong>{displayedReservations.length}</strong> of{' '}
            <strong>{reservations.length}</strong> reservations
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-[#6b7280]">Rows per page:</span>
            <select className="py-1.5 px-3 border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:border-[#667eea]">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
            <button
              className="py-1.5 px-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] text-sm opacity-50 cursor-not-allowed"
              disabled
            >
              ‹
            </button>
            <button className="py-1.5 px-3 border border-[#667eea] bg-[#667eea] text-white rounded-lg text-sm">
              1
            </button>
            <button className="py-1.5 px-3 border border-[#d1d5db] rounded-lg bg-white text-[#374151] text-sm hover:bg-gray-50">
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationsPage;
