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
      // Calls GET method on /api/youtube/streams
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
      // Calls POST method on /api/youtube/streams
      const res = await fetch('/api/youtube/streams', { 
        method: 'POST', // <--- This distinguishes it from the GET request
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
      });

      const data = await res.json();

      if (data.success) {
        setIsCreateOpen(false); 
        
        // Open YouTube Studio directly to the new broadcast
        const youtubeStudioUrl = `https://studio.youtube.com/video/${data.broadcastId}/livestreaming`;
        window.open(youtubeStudioUrl, '_blank');
        
        // Refresh the list immediately
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
            <h1 className="text-3xl font-bold text-foreground">Live Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {session ? `Connected as ${session.user.name}` : 'Connect your channel to start'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!session ? (
              <Button onClick={() => signIn('google')} className="bg-red-600 hover:bg-red-700 text-white">
                <Video className="mr-2 h-4 w-4" /> Connect YouTube
              </Button>
            ) : (
              <Button onClick={() => setIsCreateOpen(true)} className="bg-primary text-primary-foreground">
                <Video className="mr-2 h-4 w-4" /> New Stream
              </Button>
            )}
          </div>
        </div>

        {/* Stream List */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold">Your YouTube Streams</h3>
             <Button variant="ghost" size="sm" onClick={fetchStreams}>
                {isLoadingStreams ? <Loader2 className="animate-spin h-4 w-4"/> : "Refresh List"}
             </Button>
          </div>

          <Card className="border border-border shadow-sm overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Details</th>
                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingStreams && (
                    <tr><td colSpan={2} className="p-8 text-center text-muted-foreground">Loading Data...</td></tr>
                  )}

                  {!isLoadingStreams && streams.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-6 py-12 text-center text-muted-foreground">
                        No streams found. Click "New Stream" to start.
                      </td>
                    </tr>
                  ) : (
                    streams.map((stream) => (
                      <tr key={stream.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-28 rounded-lg overflow-hidden bg-muted relative">
                              {stream.thumbnail && <img src={stream.thumbnail} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground line-clamp-1">{stream.title}</h4>
                              <span className="text-xs text-muted-foreground">ID: {stream.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={cn(
                            "text-[10px]", 
                            stream.status === 'live' ? "border-red-500 text-red-500" : "text-muted-foreground"
                          )}>
                            {stream.status ? stream.status.toUpperCase() : 'UNKNOWN'}
                          </Badge>
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