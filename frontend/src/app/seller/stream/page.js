'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

import { cn } from '@/lib/utils';

// --- Dummy Data ---
const dummyStats = {
  totalStreams: 24,
  totalWatchHours: 156,
  averageViewers: 87,
  reservationsGenerated: 342,
  streamTrend: 12, // For demonstration, positive is 'up'
  watchHoursTrend: 8,
  viewersTrend: 15,
  reservationsTrend: 23,
};

const dummyStreams = [
  {
    id: 's1',
    title: 'New iPhone 14 Collection Launch',
    meta: 'Electronics • Live Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Stream+1',
    duration: '45:23',
    date: 'Jan 24, 2025',
    durationMinutes: 45,
    totalViews: 245,
    productsPinned: 5,
    status: 'completed',
  },
  {
    id: 's2',
    title: 'Samsung Galaxy S23 Showcase',
    meta: 'Electronics • Live Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Stream+2',
    duration: '38:15',
    date: 'Jan 23, 2025',
    durationMinutes: 38,
    totalViews: 187,
    productsPinned: 4,
    status: 'completed',
  },
  {
    id: 's3',
    title: 'Exclusive OnePlus 11 Demo',
    meta: 'Electronics • Live Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Stream+3',
    duration: '52:40',
    date: 'Jan 22, 2025',
    durationMinutes: 52,
    totalViews: 298,
    productsPinned: 6,
    status: 'completed',
  },
  {
    id: 's4',
    title: 'Weekend Special Offers',
    meta: 'Electronics • Live Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Stream+4',
    duration: '30:12',
    date: 'Jan 21, 2025',
    durationMinutes: 30,
    totalViews: 152,
    productsPinned: 8,
    status: 'completed',
  },
  {
    id: 's5',
    title: 'Google Pixel 7 Pro Features',
    meta: 'Electronics • Live Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Stream+5',
    duration: '41:55',
    date: 'Jan 20, 2025',
    durationMinutes: 41,
    totalViews: 223,
    productsPinned: 5,
    status: 'completed',
  },
];

const dummyScheduledStreams = [
  {
    id: 'sch1',
    title: 'Upcoming Laptop Showcase',
    meta: 'Electronics • Scheduled Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Scheduled+1',
    duration: 'Scheduled: 1hr',
    date: 'Feb 01, 2025',
    time: '10:00 AM',
    status: 'scheduled',
  },
  {
    id: 'sch2',
    title: 'Winter Collection Preview',
    meta: 'Fashion • Scheduled Stream',
    thumbnail: 'https://via.placeholder.com/120x68?text=Scheduled+2',
    duration: 'Scheduled: 45min',
    date: 'Feb 05, 2025',
    time: '02:00 PM',
    status: 'scheduled',
  },
  {
    id: 'live1',
    title: 'Daily Deals Live!',
    meta: 'Mixed • Live Now',
    thumbnail: 'https://via.placeholder.com/120x68?text=LIVE',
    duration: 'Live',
    date: 'Nov 18, 2025',
    time: '01:00 PM',
    status: 'live',
  },
];


const LiveStreamsDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('past'); // 'past', 'scheduled'

  // Pagination states for the current active tab's table
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Fixed at 5 for this example

  const streamsToDisplay = activeTab === 'past' ? dummyStreams : dummyScheduledStreams;
  const totalStreams = streamsToDisplay.length;
  const totalPages = Math.ceil(totalStreams / rowsPerPage);

  const indexOfLastStream = currentPage * rowsPerPage;
  const indexOfFirstStream = indexOfLastStream - rowsPerPage;
  const currentPaginatedStreams = streamsToDisplay.slice(indexOfFirstStream, indexOfLastStream);


  // Helper for stream status badges (not table status)
  const getStreamStatusBadgeClass = (status) => {
    switch (status) {
      case 'live':
        return 'bg-error-500/10 text-error-500'; // red
      case 'scheduled':
        return 'bg-info-500/10 text-info-500'; // blue
      case 'completed':
        return 'bg-success-500/10 text-success-500'; // green
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatIconClass = (type) => {
    switch (type) {
      case 'primary': return 'bg-primary-500/[0.1] text-primary-500';
      case 'success': return 'bg-success-500/[0.1] text-success-500';
      case 'warning': return 'bg-warning-500/[0.1] text-warning-500';
      case 'info': return 'bg-info-500/[0.1] text-info-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  const handleAction = (action, streamId) => {
    alert(`Action: ${action} for stream ${streamId}`);
    // Here you would implement actual logic or navigation
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Streams</h1>
          <p className="text-base text-gray-600">Manage your live streams and engage with customers in real-time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <span className="mr-2">📅</span> Schedule Stream
          </Button>
        </div>
      </div>

      {/* Hero CTA */}
      <div className="
        relative px-12 py-10 text-center text-white rounded-xl mb-8 shadow-xl
        bg-gradient-to-br from-primary-500 to-secondary-500
        overflow-hidden
      ">
        {/* Background shapes - UPDATED to use a semi-transparent primary color */}
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-primary-500/20 rounded-full z-0"></div>
        <div className="absolute bottom-[-30%] left-[-5%] w-[200px] h-[200px] bg-primary-500/20 rounded-full z-0"></div>

        <div className="relative z-10">
          <div className="text-6xl mb-4">🎥</div>
          <h2 className="text-4xl font-bold mb-3">Ready to Go Live?</h2>
          <p className="text-lg opacity-95 mb-6 max-w-2xl mx-auto">
            Start streaming now and showcase your products to customers. Connect, engage, and drive more reservations in real-time.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="bg-gradient-to-r from-success-500 to-[#059669] text-lg px-8 py-4 hover:opacity-90">
              <span className="mr-2">🔴</span> Go Live Now
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl", getStatIconClass('primary'))}>
              📊
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-success-500/10 text-success-500">
              <span>↑</span><span>{dummyStats.streamTrend}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Total Streams This Month</p>
          <p className="text-3xl font-bold text-gray-900">{dummyStats.totalStreams}</p>
        </Card>

        <Card className="p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl", getStatIconClass('success'))}>
              ⏱️
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-success-500/10 text-success-500">
              <span>↑</span><span>{dummyStats.watchHoursTrend}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Total Watch Hours</p>
          <p className="text-3xl font-bold text-gray-900">{dummyStats.totalWatchHours}</p>
        </Card>

        <Card className="p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl", getStatIconClass('warning'))}>
              👥
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-success-500/10 text-success-500">
              <span>↑</span><span>{dummyStats.viewersTrend}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Average Viewers</p>
          <p className="text-3xl font-bold text-gray-900">{dummyStats.averageViewers}</p>
        </Card>

        <Card className="p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center text-2xl", getStatIconClass('info'))}>
              📅
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-success-500/10 text-success-500">
              <span>↑</span><span>{dummyStats.reservationsTrend}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Reservations Generated</p>
          <p className="text-3xl font-bold text-gray-900">{dummyStats.reservationsGenerated}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b-2 border-gray-200 overflow-x-auto">
        <button
          className={cn(
            "py-3 px-6 bg-transparent border-none font-semibold cursor-pointer relative transition-all whitespace-nowrap",
            activeTab === 'past'
              ? 'text-primary-500 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-primary-500'
              : 'text-gray-600 hover:text-primary-500'
          )}
          onClick={() => { setActiveTab('past'); setCurrentPage(1); }}
        >
          Past Streams <Badge className="ml-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">{dummyStreams.length}</Badge>
        </button>
        <button
          className={cn(
            "py-3 px-6 bg-transparent border-none font-semibold cursor-pointer relative transition-all whitespace-nowrap",
            activeTab === 'scheduled'
              ? 'text-primary-500 after:content-[""] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[2px] after:bg-primary-500'
              : 'text-gray-600 hover:text-primary-500'
          )}
          onClick={() => { setActiveTab('scheduled'); setCurrentPage(1); }}
        >
          Scheduled Streams <Badge className="ml-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">{dummyScheduledStreams.length}</Badge>
        </button>
      </div>

      {/* Streams Table */}
      <Card className="rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'past' ? 'Past Streams' : 'Scheduled Streams'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {currentPaginatedStreams.length === 0 ? (
            <div className="text-center p-10">
              <div className="text-6xl mb-4 opacity-50">🚫</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Streams Found</h3>
              <p className="text-gray-500 mb-6">
                It looks like there are no {activeTab === 'past' ? 'past' : 'scheduled'} streams.
              </p>
              <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:opacity-90">
                <span className="mr-2">➕</span> Schedule Your First Stream
              </Button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stream</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Total Views</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Products Pinned</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPaginatedStreams.map((stream) => (
                  <tr key={stream.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img src={stream.thumbnail} alt={stream.title} className="w-[120px] h-[68px] rounded-md object-cover border border-gray-200" />
                          {stream.duration && stream.duration !== 'Live' && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                              {stream.duration}
                            </span>
                          )}
                          {stream.status === 'live' && (
                             <Badge className="absolute top-1 left-1 bg-error-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1 animate-pulse"></span> LIVE
                             </Badge>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="font-semibold text-gray-900 text-base">{stream.title}</div>
                          <div className="text-xs text-gray-500">{stream.meta}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{stream.date}</div>
                      <div className="text-xs text-gray-500">{stream.durationMinutes ? `${stream.durationMinutes} minutes` : stream.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">👁️</span>
                        <span className="font-semibold text-gray-900">{stream.totalViews}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">📦</span>
                        <span className="font-semibold text-gray-900">{stream.productsPinned}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalStreams > 0 && ( // Only show pagination if there are streams
          <div className="flex justify-between items-center p-6 border-t border-gray-200 flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              Showing <strong>{indexOfFirstStream + 1}-{Math.min(indexOfLastStream, totalStreams)}</strong> of <strong>{totalStreams}</strong> streams
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className={currentPage === i + 1 ? 'bg-primary-500 text-white' : ''}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LiveStreamsDashboard;