import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Phone, Mail, Contact } from 'lucide-react';

const CustomerDetailsCard = ({ customerDetails, handleCustomerChange, isSubmittingReservation }) => {
  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Contact size={20} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Customer Details</CardTitle>
            <CardDescription className="text-slate-500">Contact information for this booking</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <User size={14} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            id="fullName"
            name="fullName"
            className="border-slate-200 focus:ring-slate-900 focus:border-slate-900"
            placeholder="e.g. John Doe"
            value={customerDetails.fullName}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Phone size={14} className="text-slate-400" /> Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="border-slate-200 focus:ring-slate-900 focus:border-slate-900"
            placeholder="e.g. 9876543210"
            value={customerDetails.phoneNumber}
            onChange={handleCustomerChange}
            required
            disabled={isSubmittingReservation}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Mail size={14} className="text-slate-400" /> Email Address <span className="text-slate-400 font-normal text-xs ml-auto">(Optional)</span>
          </label>
          <Input
            type="email"
            id="email"
            name="email"
            className="border-slate-200 focus:ring-slate-900 focus:border-slate-900"
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