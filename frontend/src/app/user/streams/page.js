'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Video, Loader2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import StreamCard from '@/components/stream/StreamCard'; // Adjust path if needed

export default function UserStreamsPage() {
  // UI State
  const [streams, setStreams] = useState([]); 
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming'); 

  // --- API: Fetch Streams (Same as Seller) ---
  const fetchStreams = async () => {
    setIsLoadingStreams(true);
    try {
      const res = await fetch('/api/youtube/streams'); 
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (data.streams) {
        setStreams(data.streams);
      }
    } catch (error) {
      console.error("Failed to fetch streams:", error);
    } finally {
      setIsLoadingStreams(false);
    }
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  // --- Filter Logic ---
  const filteredStreams = streams.filter(stream => {
    if (activeTab === 'upcoming') {
      return ['ready', 'testing', 'live'].includes(stream.status);
    } else {
      return stream.status === 'complete';
    }
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Live Events</h1>
        </div>

        {/* Hero Section (Modified for Viewer) */}
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background shadow-xl">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 blur-3xl rounded-full pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/30 blur-3xl rounded-full pointer-events-none"></div>
           <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-2xl">
               <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm">
                 <Radio className="mr-1.5 h-3 w-3 text-red-500 animate-pulse" />
                 Live Shopping
               </div>
               <h2 className="text-3xl font-bold tracking-tight text-background">Join our live streams for exclusive deals</h2>
               <p className="text-primary-foreground/80 max-w-lg">
                 Watch real-time product demos, ask questions, and grab limited-time offers directly during the broadcast.
               </p>
             </div>
             {/* Removed "Go Live" Button */}
           </div>
        </div>

        {/* Content Controls: Tabs & Refresh */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex p-1 bg-muted rounded-lg border border-border">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === 'upcoming' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Upcoming & Live
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                activeTab === 'past' 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Past Broadcasts
            </button>
          </div>

          <Button variant="ghost" size="sm" onClick={fetchStreams}>
             {isLoadingStreams ? <Loader2 className="animate-spin h-4 w-4 mr-2"/> : <Radio className="h-4 w-4 mr-2"/>}
             Refresh
          </Button>
        </div>

        {/* Stream Grid (Cards) */}
        <div>
           {isLoadingStreams ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-64 rounded-xl bg-muted animate-pulse border border-border"></div>
                ))}
             </div>
           ) : filteredStreams.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-muted/10">
               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                 <Video className="text-muted-foreground h-8 w-8" />
               </div>
               <h3 className="text-xl font-semibold text-foreground">No {activeTab} streams found</h3>
               <p className="text-muted-foreground max-w-sm mt-2">
                 {activeTab === 'upcoming' 
                   ? "Stay tuned! New live events will be scheduled soon." 
                   : "There are no past broadcasts to show yet."}
               </p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredStreams.map((stream) => (
                 <StreamCard 
                    key={stream.id} 
                    stream={stream} 
                    mode="viewer" // <--- Important: Sets the card to Viewer Mode
                 />
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}