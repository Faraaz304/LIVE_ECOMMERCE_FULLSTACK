import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Contact } from 'lucide-react';

const CustomerDetailsCard = ({ customerDetails, handleCustomerChange, isSubmittingReservation }) => {
  return (
    <Card className="border-border shadow-sm bg-card text-card-foreground overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-600 rounded-lg border border-blue-500/20">
            <Contact size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">Customer Details</CardTitle>
            <CardDescription className="text-muted-foreground">Contact information for this booking</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
            <User size={14} className="text-muted-foreground" /> Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            className="border-input bg-background focus-visible:ring-primary"
            placeholder="e.g. John Doe"
            value={customerDetails.fullName}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone size={14} className="text-muted-foreground" /> Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="border-input bg-background focus-visible:ring-primary"
            placeholder="e.g. 9876543210"
            value={customerDetails.phoneNumber}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
            <Mail size={14} className="text-muted-foreground" /> Email Address <span className="text-muted-foreground font-normal text-xs ml-auto">(Optional)</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            className="border-input bg-background focus-visible:ring-primary"
            placeholder="e.g. john@example.com"
            value={customerDetails.email}
            onChange={handleCustomerChange}
            disabled={isSubmittingReservation}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerDetailsCard;