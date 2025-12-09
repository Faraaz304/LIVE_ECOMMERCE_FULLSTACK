import { google } from "googleapis";
import { NextResponse } from "next/server";

// --- HELPER: Setup Auth Client ---
const getYoutubeClient = () => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error("Missing Google API Credentials in .env");
  }

  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  return google.youtube({ version: "v3", auth: oauth2Client });
};

export async function GET(req, { params }) {
  // ---------------------------------------------------------
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!id) {
    return NextResponse.json({ error: "Missing Stream ID" }, { status: 400 });
  }

  try {
    const youtube = getYoutubeClient();

    // Fetch comprehensive details for this specific video
    const response = await youtube.videos.list({
      part: "snippet,statistics,liveStreamingDetails,contentDetails,status",
      id: id,
    });

    const item = response.data.items?.[0];

    if (!item) {
      return NextResponse.json({ error: "Stream not found" }, { status: 404 });
    }

    // --- Format Data ---
    const snippet = item.snippet;
    const stats = item.statistics || {};
    const live = item.liveStreamingDetails || {};
    
    // Determine status
    let streamStatus = 'completed';
    if (snippet.liveBroadcastContent === 'live') streamStatus = 'live';
    if (snippet.liveBroadcastContent === 'upcoming') streamStatus = 'upcoming';

    const streamData = {
      id: item.id,
      title: snippet.title,
      description: snippet.description,
      channelTitle: snippet.channelTitle,
      publishedAt: snippet.publishedAt,
      thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url,
      
      status: streamStatus,
      
      // Timing
      scheduledStartTime: live.scheduledStartTime || null,
      actualStartTime: live.actualStartTime || null,
      actualEndTime: live.actualEndTime || null,
      
      // Analytics
      analytics: {
        viewCount: stats.viewCount || "0",
        likeCount: stats.likeCount || "0",
        commentCount: stats.commentCount || "0",
        concurrentViewers: live.concurrentViewers || "0", 
      },

      videoLink: `https://www.youtube.com/watch?v=${item.id}`,
      embedHtml: item.player?.embedHtml || null 
    };

    return NextResponse.json({ success: true, stream: streamData });

  } catch (error) {
    console.error("GET Stream Detail Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}