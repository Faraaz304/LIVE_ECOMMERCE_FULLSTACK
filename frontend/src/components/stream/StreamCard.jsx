'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, Eye, ThumbsUp, 
  ImageOff, ExternalLink, Play, Bell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StreamCard = ({ stream, mode = 'seller' }) => { // <--- Added mode prop
  const router = useRouter();

  const isLive = stream.status === 'live';
  const isComplete = stream.status === 'complete';
  const isUpcoming = stream.status === 'ready' || stream.status === 'testing' || stream.status === 'upcoming';

  // Format Date & Time
  const dateObj = new Date(stream.startTime);
  const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Handle Card Click: Redirect to Internal Detail Page
  const handleCardClick = () => {
    // Both sellers and viewers can go to the detail page
    router.push(`/stream/${stream.id}`);
  };

  // --- HANDLE ACTION BUTTON ---
  const handleActionClick = (e) => {
    e.stopPropagation(); 

    const watchLink = stream.youtubeLink || `https://www.youtube.com/watch?v=${stream.id}`;
    const studioLink = `https://studio.youtube.com/video/${stream.id}/livestreaming`;

    if (mode === 'viewer') {
      // VIEWERS: Always go to YouTube (to Watch or Set Reminder)
      window.open(watchLink, '_blank');
    } else {
      // SELLERS: Go to Studio if not complete, otherwise Watch
      if (isComplete) {
        window.open(watchLink, '_blank');
      } else {
        window.open(studioLink, '_blank');
      }
    }
  };

  // --- DETERMINE ICON ---
  let ActionIcon = ExternalLink;
  let actionTitle = "Manage";

  if (mode === 'viewer') {
    if (isUpcoming) { ActionIcon = Bell; actionTitle = "Set Reminder on YouTube"; }
    else { ActionIcon = Play; actionTitle = "Watch on YouTube"; }
  } else {
    // Seller Mode
    if (isComplete) { ActionIcon = Play; actionTitle = "Watch Replay"; }
    else { ActionIcon = ExternalLink; actionTitle = "Manage in Studio"; }
  }

  return (
    <Card
      className="group overflow-hidden border-border bg-card text-card-foreground hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {stream.thumbnail ? (
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <ImageOff className="w-12 h-12" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <Badge className={cn(
            "backdrop-blur-md border-none shadow-sm",
            isLive ? "bg-red-600 text-white hover:bg-red-700 animate-pulse" :
            isComplete ? "bg-black/60 text-white hover:bg-black/70" :
            "bg-blue-600/90 text-white hover:bg-blue-600"
          )}>
            {isLive ? "LIVE NOW" : stream.status.toUpperCase()}
          </Badge>
        </div>

        {/* Duration Badge (Only for completed) */}
        {isComplete && stream.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
            {stream.duration}
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Title & Date */}
        <div className="mb-3 space-y-1">
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {stream.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={12}/> {dateStr}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {timeStr}</span>
          </div>
        </div>

        {/* Analytics Footer */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Views">
              <Eye size={14} className="text-primary/70" /> {parseInt(stream.analytics?.views || 0).toLocaleString()}
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <ThumbsUp size={14} className="text-primary/70" /> {parseInt(stream.analytics?.likes || 0).toLocaleString()}
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:text-foreground"
            onClick={handleActionClick}
            title={actionTitle}
          >
            <ActionIcon size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreamCard;