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
      part: "snippet,status", 
      mine: true,
      maxResults: 20,
    });

    const items = response.data.items || [];

    // Format for Frontend
    const streams = items.map((item) => ({
      id: item.id, 
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
      status: item.status.lifeCycleStatus, 
      date: item.snippet.scheduledStartTime || item.snippet.actualStartTime || item.snippet.publishedAt,
    }));

    return NextResponse.json({ streams });

  } catch (error) {
    console.error("GET Error Details:", error.response?.data || error.message);
    return NextResponse.json({ streams: [], error: error.message }, { status: 500 });
  }
}


// ==================================================================
// 2. POST METHOD - Create Broadcast + Stream Key + Bind + SAVE LOCATION
// ==================================================================
export async function POST(req) {
  try {
    const youtube = getYoutubeClient();
    
    // Parse Input
    const body = await req.json();
    const streamTitle = body.title || "Untitled NextJS Stream";
    const streamDescription = body.description || "Created via API";
    const userLocation = body.location; // <--- { lat: 19.xxx, lng: 72.xxx }

    console.log(`Creating Stream: "${streamTitle}"...`);
    if(userLocation) console.log(`📍 Location detected: ${userLocation.lat}, ${userLocation.lng}`);

    // --- Step A: Create Broadcast (YouTube) ---
    const broadcastResponse = await youtube.liveBroadcasts.insert({
      part: "snippet,status,contentDetails",
      resource: {
        snippet: {
          title: streamTitle,
          description: streamDescription,
          scheduledStartTime: new Date().toISOString(),
        },
        status: {
          privacyStatus: "unlisted", 
          selfDeclaredMadeForKids: false,
        },
        contentDetails: {
          enableAutoStart: true,
          enableAutoStop: true,
        },
      },
    });

    const broadcastId = broadcastResponse.data.id;
    
    // ------------------------------------------------------------------
    // TODO: SEND TO YOUR SPRINGBOOT / MYSQL DB HERE
    // ------------------------------------------------------------------
    // You now have the 'broadcastId' and the 'userLocation'.
    // You should make a call to your Spring Boot API here to save them.
    
    /* 
    await fetch('http://localhost:8080/api/streams/save', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         youtubeId: broadcastId,
         title: streamTitle,
         latitude: userLocation.lat,
         longitude: userLocation.lng
       })
    });
    */
    // ------------------------------------------------------------------

    // --- Step B: Create Stream Key ---
    const streamResponse = await youtube.liveStreams.insert({
      part: "snippet,cdn",
      resource: {
        snippet: { title: `${streamTitle} - Key` },
        cdn: { format: "1080p", ingestionType: "rtmp", resolution: "1080p", frameRate: "30fps" },
      },
    });

    const streamId = streamResponse.data.id;

    // --- Step C: Bind Them Together ---
    await youtube.liveBroadcasts.bind({
      part: "id,contentDetails",
      id: broadcastId,
      streamId: streamId,
    });

    return NextResponse.json({
      success: true,
      broadcastId: broadcastId,
      youtubeLink: `https://youtu.be/${broadcastId}`,
      streamSettings: {
        serverUrl: streamResponse.data.cdn.ingestionInfo.ingestionAddress,
        streamKey: streamResponse.data.cdn.ingestionInfo.streamName,
      },
    });

  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}