'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  MoreHorizontal, 
  Video, 
  Eye, 
  ShoppingBag,
  Radio,
  Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 

import { cn } from '@/lib/utils';

// --- Dummy Data (Kept the same) ---
const dummyStats = {
  totalStreams: 24,
  totalWatchHours: 156,
  averageViewers: 87,
  reservationsGenerated: 342,
  streamTrend: 12,
  watchHoursTrend: 8,
  viewersTrend: 15,
  reservationsTrend: 23,
};

const dummyStreams = [
  { id: 's1', title: 'New iPhone 14 Collection Launch', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=300&q=80', duration: '45:23', date: 'Jan 24, 2025', durationMinutes: 45, totalViews: 245, productsPinned: 5, status: 'completed' },
  { id: 's2', title: 'Samsung Galaxy S23 Showcase', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1610945265078-3858a0b5d38b?auto=format&fit=crop&w=300&q=80', duration: '38:15', date: 'Jan 23, 2025', durationMinutes: 38, totalViews: 187, productsPinned: 4, status: 'completed' },
  { id: 's3', title: 'Exclusive OnePlus 11 Demo', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1598327774666-978e39a91789?auto=format&fit=crop&w=300&q=80', duration: '52:40', date: 'Jan 22, 2025', durationMinutes: 52, totalViews: 298, productsPinned: 6, status: 'completed' },
  { id: 's4', title: 'Weekend Special Offers', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=300&q=80', duration: '30:12', date: 'Jan 21, 2025', durationMinutes: 30, totalViews: 152, productsPinned: 8, status: 'completed' },
  { id: 's5', title: 'Google Pixel 7 Pro Features', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1573148195900-7845dcb9b858?auto=format&fit=crop&w=300&q=80', duration: '41:55', date: 'Jan 20, 2025', durationMinutes: 41, totalViews: 223, productsPinned: 5, status: 'completed' },
];

const dummyScheduledStreams = [
  { id: 'sch1', title: 'Upcoming Laptop Showcase', meta: 'Electronics', thumbnail: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=300&q=80', duration: 'Scheduled', date: 'Feb 01, 2025', time: '10:00 AM', status: 'scheduled' },
  { id: 'sch2', title: 'Winter Collection Preview', meta: 'Fashion', thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80', duration: 'Scheduled', date: 'Feb 05, 2025', time: '02:00 PM', status: 'scheduled' },
  { id: 'live1', title: 'Daily Deals Live!', meta: 'Mixed', thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80', duration: 'Live', date: 'Nov 18, 2025', time: '01:00 PM', status: 'live' },
];

const StatCard = ({ title, value, trend, icon: Icon, colorClass }) => (
  <Card className="border-border shadow-sm hover:border-primary/50 transition-all duration-200 group bg-card text-card-foreground">
    <CardContent className="p-5">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg transition-colors opacity-80", colorClass)}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-green-600 bg-green-500/10 w-fit px-2 py-1 rounded-full border border-green-500/20">
        <TrendingUp size={12} className="mr-1" />
        <span>+{trend}%</span>
        <span className="text-muted-foreground font-normal ml-1">vs last month</span>
      </div>
    </CardContent>
  </Card>
);

const LiveStreamsDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('past');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const streamsToDisplay = activeTab === 'past' ? dummyStreams : dummyScheduledStreams;
  const totalStreams = streamsToDisplay.length;
  const totalPages = Math.ceil(totalStreams / rowsPerPage);
  const currentPaginatedStreams = streamsToDisplay.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Live Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage streams, scheduled events, and performance metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="bg-background border-border hover:bg-muted">
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
              <Video className="mr-2 h-4 w-4" />
              New Stream
            </Button>
          </div>
        </div>

        {/* Hero / Action Section */}
        {/* We keep specific colors here as it's a feature banner, but ensure text is readable */}
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background shadow-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/30 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm">
                <Radio className="mr-1.5 h-3 w-3 text-red-500 animate-pulse" />
                Ready to broadcast
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-background">
                Engage your audience in real-time
              </h2>
              <p className="text-background/70 text-lg leading-relaxed">
                Start streaming now to showcase products, answer questions, and drive conversions directly from your video feed.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-semibold">
                  <Radio className="mr-2 h-4 w-4" />
                  Go Live Now
                </Button>
                <Button size="lg" variant="outline" className="border-background/20 bg-background/5 text-background hover:bg-background/10 hover:text-background backdrop-blur-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Later
                </Button>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="hidden md:block relative w-64 h-48 bg-background/10 rounded-xl border border-background/10 backdrop-blur-md p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white"><Video size={14} /></div>
                 <div className="h-2 w-24 bg-background/20 rounded"></div>
              </div>
              <div className="space-y-2">
                 <div className="h-24 w-full bg-background/10 rounded-lg animate-pulse"></div>
                 <div className="flex gap-2">
                   <div className="h-2 w-1/3 bg-background/20 rounded"></div>
                   <div className="h-2 w-1/4 bg-background/20 rounded"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard 
            title="Total Streams" 
            value={dummyStats.totalStreams} 
            trend={dummyStats.streamTrend} 
            icon={Video}
            colorClass="bg-blue-500/10 text-blue-600"
          />
          <StatCard 
            title="Watch Hours" 
            value={`${dummyStats.totalWatchHours}h`} 
            trend={dummyStats.watchHoursTrend} 
            icon={Clock}
            colorClass="bg-purple-500/10 text-purple-600"
          />
          <StatCard 
            title="Avg Viewers" 
            value={dummyStats.averageViewers} 
            trend={dummyStats.viewersTrend} 
            icon={Users}
            colorClass="bg-orange-500/10 text-orange-600"
          />
          <StatCard 
            title="Reservations" 
            value={dummyStats.reservationsGenerated} 
            trend={dummyStats.reservationsTrend} 
            icon={ShoppingBag}
            colorClass="bg-emerald-500/10 text-emerald-600"
          />
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {/* Custom Tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="bg-card p-1 rounded-lg border border-border inline-flex">
              <button
                onClick={() => { setActiveTab('past'); setCurrentPage(1); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === 'past' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Past Streams
              </button>
              <button
                onClick={() => { setActiveTab('scheduled'); setCurrentPage(1); }}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all",
                  activeTab === 'scheduled' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Scheduled
              </button>
            </div>
            
            <div className="relative w-full sm:w-auto">
               <input 
                 placeholder="Search streams..." 
                 className="w-full sm:w-64 text-sm px-4 py-2.5 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
               />
            </div>
          </div>

          {/* Table */}
          <Card className="border border-border shadow-sm overflow-hidden bg-card text-card-foreground">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stream Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentPaginatedStreams.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                          <Video className="text-muted-foreground" />
                        </div>
                        <h3 className="text-foreground font-medium">No streams found</h3>
                        <p className="text-muted-foreground text-sm mt-1">Get started by scheduling a new stream.</p>
                      </td>
                    </tr>
                  ) : (
                    currentPaginatedStreams.map((stream) => (
                      <tr key={stream.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-sm group-hover:shadow-md transition-all bg-muted">
                              <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover" />
                              {stream.status === 'live' ? (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Badge className="bg-red-500 hover:bg-red-600 border-0 text-[10px] px-2 py-0.5 text-white">LIVE</Badge>
                                </div>
                              ) : (
                                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-medium px-1 rounded">
                                  {stream.duration}
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{stream.title}</h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-normal border-border bg-background text-muted-foreground">
                                  {stream.meta}
                                </Badge>
                                <span>• {stream.id}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{stream.date}</span>
                            <span className="text-xs text-muted-foreground flex items-center mt-0.5">
                              <Clock size={12} className="mr-1" />
                              {stream.status === 'scheduled' ? stream.time : `${stream.durationMinutes} mins`}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {stream.status === 'scheduled' ? (
                            <span className="text-xs text-muted-foreground italic">--</span>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5" title="Views">
                                <Eye size={14} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{stream.totalViews}</span>
                              </div>
                              <div className="flex items-center gap-1.5" title="Products Pinned">
                                <ShoppingBag size={14} className="text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">{stream.productsPinned}</span>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-card border-border">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem className="text-xs cursor-pointer">View Analytics</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs cursor-pointer">Edit Details</DropdownMenuItem>
                              <div className="h-px bg-border my-1" />
                              <DropdownMenuItem className="text-xs text-destructive focus:text-destructive cursor-pointer">Delete Stream</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            {totalStreams > 0 && (
              <div className="border-t border-border bg-muted/20 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(currentPage - 1) * rowsPerPage + 1}</span> to <span className="font-medium text-foreground">{Math.min(currentPage * rowsPerPage, totalStreams)}</span> of <span className="font-medium text-foreground">{totalStreams}</span> streams
                </p>
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        className={cn("cursor-pointer bg-background hover:bg-muted", currentPage === 1 && "opacity-50 pointer-events-none")}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink isActive className="bg-primary text-primary-foreground border-primary">{currentPage}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={cn("cursor-pointer bg-background hover:bg-muted", currentPage === totalPages && "opacity-50 pointer-events-none")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamsDashboard;