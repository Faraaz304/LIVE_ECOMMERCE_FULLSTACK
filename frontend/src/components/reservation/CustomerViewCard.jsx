import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail } from 'lucide-react';

const CustomerViewCard = ({ customerName, customerPhone, customerEmail }) => {
  
  const getCustomerInitials = (fullName) => {
    if (!fullName) return 'CX';
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Card className="shadow-sm border-border bg-card text-card-foreground">
      <CardHeader className="py-3 px-4 border-b border-border">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Customer Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Avatar - Reduced size */}
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20 flex-shrink-0 mt-1">
            {getCustomerInitials(customerName)}
          </div>
          
          <div className="flex-1 space-y-3">
            {/* Name Section */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Full Name</p>
              <p className="text-sm font-semibold text-foreground">{customerName || 'Unknown'}</p>
            </div>
            
            {/* Contact Grid - Tighter spacing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5 flex items-center gap-1">
                   <Phone className="w-3 h-3" /> Phone
                </p>
                <p className="text-sm font-medium text-foreground">{customerPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5 flex items-center gap-1">
                   <Mail className="w-3 h-3" /> Email
                </p>
                <p className="text-sm font-medium text-foreground truncate">{customerEmail || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerViewCard;