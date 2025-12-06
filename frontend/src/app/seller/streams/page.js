'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider, useSession, signIn } from 'next-auth/react'; 
import { 
  Radio, Video, X, Copy, Check, Loader2, AlertCircle 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- 1. MODAL COMPONENT ---
const CreateStreamModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [title, setTitle] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-foreground">Create New Stream</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20}/></button>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Stream Title</label>
          <input 
            type="text" 
            placeholder="e.g., Summer Sale Launch"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">This will create a scheduled event on your YouTube channel.</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={() => onConfirm(title)} disabled={!title || isLoading} className="bg-primary text-primary-foreground">
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating...</> : 'Create Stream'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- 2. MAIN DASHBOARD CONTENT ---
const DashboardContent = () => {
  const { data: session } = useSession(); 

  // UI State
  const [streams, setStreams] = useState([]); 
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
        fetchStreams(); 
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
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Live Dashboard</h1>
            
          </div>
          
        </div>

        {/* Hero Section (The "Good" UI) */}
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

        {/* Stream List Table */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Your YouTube Streams</h3>
             <Button variant="ghost" size="sm" onClick={fetchStreams}>
                {isLoadingStreams ? <Loader2 className="animate-spin h-4 w-4"/> : "Refresh List"}
             </Button>
          </div>

          <Card className="border border-border shadow-sm overflow-hidden bg-card text-card-foreground">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stream Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status & Time</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Handle Loading State */}
                  {isLoadingStreams && (
                    <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Loading YouTube Data...</td></tr>
                  )}

                  {/* Handle Empty State */}
                  {!isLoadingStreams && streams.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                          <Video className="text-muted-foreground" />
                        </div>
                        <h3 className="text-foreground font-medium">No streams found</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {session ? "Click 'Go Live Now' to create one." : "Connect your channel to view streams."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    /* Handle Real Data */
                    streams.map((stream) => (
                      <tr key={stream.id} className="group hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-sm bg-muted">
                              {stream.thumbnail ? (
                                <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground line-clamp-1">{stream.title}</h4>
                              <span className="text-xs text-muted-foreground">ID: {stream.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{new Date(stream.date).toLocaleDateString()}</span>
                            <Badge variant="outline" className={cn(
                              "w-fit mt-1 text-[10px]", 
                              stream.status === 'live' ? "border-red-500 text-red-500" : "text-muted-foreground"
                            )}>
                              {stream.status ? stream.status.toUpperCase() : 'UNKNOWN'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm">Manage</Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function LiveStreamsPage() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}

