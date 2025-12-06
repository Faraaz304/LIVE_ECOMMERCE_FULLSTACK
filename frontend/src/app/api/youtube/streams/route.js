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


// ==================================================================
// 1. GET METHOD - List all streams (Active, Upcoming, Completed)
// ==================================================================
export async function GET() {
  try {
    const youtube = getYoutubeClient();

    // Fetch everything associated with the channel (mine: true)
    const response = await youtube.liveBroadcasts.list({
      part: "snippet,status", // <--- Removed "id" (it comes back automatically)
      // broadcastStatus: "all",
      // broadcastType: "all", // <--- REMOVED THIS (Causes the 500 error)
      mine: true,
      maxResults: 20,
    });

    const items = response.data.items || [];

    // Format for Frontend
    const streams = items.map((item) => ({
      id: item.id, // <--- This will still work!
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
      status: item.status.lifeCycleStatus, 
      date: item.snippet.scheduledStartTime || item.snippet.actualStartTime || item.snippet.publishedAt,
    }));

    return NextResponse.json({ streams });

  } catch (error) {
    // Log the FULL error object to see the real cause in your terminal
    console.error("GET Error Details:", error.response?.data || error.message);
    return NextResponse.json({ streams: [], error: error.message }, { status: 500 });
  }
}

// ==================================================================
// 2. POST METHOD - Create Broadcast + Stream Key + Bind
// ==================================================================
export async function POST(req) {
  try {
    const youtube = getYoutubeClient();
    
    // Parse Input
    const body = await req.json();
    const streamTitle = body.title || "Untitled NextJS Stream";

    console.log(`Creating Stream: "${streamTitle}"...`);

    // --- Step A: Create Broadcast ---
    const broadcastResponse = await youtube.liveBroadcasts.insert({
      part: "snippet,status,contentDetails",
      resource: {
        snippet: {
          title: streamTitle,
          description: "Created via API",
          scheduledStartTime: new Date().toISOString(),
        },
        status: {
          privacyStatus: "unlisted", // Change to 'public' if needed
          selfDeclaredMadeForKids: false,
        },
        contentDetails: {
          enableAutoStart: true,
          enableAutoStop: true,
        },
      },
    });

    const broadcastId = broadcastResponse.data.id;
    console.log("✅ Broadcast ID:", broadcastId);

    // --- Step B: Create Stream Key ---
    const streamResponse = await youtube.liveStreams.insert({
      part: "snippet,cdn",
      resource: {
        snippet: {
          title: `${streamTitle} - Key`,
        },
        cdn: {
          format: "1080p",
          ingestionType: "rtmp",
          resolution: "1080p", 
          frameRate: "30fps"
        },
      },
    });

    const streamId = streamResponse.data.id;
    console.log("✅ Stream ID:", streamId);

    // --- Step C: Bind Them Together ---
    await youtube.liveBroadcasts.bind({
      part: "id,contentDetails",
      id: broadcastId,
      streamId: streamId,
    });

    // --- Success Response ---
    const streamName = streamResponse.data.cdn.ingestionInfo.streamName;
    const ingestionAddress = streamResponse.data.cdn.ingestionInfo.ingestionAddress;

    return NextResponse.json({
      success: true,
      broadcastId: broadcastId,
      youtubeLink: `https://youtu.be/${broadcastId}`,
      streamSettings: {
        serverUrl: ingestionAddress,
        streamKey: streamName,
      },
    });

  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json(
      { 
        error: error.message, 
        details: error.response?.data?.error?.errors || error.response?.data 
      }, 
      { status: 500 }
    );
  }
}

