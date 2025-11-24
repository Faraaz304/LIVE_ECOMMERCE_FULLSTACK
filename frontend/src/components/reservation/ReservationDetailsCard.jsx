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
    <Card className="border-border shadow-sm bg-card text-card-foreground overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg border border-purple-500/20">
            <Calendar size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Schedule Visit</CardTitle>
            <CardDescription className="text-muted-foreground">Choose a date and time slot</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
          
          {/* LEFT SIDE: DATE SELECTION */}
          <div className="w-full md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-border bg-card flex flex-col">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
               Select Date <span className="text-destructive">*</span>
            </label>
            
            <div className="relative mb-6">
              <Input
                type="date"
                id="selectedDate"
                name="selectedDate"
                value={reservationDetails.selectedDate}
                onChange={e => setReservationDetails(prev => ({ ...prev, selectedDate: e.target.value, selectedTimeSlot: null }))}
                required
                className="w-full p-3 h-12 text-base border-input bg-background focus-visible:ring-primary rounded-lg"
                disabled={isSubmittingReservation}
              />
            </div>

            <div className="mt-auto p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Availability Rules</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                <li>Times are in your local timezone.</li>
                <li>Duration is set to default (45m).</li>
                <li>Slots unavailable are grayed out.</li>
              </ul>
            </div>
          </div>

          {/* RIGHT SIDE: TIME SELECTION */}
          <div className="w-full md:w-7/12 flex flex-col bg-muted/10">
            <div className="p-4 border-b border-border bg-card sticky top-0 z-10 flex justify-between items-center shadow-sm">
              <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock size={16} /> Available Slots
              </span>
              {reservationDetails.selectedDate && (
                 <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded border border-border">
                   {reservationDetails.selectedDate}
                 </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {!reservationDetails.selectedDate ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3 min-h-[200px]">
                  <Calendar size={48} className="text-muted-foreground/20" strokeWidth={1} />
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
                            ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-[1.02]" 
                            : "bg-card text-foreground border-border hover:border-primary/50 hover:shadow-sm hover:bg-muted/50",
                          (!slot.isAvailable) && "opacity-40 bg-muted border-transparent cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                        {isSelected && <CheckCircle2 size={14} className="absolute right-2 text-primary-foreground/70" />}
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