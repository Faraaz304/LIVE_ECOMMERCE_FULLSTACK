'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react'; 
import { Radio, Video, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Import the other two components
import CreateStreamModal from './CreateStreamModal';
import StreamCard from './StreamCard';

const DashboardContent = () => {
  const { data: session } = useSession(); 

  // UI State
  const [streams, setStreams] = useState([]); 
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Tab State: 'upcoming' (includes ready, testing, live) OR 'past' (complete)
  const [activeTab, setActiveTab] = useState('upcoming'); 

  // --- API: Fetch Streams (GET) ---
  const fetchStreams = async () => {
    if(!session) return;
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
    if(session) fetchStreams();
  }, [session]);

  // --- API: Create Stream (POST) ---
  const handleCreateConfirm = async (title) => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/youtube/streams', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
      });

      const data = await res.json();

      if (data.success) {
        setIsCreateOpen(false); 
        const youtubeStudioUrl = `https://studio.youtube.com/video/${data.broadcastId}/livestreaming`;
        window.open(youtubeStudioUrl, '_blank');
        fetchStreams(); // Refresh list
      } else {
        alert("Error creating stream: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Creation error", error);
      alert("Failed to connect to server");
    } finally {
      setIsCreating(false);
    }
  };

  // --- Filter Logic ---
  const filteredStreams = streams.filter(stream => {
    if (activeTab === 'upcoming') {
      // Show Ready, Testing, and Live streams here
      return ['ready', 'testing', 'live'].includes(stream.status);
    } else {
      // Show Complete streams here
      return stream.status === 'complete';
    }
  });

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10 relative">
      <CreateStreamModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onConfirm={handleCreateConfirm}
        isLoading={isCreating}
      />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Live Dashboard</h1>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-foreground text-background shadow-xl">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/30 blur-3xl rounded-full pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-500/30 blur-3xl rounded-full pointer-events-none"></div>
           <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="space-y-4 max-w-2xl">
               <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary-foreground/90 backdrop-blur-sm">
                 <Radio className="mr-1.5 h-3 w-3 text-red-500 animate-pulse" />
                 Ready to broadcast
               </div>
               <h2 className="text-3xl font-bold tracking-tight text-background">Engage your audience in real-time</h2>
               <div className="pt-2">
                 <Button 
                    onClick={() => session ? setIsCreateOpen(true) : signIn('google')} 
                    size="lg" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-semibold"
                 >
                   <Radio className="mr-2 h-4 w-4" />
                   Go Live Now
                 </Button>
               </div>
             </div>
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
             Refresh Data
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
                   ? "You don't have any scheduled or live broadcasts right now." 
                   : "You haven't completed any broadcasts yet."}
               </p>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {filteredStreams.map((stream) => (
                 <StreamCard key={stream.id} stream={stream} />
               ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default DashboardContent;