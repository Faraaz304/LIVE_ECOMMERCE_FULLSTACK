// 'use client';

// import React from 'react';
// import { useRouter } from 'next/navigation';
// import { 
//   Calendar, Clock, Eye, ThumbsUp, 
//   ImageOff, ExternalLink, Play, Bell 
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { cn } from '@/lib/utils';

// const StreamCard = ({ stream, mode = 'seller' }) => {
//   const router = useRouter();

//   const isLive = stream.status === 'live';
//   const isComplete = stream.status === 'complete';
//   const isUpcoming = stream.status === 'ready' || stream.status === 'testing' || stream.status === 'upcoming';
  
//   // Format Date & Time
//   const dateObj = new Date(stream.startTime);
//   const dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
//   const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

//   // --- HANDLE CARD CLICK ---
//   const handleCardClick = () => {
//     // UPDATED: Only redirect if it is the Seller
//     if (mode === 'seller') {
//       router.push(`/seller/streams/${stream.id}`);
//     }
//     // If mode is 'viewer', do nothing.
//   };

//   // --- HANDLE ACTION BUTTON ---
//   const handleActionClick = (e) => {
//     e.stopPropagation(); // Prevent bubbling

//     const watchLink = stream.youtubeLink || `https://www.youtube.com/watch?v=${stream.id}`;
//     const studioLink = `https://studio.youtube.com/video/${stream.id}/livestreaming`;

//     if (mode === 'viewer') {
//       // VIEWERS: Always go to YouTube
//       window.open(watchLink, '_blank');
//     } else {
//       // SELLERS: Go to Studio or Watch
//       if (isComplete) {
//         window.open(watchLink, '_blank');
//       } else {
//         window.open(studioLink, '_blank');
//       }
//     }
//   };

//   // --- DETERMINE ICON ---
//   let ActionIcon = ExternalLink;
//   let actionTitle = "Manage";

//   if (mode === 'viewer') {
//     if (isUpcoming) { ActionIcon = Bell; actionTitle = "Set Reminder on YouTube"; }
//     else { ActionIcon = Play; actionTitle = "Watch on YouTube"; }
//   } else {
//     if (isComplete) { ActionIcon = Play; actionTitle = "Watch Replay"; }
//     else { ActionIcon = ExternalLink; actionTitle = "Manage in Studio"; }
//   }

//   return (
//     <Card
//       className={cn(
//         "group overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 flex flex-col h-full",
//         // UPDATED: Only show pointer and hover effects for Seller
//         mode === 'seller' 
//           ? "cursor-pointer hover:shadow-lg hover:border-primary/50" 
//           : "cursor-default" 
//       )}
//       onClick={handleCardClick}
//     >
//       {/* Image Section */}
//       <div className="relative aspect-video bg-muted overflow-hidden">
//         {stream.thumbnail ? (
//           <img
//             src={stream.thumbnail}
//             alt={stream.title}
//             className={cn(
//               "w-full h-full object-cover transition-transform duration-500",
//               // Only zoom on hover if seller
//               mode === 'seller' && "group-hover:scale-110"
//             )}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
//             <ImageOff className="w-12 h-12" />
//           </div>
//         )}

//         {/* Status Badge */}
//         <div className="absolute top-2 right-2 flex flex-col gap-1">
//           <Badge className={cn(
//             "backdrop-blur-md border-none shadow-sm",
//             isLive ? "bg-red-600 text-white hover:bg-red-700 animate-pulse" :
//             isComplete ? "bg-black/60 text-white hover:bg-black/70" :
//             "bg-blue-600/90 text-white hover:bg-blue-600"
//           )}>
//             {isLive ? "LIVE NOW" : stream.status.toUpperCase()}
//           </Badge>
//         </div>

//         {/* Duration Badge */}
//         {isComplete && stream.duration && (
//           <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
//             {stream.duration}
//           </div>
//         )}
//       </div>

//       <CardContent className="p-4 flex flex-col flex-grow">
//         {/* Title & Date */}
//         <div className="mb-3 space-y-1">
//           <h3 className={cn(
//             "font-semibold text-foreground line-clamp-2 leading-tight transition-colors",
//             mode === 'seller' && "group-hover:text-primary"
//           )}>
//             {stream.title}
//           </h3>
//           <div className="flex items-center gap-2 text-xs text-muted-foreground">
//             <span className="flex items-center gap-1"><Calendar size={12}/> {dateStr}</span>
//             <span className="flex items-center gap-1"><Clock size={12}/> {timeStr}</span>
//           </div>
//         </div>

//         {/* Analytics Footer */}
//         <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
//           <div className="flex items-center gap-3">
//             <span className="flex items-center gap-1" title="Views">
//               <Eye size={14} className="text-primary/70" /> {parseInt(stream.analytics?.views || 0).toLocaleString()}
//             </span>
//             <span className="flex items-center gap-1" title="Likes">
//               <ThumbsUp size={14} className="text-primary/70" /> {parseInt(stream.analytics?.likes || 0).toLocaleString()}
//             </span>
//           </div>

//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-6 w-6 hover:text-foreground cursor-pointer" // Button is always clickable
//             onClick={handleActionClick}
//             title={actionTitle}
//           >
//             <ActionIcon size={14} />
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default StreamCard;

//    THIS PAGE WORKS IT DISPLAY THE DATA FETCHTING FOR THE API CORRECT 
//    DONT REMOVE THE OLDER COMMENTED VERSION OF THE CODE 

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, Clock, Eye, ThumbsUp, 
  ImageOff, ExternalLink, Play, Bell, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// 1. Import the hook
import { useStream } from '@/hooks/useStream';

const StreamCard = ({ stream, mode = 'seller' }) => {
  const router = useRouter();
  
  // 2. Destructure the specific fetch function from the hook
  const { getStreamById } = useStream();

  // 3. Local state for analytics (Views/Likes)
  // We initialize with prop data if available to prevent flashing "0"
  const [analytics, setAnalytics] = useState({
    viewCount: stream.analytics?.viewCount || stream.analytics?.views || 0,
    likeCount: stream.analytics?.likeCount || stream.analytics?.likes || 0
  });
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 4. Fetch fresh stats on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchLatestStats = async () => {
      // Don't fetch if no ID
      if (!stream.id) return;

      const data = await getStreamById(stream.id);
      
      if (isMounted && data && data.analytics) {
        setAnalytics({
          viewCount: data.analytics.viewCount,
          likeCount: data.analytics.likeCount
        });
        setIsLoadingStats(false);
      }
    };

    fetchLatestStats();

    return () => { isMounted = false; };
  }, [stream.id, getStreamById]);

  // --- Status Logic ---
  const status = stream.status?.toLowerCase() || 'upcoming';
  const isLive = status === 'live';
  const isComplete = status === 'complete' || status === 'completed';
  const isUpcoming = ['ready', 'testing', 'upcoming'].includes(status);
  
  // --- Date Logic ---
  let dateStr = "N/A";
  let timeStr = "";
  if (stream.date || stream.startTime || stream.publishedAt) {
    const dateObj = new Date(stream.date || stream.startTime || stream.publishedAt);
    if (!isNaN(dateObj)) {
        dateStr = dateObj.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
        timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
  }

  // --- HANDLERS ---
  const handleCardClick = () => {
    if (mode === 'seller') {
      router.push(`/seller/streams/${stream.id}`);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); 
    const watchLink = stream.videoLink || `https://www.youtube.com/watch?v=${stream.id}`;
    const studioLink = `https://studio.youtube.com/video/${stream.id}/livestreaming`;

    if (mode === 'viewer') {
      window.open(watchLink, '_blank');
    } else {
      if (isComplete) window.open(watchLink, '_blank');
      else window.open(studioLink, '_blank');
    }
  };

  // --- ICON SELECTION ---
  let ActionIcon = ExternalLink;
  let actionTitle = "Manage";
  if (mode === 'viewer') {
    if (isUpcoming) { ActionIcon = Bell; actionTitle = "Set Reminder"; }
    else { ActionIcon = Play; actionTitle = "Watch"; }
  } else {
    if (isComplete) { ActionIcon = Play; actionTitle = "Watch Replay"; }
    else { ActionIcon = ExternalLink; actionTitle = "Manage in Studio"; }
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border bg-card text-card-foreground transition-all duration-300 flex flex-col h-full",
        mode === 'seller' 
          ? "cursor-pointer hover:shadow-lg hover:border-primary/50" 
          : "cursor-default" 
      )}
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {stream.thumbnail ? (
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              mode === 'seller' && "group-hover:scale-110"
            )}
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
            {isLive ? "LIVE NOW" : status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Title & Date */}
        <div className="mb-3 space-y-1">
          <h3 className={cn(
            "font-semibold text-foreground line-clamp-2 leading-tight transition-colors",
            mode === 'seller' && "group-hover:text-primary"
          )}>
            {stream.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar size={12}/> {dateStr}</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {timeStr}</span>
          </div>
        </div>

        {/* 5. UPDATED ANALYTICS FOOTER */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Views">
              <Eye size={14} className="text-primary/70" /> 
              {isLoadingStats && parseInt(analytics.viewCount) === 0 ? (
                 <span className="animate-pulse">...</span>
              ) : (
                 parseInt(analytics.viewCount).toLocaleString()
              )}
            </span>
            <span className="flex items-center gap-1" title="Likes">
              <ThumbsUp size={14} className="text-primary/70" /> 
              {isLoadingStats && parseInt(analytics.likeCount) === 0 ? (
                 <span className="animate-pulse">...</span>
              ) : (
                 parseInt(analytics.likeCount).toLocaleString()
              )}
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 hover:text-foreground cursor-pointer"
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