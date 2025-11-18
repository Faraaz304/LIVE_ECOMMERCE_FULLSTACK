import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Assuming cn utility

const mockTimeSlots = [
  { id: '1', time: '10:00 AM', capacity: 2, isAvailable: true },
  { id: '2', time: '10:30 AM', capacity: 2, isAvailable: true },
  { id: '3', time: '11:00 AM', capacity: 2, isAvailable: true },
  { id: '4', time: '11:30 AM', capacity: 1, isAvailable: true },
  { id: '5', time: '12:00 PM', capacity: 0, isAvailable: false }, // Unavailable
  { id: '6', time: '12:30 PM', capacity: 2, isAvailable: true },
  { id: '7', time: '1:00 PM', capacity: 2, isAvailable: true },
  { id: '8', time: '1:30 PM', capacity: 2, isAvailable: true },
  { id: '9', time: '2:00 PM', capacity: 2, isAvailable: true },
  { id: '10', time: '2:30 PM', capacity: 2, isAvailable: true },
  { id: '11', time: '3:00 PM', capacity: 2, isAvailable: true },
  { id: '12', time: '3:30 PM', capacity: 2, isAvailable: true },
];

const ReservationDetailsCard = ({ reservationDetails, setReservationDetails, isSubmittingReservation }) => {
  const handleTimeSlotSelect = (id, isAvailable) => {
    if (isAvailable) {
      setReservationDetails(prev => ({
        ...prev,
        selectedTimeSlotId: prev.selectedTimeSlotId === id ? null : id, // Toggle selection
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <span>📅</span> Reservation Details
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Select date and time for the visit
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="selectedDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Select Date <span className="text-error-500">*</span>
          </label>
          <Input
            type="date"
            id="selectedDate"
            name="selectedDate"
            value={reservationDetails.selectedDate}
            onChange={e => setReservationDetails(prev => ({ ...prev, selectedDate: e.target.value }))}
            required
            className="w-full"
            disabled={isSubmittingReservation}
          />
          <span className="text-xs text-gray-500">Choose a date for the reservation</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            Select Time Slot <span className="text-error-500">*</span>
          </label>
          <span className="text-xs text-gray-500">Available time slots for the selected date</span>

          <div className="grid grid-cols-fill-140 gap-3 mt-4">
            {mockTimeSlots.map(slot => (
              <div
                key={slot.id}
                className={cn(
                  "p-3 border-2 rounded-md text-center cursor-pointer transition-all",
                  slot.id === reservationDetails.selectedTimeSlotId
                    ? "border-primary-500 bg-primary-500 text-white"
                    : slot.isAvailable
                      ? "border-gray-200 bg-white hover:border-primary-500 hover:bg-primary-500/[0.05]"
                      : "border-gray-200 bg-gray-50 opacity-40 cursor-not-allowed"
                )}
                onClick={() => handleTimeSlotSelect(slot.id, slot.isAvailable)}
                aria-disabled={!slot.isAvailable || isSubmittingReservation}
                tabIndex={slot.isAvailable && !isSubmittingReservation ? 0 : -1}
              >
                <div className="font-semibold text-sm mb-1">{slot.time}</div>
                <div className="text-xs">{slot.capacity} spots left</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservationDetailsCard;