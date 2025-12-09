'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';
import { 
  ArrowLeft, Clock, Eye, ThumbsUp, 
  MessageCircle, Users, ExternalLink, Loader2, Share2 
} from 'lucide-react';

// Import your custom hook
import { useStream } from '@/hooks/useStream'; // Adjust path if necessary

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StreamDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  // --- USE HOOK HERE ---
  const { 
    getStreamById, 
    currentStream: stream, // Alias 'currentStream' to 'stream' to keep JSX same
    loading, 
    error 
  } = useStream();

  // --- Fetch Data using Hook ---
  useEffect(() => {
    if (id) {
      getStreamById(id);
    }
  }, [id, getStreamById]);

  // --- Helper: Date Formatter ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString('en-IN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // --- Helper: Number Formatter ---
  const formatNum = (num) => {
    return parseInt(num).toLocaleString('en-IN');
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-muted/30">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading Stream Analytics...</p>
      </div>
    );
  }

  // 2. Error or Not Found State
  if (error || !stream) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-muted/30 gap-2">
        <p className="text-destructive text-lg font-medium">Unable to load stream</p>
        <p className="text-muted-foreground text-sm">{error || "Stream not found"}</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const isLive = stream.status === 'live';

  return (
    <div className="min-h-screen bg-muted/30 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header --- */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
             <h1 className="text-2xl font-bold line-clamp-1">{stream.title}</h1>
             <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">{stream.channelTitle}</span>
                <span>•</span>
                <span>{formatDate(stream.actualStartTime || stream.scheduledStartTime)}</span>
             </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(`https://studio.youtube.com/video/${stream.id}/analytics/tab-overview`, '_blank')}>
              Open Studio <ExternalLink className="ml-2 h-4 w-4"/>
            </Button>
            <Button onClick={() => window.open(stream.videoLink, '_blank')}>
              Watch on YouTube <Share2 className="ml-2 h-4 w-4"/>
            </Button>
          </div>
        </div>

        {/* --- Top Section: Player & Meta --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Video Player */}
          <div className="lg:col-span-2 space-y-4">
             <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-border bg-black">
               <iframe 
                 width="100%" 
                 height="100%" 
                 src={`https://www.youtube.com/embed/${stream.id}`} 
                 title={stream.title}
                 frameBorder="0" 
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                 allowFullScreen
               ></iframe>
             </div>
             
             {/* Status Badge Strip */}
             <div className="flex items-center gap-3">
               <Badge className={cn(
                 "px-3 py-1 text-sm",
                 isLive ? "bg-red-600 animate-pulse" : "bg-secondary text-secondary-foreground"
               )}>
                 {stream.status ? stream.status.toUpperCase() : "UNKNOWN"}
               </Badge>
               {stream.actualStartTime && (
                 <span className="text-sm text-muted-foreground flex items-center gap-1">
                   <Clock size={14}/> Started: {formatDate(stream.actualStartTime)}
                 </span>
               )}
             </div>
          </div>

          {/* Right: Analytics Cards (Stacked) */}
          <div className="space-y-4">
            
            {/* 1. View Count */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNum(stream.analytics?.viewCount || 0)}</div>
                <p className="text-xs text-muted-foreground">Lifetime views</p>
              </CardContent>
            </Card>

            {/* 2. Likes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatNum(stream.analytics?.likeCount || 0)}</div>
                <p className="text-xs text-muted-foreground">User engagement</p>
              </CardContent>
            </Card>

            {/* 3. Comments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNum(stream.analytics?.commentCount || 0)}</div>
                <p className="text-xs text-muted-foreground">Total comments</p>
              </CardContent>
            </Card>

            {/* 4. Concurrent Viewers (Only if Live) */}
            {isLive && (
              <Card className="border-red-500/50 bg-red-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">Current Viewers</CardTitle>
                  <Users className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{formatNum(stream.analytics?.concurrentViewers || 0)}</div>
                  <p className="text-xs text-red-600/80">Watching now</p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>

        {/* --- Bottom: Description --- */}
        <Card>
           <CardHeader>
             <CardTitle>Description</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
               {stream.description || "No description provided."}
             </p>
           </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default function Page() {
  return (
    <SessionProvider>
      <StreamDetailPage />
    </SessionProvider>
  );
}