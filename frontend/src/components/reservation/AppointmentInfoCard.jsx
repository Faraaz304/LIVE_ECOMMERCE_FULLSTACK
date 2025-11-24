import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

const AppointmentInfoCard = ({ date, time }) => {
  return (
    <Card className="shadow-sm border-border bg-card text-card-foreground">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-500" /> Appointment Info
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Date Box - Compact */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border flex items-center gap-3">
          <div className="p-2 bg-background rounded-full border border-border text-muted-foreground">
             <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Date</p>
            <p className="text-sm font-bold text-foreground">{date}</p>
          </div>
        </div>

        {/* Time Box - Compact */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border flex items-center gap-3">
          <div className="p-2 bg-background rounded-full border border-border text-muted-foreground">
             <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Time Slot</p>
            <p className="text-sm font-bold text-foreground">{time}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentInfoCard;