

import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
// import { handler } from "../../auth/[...nextauth]/route"; // Import auth options
import { authOptions } from "@/lib/auth";

// const handler = async (req, res) => {
//   return await getServerSession(req, res, authOptions);
// };

export async function GET() {
  const session = await getServerSession(handler);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.GOOGLE_CLIENT_KEY, // Not needed here, we use oauth below
  });

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });

  try {
    // 1. Fetch Live Broadcasts (Upcoming, Live, and Completed)
    // Note: 'completed' broadcasts only stay in the API for a short time unless they are saved as videos.
    // Usually, you might need to query the 'search' endpoint for past videos.
    const response = await youtube.liveBroadcasts.list({
      auth: oauth2Client,
      part: ["snippet", "status", "contentDetails"],
      broadcastStatus: "all", // Fetch active, upcoming, and completed
      maxResults: 20,
    });

    const streams = response.data.items.map((item) => ({
      id: item.id,
      title: item.snippet.title,
      meta: "YouTube Live", // Or derive from description/tags
      thumbnail: item.snippet.thumbnails.medium.url,
      // Calculate duration or use placeholders
      duration: item.status.lifeCycleStatus === 'live' ? 'Live' : 'Recorded',
      date: new Date(item.snippet.scheduledStartTime || item.snippet.actualStartTime).toLocaleDateString(),
      status: item.status.lifeCycleStatus, // 'ready', 'testing', 'live', 'complete'
      totalViews: 0, // Need a separate call to 'videos.list' to get view counts for completed streams
    }));

    return NextResponse.json({ streams });
  } catch (error) {
    console.error("YouTube API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}