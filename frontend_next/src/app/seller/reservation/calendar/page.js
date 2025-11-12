// app/(dashboard)/reservation/calendar/page.js
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// NO METADATA EXPORT IN THIS FILE, as requested.

const dummyReservationsCalendar = [
  // Example for Jan 2025
  { date: new Date(2025, 0, 1), customer: 'Customer A', product: 'Item 1', status: 'confirmed' },
  { date: new Date(2025, 0, 1), customer: 'Customer B', product: 'Item 2', status: 'confirmed' },
  { date: new Date(2025, 0, 2), customer: 'Customer C', product: 'Item 3', status: 'confirmed' },
  { date: new Date(2025, 0, 3), customer: 'Customer D', product: 'Item 4', status: 'confirmed' },
  { date: new Date(2025, 0, 3), customer: 'Customer E', product: 'Item 5', status: 'confirmed' },
  { date: new Date(2025, 0, 3), customer: 'Customer F', product: 'Item 6', status: 'confirmed' },
  { date: new Date(2025, 0, 5), customer: 'Customer G', product: 'Item 7', status: 'confirmed' },
  { date: new Date(2025, 0, 5), customer: 'Customer H', product: 'Item 8', status: 'pending' },
  { date: new Date(2025, 0, 7), customer: 'Customer I', product: 'Item 9', status: 'confirmed' },
  { date: new Date(2025, 0, 8), customer: 'Customer J', product: 'Item 10', status: 'confirmed' },
  { date: new Date(2025, 0, 8), customer: 'Customer K', product: 'Item 11', status: 'confirmed' },
  { date: new Date(2025, 0, 8), customer: 'Customer L', product: 'Item 12', status: 'pending' },
  { date: new Date(2025, 0, 10), customer: 'Customer M', product: 'Item 13', status: 'confirmed' },
  { date: new Date(2025, 0, 12), customer: 'Customer N', product: 'Item 14', status: 'confirmed' },
  { date: new Date(2025, 0, 12), customer: 'Customer O', product: 'Item 15', status: 'confirmed' },
  { date: new Date(2025, 0, 14), customer: 'Customer P', product: 'Item 16', status: 'confirmed' },
  { date: new Date(2025, 0, 15), customer: 'Customer Q', product: 'Item 17', status: 'confirmed' },
  { date: new Date(2025, 0, 15), customer: 'Customer R', product: 'Item 18', status: 'confirmed' },
  { date: new Date(2025, 0, 15), customer: 'Customer S', product: 'Item 19', status: 'pending' },
  { date: new Date(2025, 0, 15), customer: 'Customer T', product: 'Item 20', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer U', product: 'Item 21', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer V', product: 'Item 22', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer W', product: 'Item 23', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer X', product: 'Item 24', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer Y', product: 'Item 25', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer Z', product: 'Item 26', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer AA', product: 'Item 27', status: 'confirmed' },
  { date: new Date(2025, 0, 18), customer: 'Customer BB', product: 'Item 28', status: 'confirmed' },
  // ... more dummy data for other days if needed
];

const ReservationsCalendarPage = () => {
  const router = useRouter();

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date()); // For the day sidebar
  const [activeCalendarView, setActiveCalendarView] = useState('Calendar');
  const [filterStatus, setFilterStatus] = useState('All Status');


  // Helper function to get days for the current month view
  const getDaysInMonth = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();

    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];

    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
        reservations: [],
      });
    }

    // Add days of the current month
    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        reservations: [],
      });
    }

    // Add days from next month to fill the last week
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        reservations: [],
      });
    }

    // Populate reservations for each day
    days.forEach(day => {
      day.reservations = dummyReservationsCalendar.filter(res => 
        res.date.toDateString() === day.date.toDateString()
      );
    });

    return days;
  };

  const daysInView = getDaysInMonth(currentMonth, currentYear);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#d1fae5] text-[#065f46]'; // Greenish
      case 'pending': return 'bg-[#fef3c7] text-[#92400e]'; // Orangish
      case 'completed': return 'bg-[#dbeafe] text-[#1e40af]'; // Bluish
      case 'cancelled': return 'bg-[#fee2e2] text-[#991b1b]'; // Reddish
      case 'no-show': return 'bg-[#f3f4f6] text-[#4b5563]'; // Grayish
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getReservationDotClass = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-[#10b981]';
      case 'pending': return 'bg-[#f59e0b]';
      case 'completed': return 'bg-[#3b82f6]';
      case 'cancelled': return 'bg-[#ef4444]';
      default: return 'bg-gray-400';
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1));
    setCurrentYear(prev => (currentMonth === 0 ? prev - 1 : prev));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1));
    setCurrentYear(prev => (currentMonth === 11 ? prev + 1 : prev));
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate(today);
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const filteredDayReservations = dummyReservationsCalendar.filter(res => 
    res.date.toDateString() === selectedDate.toDateString() &&
    (filterStatus === 'All Status' || res.status === filterStatus.toLowerCase())
  ).sort((a,b) => a.date.getTime() - b.date.getTime()); // Sort by time

  const nextReservation = filteredDayReservations.find(res => res.date > new Date()); // Find the next one after now (simulated)


  return (
    <div className="p-8 flex-1 bg-[#f9fafb] flex flex-col lg:flex-row gap-6">
      {/* Calendar Section (Left/Top) */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-xl border border-[#e5e7eb] mb-6">
          {/* Calendar Header */}
          <div className="py-5 px-6 flex flex-col sm:flex-row justify-between items-center border-b border-[#e5e7eb] gap-3">
            <h2 className="text-2xl font-bold text-[#111827]">
              {new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <button
                className="py-2 px-3 bg-white border-2 border-[#e5e7eb] rounded-lg cursor-pointer transition-all hover:bg-gray-50 hover:border-[#667eea]"
                onClick={goToPreviousMonth}
              >
                ◀
              </button>
              <button
                className="py-2 px-4 bg-[#667eea] text-white rounded-lg text-sm font-semibold cursor-pointer"
                onClick={goToToday}
              >
                Today
              </button>
              <button
                className="py-2 px-3 bg-white border-2 border-[#e5e7eb] rounded-lg cursor-pointer transition-all hover:bg-gray-50 hover:border-[#667eea]"
                onClick={goToNextMonth}
              >
                ▶
              </button>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <Link
                  href="/reservation/calendar"
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all ${
                    activeCalendarView === 'Calendar' ? 'bg-white shadow-sm text-[#667eea]' : ''
                  }`}
                  onClick={() => setActiveCalendarView('Calendar')}
                >
                  Calendar
                </Link>
                <Link
                  href="/reservation"
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all ${
                    activeCalendarView === 'List' ? 'bg-white shadow-sm text-[#667eea]' : ''
                  }`}
                  onClick={() => setActiveCalendarView('List')}
                >
                  List
                </Link>
                {/* Timeline view not implemented */}
                <button
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium text-[#6b7280] transition-all`}
                  onClick={() => alert('Timeline View not implemented')}
                >
                  Timeline
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar (for calendar specific filters) */}
          <div className="py-4 px-6 flex flex-col sm:flex-row gap-3 items-center border-b border-[#e5e7eb]">
              <select
                  className="py-2 px-3 border-2 border-[#e5e7eb] rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:border-[#667eea] w-full sm:w-auto"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
              >
                  <option>All Status</option>
                  <option>Confirmed</option>
                  <option>Pending</option>
                  <option>Cancelled</option>
                  <option>Completed</option>
                  <option>No-show</option>
              </select>
              <button className="ml-auto py-2 px-4 bg-white border-2 border-[#667eea] text-[#667eea] rounded-lg text-sm font-semibold cursor-pointer w-full sm:w-auto">
                  ⚙️ Set Availability
              </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-container">
            <div className="grid grid-cols-7">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-[#6b7280] bg-gray-50 border-b border-[#e5e7eb]">
                  {day}
                </div>
              ))}

              {daysInView.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[120px] border border-[#f3f4f6] p-2 cursor-pointer transition-all hover:bg-gray-50 relative ${
                    !day.isCurrentMonth ? 'bg-gray-100 text-[#d1d5db]' : ''
                  } ${day.date.toDateString() === today.toDateString() ? 'bg-[#667eea]/[0.05]' : ''}
                  ${selectedDate.toDateString() === day.date.toDateString() ? 'border-2 border-[#667eea] bg-[#667eea]/[0.05]' : ''}
                  `}
                  onClick={() => handleDayClick(day.date)}
                >
                  <div className={`text-sm font-semibold text-[#374151] mb-1 ${
                    day.date.toDateString() === today.toDateString() && day.isCurrentMonth ? 'w-7 h-7 bg-[#667eea] text-white rounded-full flex items-center justify-center' : ''
                  }`}>
                    {day.date.getDate()}
                  </div>
                  {day.reservations.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1">
                      {day.reservations.slice(0, 3).map((res, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${getReservationDotClass(res.status)}`}></div>
                      ))}
                      {day.reservations.length > 3 && (
                        <span className="text-xs text-[#6b7280] ml-1">+{day.reservations.length - 3}</span>
                      )}
                    </div>
                  )}
                  {day.reservations.length > 0 && (
                      <div className="text-xs text-[#6b7280] mt-1">{day.reservations.length} reservations</div>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 p-4 border-t border-[#e5e7eb] bg-gray-50">
              <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                <span>Confirmed</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                <span>Pending</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6b7280]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></div>
                <span>Cancelled</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Day Sidebar (Right Column) */}
      <div className="w-full lg:w-[350px] bg-white rounded-xl border border-[#e5e7eb] flex flex-col lg:max-h-[calc(100vh-128px)] sticky top-24 overflow-hidden">
        <div className="p-5 border-b border-[#e5e7eb]">
          <h3 className="text-xl font-bold text-[#111827] mb-2">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </h3>
          <p className="text-sm text-[#6b7280]">
            {filteredDayReservations.length} Reservations
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {filteredDayReservations.length === 0 ? (
            <div className="text-center py-8 text-[#9ca3af]">
              <div className="text-5xl mb-3">🗓️</div>
              <p className="text-base">No reservations for this day.</p>
            </div>
          ) : (
            filteredDayReservations.map((res, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3 cursor-pointer transition-all hover:bg-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-[#374151]">{res.time}</span>
                  <span className={`py-0.5 px-2 rounded-full text-xs font-semibold ${getStatusBadgeClass(res.status)}`}>
                    {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-[#6b7280] mb-1">
                  <strong className="text-[#111827]">{res.customerName}</strong> ({res.people} people)
                </p>
                <p className="text-xs text-[#9ca3af] mb-2">Product: {res.productName}</p>
                <button
                  className="py-1.5 px-3 bg-[#667eea] text-white rounded-md text-xs font-semibold"
                  onClick={() => alert(`View details for ${res.bookingId}`)}
                >
                  View Details
                </button>
              </div>
            ))
          )}
          
        </div>

        <button
          className="m-5 py-3 px-5 text-white rounded-lg text-sm font-semibold cursor-pointer flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          onClick={() => alert(`Add new booking for ${selectedDate.toDateString()}`)}
        >
          ➕ Add New Booking
        </button>

        {/* Today's Panel (only shown if selectedDate is today) */}
        {selectedDate.toDateString() === today.toDateString() && (
          <div className="p-5 border-t border-[#e5e7eb]">
            <h4 className="text-base font-bold text-[#111827] mb-4">Today's Highlights</h4>
            {nextReservation ? (
              <div className="bg-[#667eea]/[0.05] border-l-4 border-[#667eea] p-4 rounded-lg mb-4">
                <div className="text-xs font-semibold text-[#667eea] mb-2">NEXT RESERVATION</div>
                <div className="text-lg font-bold text-[#111827] mb-1">
                  {new Date(nextReservation.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="text-sm text-[#6b7280]">{nextReservation.customer} for {nextReservation.product}</p>
              </div>
            ) : (
                <div className="text-sm text-[#6b7280] text-center py-4 bg-gray-50 rounded-lg">No upcoming reservations today.</div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 py-2 px-3 bg-white border-2 border-[#e5e7eb] text-[#374151] rounded-lg text-xs font-semibold cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea]">
                📞 Call Customer
              </button>
              <button className="flex-1 py-2 px-3 bg-white border-2 border-[#e5e7eb] text-[#374151] rounded-lg text-xs font-semibold cursor-pointer transition-all hover:border-[#667eea] hover:text-[#667eea]">
                💬 Send Message
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsCalendarPage;