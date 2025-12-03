
'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider, useSession, signIn } from 'next-auth/react'; // Import Auth
import { 
  Calendar, Users, Clock, TrendingUp, MoreHorizontal, Video, Eye, ShoppingBag, Radio, Plus, 
  X, Copy, Check, Loader2, AlertCircle 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; 
import { cn } from '@/lib/utils';

// --- 1. INTERNAL COMPONENTS (Modals) ---

// Modal to ask for Stream Title
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

// Modal to show Keys after creation
const StreamSuccessModal = ({ data, onClose }) => {
  if (!data) return null;

  const CopyField = ({ label, value }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted p-2 rounded text-xs font-mono break-all border border-border">
            {value}
          </code>
          <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={handleCopy}>
            {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <Radio size={24} />
          </div>
          <h3 className="text-xl font-bold text-foreground">Stream Created!</h3>
          <p className="text-sm text-muted-foreground">
            Your event is ready on YouTube. Paste these details into OBS to go live.
          </p>
        </div>

        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
          <CopyField label="Stream Key (Private)" value={data.key} />
          <CopyField label="RTMP Server URL" value={data.url} />
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-600 flex gap-2 items-start">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>Do not share the Stream Key publicly.</span>
        </div>

        <Button onClick={onClose} className="w-full bg-primary text-primary-foreground">
          Done
        </Button>
      </div>
    </div>
  );
};

// --- 2. MAIN DASHBOARD CONTENT ---
const DashboardContent = () => {
  const { data: session } = useSession(); // This gets the YouTube Login session

  // UI State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Data State
  const [streams, setStreams] = useState([]); 
  const [isLoadingStreams, setIsLoadingStreams] = useState(false);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [successData, setSuccessData] = useState(null); // { key, url }

  // API: Fetch Streams
  const fetchStreams = async () => {
    if(!session) return;
    setIsLoadingStreams(true);
    try {
      const res = await fetch('/api/youtube/streams');
      const data = await res.json();
      if (data.streams) setStreams(data.streams);
    } catch (error) {
      console.error("Failed to fetch", error);
    } finally {
      setIsLoadingStreams(false);
    }
  };

  // Load streams when user logs in
  useEffect(() => {
    if(session) fetchStreams();
  }, [session]);

  // API: Create Stream Logic
  const handleCreateConfirm = async (title) => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/youtube/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          description: "Created via ShopLive Dashboard",
          scheduledStartTime: new Date(Date.now() + 2 * 60000).toISOString()
        })
      });

      const data = await res.json();

      if (data.success) {
        setIsCreateOpen(false); // Close the input popup

        // ---------------------------------------------------------
        // THE MAGIC REDIRECT
        // This opens the specific "Control Room" for this stream
        // ---------------------------------------------------------
        const youtubeStudioUrl = `https://studio.youtube.com/video/${data.broadcastId}/livestreaming`;
        window.open(youtubeStudioUrl, '_blank');
        
        // Refresh the list on your dashboard
        fetchStreams(); 
        
        // Optional: Show a small alert
        alert("Stream created! Redirecting you to YouTube Studio to manage the broadcast.");
        
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

  // Pagination Logic
  const streamsToDisplay = streams.length > 0 ? streams : []; 
  const totalStreams = streamsToDisplay.length;
  const currentPaginatedStreams = streamsToDisplay.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10 relative">
      
      {/* Modals are placed here */}
      <CreateStreamModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onConfirm={handleCreateConfirm}
        isLoading={isCreating}
      />
      <StreamSuccessModal 
        data={successData} 
        onClose={() => setSuccessData(null)} 
      />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Live Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {session ? `Connected as ${session.user.name}` : 'Please connect your YouTube channel to start'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!session ? (
              <Button onClick={() => signIn('google')} className="bg-red-600 hover:bg-red-700 text-white">
                <Video className="mr-2 h-4 w-4" />
                Connect YouTube
              </Button>
            ) : (
              <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                <Video className="mr-2 h-4 w-4" />
                New Stream
              </Button>
            )}
          </div>
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
                 <Button onClick={() => session ? setIsCreateOpen(true) : signIn('google')} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 border-0 font-semibold">
                   <Radio className="mr-2 h-4 w-4" />
                   Go Live Now
                 </Button>
               </div>
             </div>
           </div>
        </div>

        {/* Content Area */}
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
                  {!isLoadingStreams && currentPaginatedStreams.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                          <Video className="text-muted-foreground" />
                        </div>
                        <h3 className="text-foreground font-medium">No streams found</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {session ? "Click 'New Stream' to create one." : "Connect your channel to view streams."}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    /* Handle Real Data */
                    currentPaginatedStreams.map((stream) => (
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

// --- 3. EXPORT WITH PROVIDER ---
// We wrap the component here so we don't disturb your root layout
export default function LiveStreamsPage() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}