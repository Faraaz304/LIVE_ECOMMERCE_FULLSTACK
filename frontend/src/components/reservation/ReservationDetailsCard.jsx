// --- START OF FILE ReservationDetailsCard.jsx ---

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react'; // Make sure lucide-react is installed, or replace with emoji

const ReservationDetailsCard = ({ 
  reservationDetails, 
  setReservationDetails, 
  timeSlots, // Receive generated slots from parent
  isSubmittingReservation 
}) => {

  const handleTimeSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setReservationDetails(prev => ({
        ...prev,
        // If clicking the currently selected slot, deselect it (set to null), else select new
        selectedTimeSlot: prev.selectedTimeSlot?.id === slot.id ? null : slot,
      }));
    }
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span>📅</span> Schedule Visit
        </CardTitle>
        <CardDescription>
          Select your preferred date and time slot.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-full md:h-[400px]">
          
          {/* LEFT SIDE: DATE SELECTION */}
          <div className="w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r border-gray-100 bg-white">
            <label className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Select Date
            </label>
            
            <div className="relative">
              <Input
                type="date"
                id="selectedDate"
                name="selectedDate"
                value={reservationDetails.selectedDate}
                onChange={e => setReservationDetails(prev => ({ ...prev, selectedDate: e.target.value, selectedTimeSlot: null }))}
                required
                className="w-full p-4 text-lg border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                disabled={isSubmittingReservation}
              />
              
              <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-1">Booking Info</h4>
                <p className="text-xs text-blue-600 leading-relaxed">
                  • All times are in your local timezone.<br/>
                  • Please select a date to view available time slots.<br/>
                  • Slots are available every 15 minutes.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: TIME SELECTION (Zoom Style) */}
          <div className="w-full md:w-1/2 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10 flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Select Time
              </label>
              <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded">
                15 min intervals
              </span>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
              {!reservationDetails.selectedDate ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                  <Calendar className="w-8 h-8 opacity-20" />
                  <span>Please select a date first</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {timeSlots.map((slot) => {
                     const isSelected = reservationDetails.selectedTimeSlot?.id === slot.id;
                     
                     return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeSlotSelect(slot)}
                        disabled={!slot.isAvailable || isSubmittingReservation}
                        className={cn(
                          "group relative w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border",
                          
                          // SELECTED STATE: High contrast (Blue background, White text)
                          isSelected 
                            ? "bg-blue-600 text-white border-blue-600 shadow-md ring-1 ring-blue-600 scale-[1.02]" 
                            : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:shadow-sm hover:text-blue-600",
                          
                          // DISABLED STATE
                          (!slot.isAvailable) && "opacity-50 bg-gray-100 text-gray-400 cursor-not-allowed hover:border-gray-200 hover:shadow-none hover:text-gray-400"
                        )}
                      >
                        <span className="flex items-center gap-2">
                           {slot.time}
                        </span>
                        
                        {/* Checkmark for selected state */}
                        {isSelected && (
                          <span className="bg-white/20 p-0.5 rounded-full">
                             <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                             </svg>
                          </span>
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Spacer for bottom scrolling */}
                  <div className="h-4"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDetailsCard;