import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

const ReservationDetailsCard = ({ 
  reservationDetails, 
  setReservationDetails, 
  timeSlots, 
  isSubmittingReservation 
}) => {

  const handleTimeSlotSelect = (slot) => {
    if (slot.isAvailable) {
      setReservationDetails(prev => ({
        ...prev,
        selectedTimeSlot: prev.selectedTimeSlot?.id === slot.id ? null : slot,
      }));
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Schedule Visit</CardTitle>
            <CardDescription className="text-slate-500">Choose a date and time slot</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
          
          {/* LEFT SIDE: DATE SELECTION */}
          <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-slate-100 bg-white flex flex-col">
            <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
               Select Date <span className="text-red-500">*</span>
            </label>
            
            <div className="relative mb-6">
              <Input
                type="date"
                id="selectedDate"
                name="selectedDate"
                value={reservationDetails.selectedDate}
                onChange={e => setReservationDetails(prev => ({ ...prev, selectedDate: e.target.value, selectedTimeSlot: null }))}
                required
                className="w-full p-3 h-12 text-base border-slate-200 focus:ring-slate-900 focus:border-slate-900 rounded-lg"
                disabled={isSubmittingReservation}
              />
            </div>

            <div className="mt-auto p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h4 className="text-xs font-semibold text-slate-800 mb-2 uppercase tracking-wide">Availability Rules</h4>
              <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
                <li>Times are in your local timezone.</li>
                <li>Duration is set to default (45m).</li>
                <li>Slots unavailable are grayed out.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE: TIME SELECTION */}
          <div className="w-full md:w-7/12 flex flex-col bg-slate-50/30">
            <div className="p-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex justify-between items-center shadow-sm">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Clock size={16} /> Available Slots
              </span>
              {reservationDetails.selectedDate && (
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                   {reservationDetails.selectedDate}
                 </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {!reservationDetails.selectedDate ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[200px]">
                  <Calendar size={48} className="text-slate-200" strokeWidth={1} />
                  <span className="text-sm">Select a date to view times</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => {
                     const isSelected = reservationDetails.selectedTimeSlot?.id === slot.id;
                     
                     return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleTimeSlotSelect(slot)}
                        disabled={!slot.isAvailable || isSubmittingReservation}
                        className={cn(
                          "relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border flex items-center justify-center",
                          isSelected 
                            ? "bg-slate-900 text-white border-slate-900 shadow-md transform scale-[1.02]" 
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:shadow-sm",
                          (!slot.isAvailable) && "opacity-40 bg-slate-100 border-transparent cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                        {isSelected && <CheckCircle2 size={14} className="absolute right-2 text-slate-400/50" />}
                      </button>
                    );
                  })}
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