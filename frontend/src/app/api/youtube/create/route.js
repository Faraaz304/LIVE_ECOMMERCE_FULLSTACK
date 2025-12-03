import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, scheduledStartTime } = await req.json();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: session.accessToken });
  const youtube = google.youtube({ version: "v3", auth: oauth2Client });

  try {
    // Step 1: Create the Broadcast (The Event)
    const broadcastRes = await youtube.liveBroadcasts.insert({
      part: ["snippet", "status", "contentDetails"],
      requestBody: {
        snippet: {
          title: title,
          description: description,
          scheduledStartTime: scheduledStartTime, // ISO 8601 format
        },
        status: {
          privacyStatus: "public", // or 'unlisted'
          selfDeclaredMadeForKids: false,
        },
        contentDetails: {
            enableAutoStart: true, // Easier for beginners
            enableAutoStop: true,
        }
      },
    });

    const broadcastId = broadcastRes.data.id;

    // Step 2: Create the Stream (The Technical Input)
    const streamRes = await youtube.liveStreams.insert({
      part: ["snippet", "cdn"],
      requestBody: {
        snippet: {
          title: `${title} - Stream Key`,
        },
        cdn: {
          frameRate: "60fps",
          ingestionType: "rtmp",
          resolution: "1080p",
        },
      },
    });

    const streamId = streamRes.data.id;

    // Step 3: Bind Broadcast to Stream
    await youtube.liveBroadcasts.bind({
      id: broadcastId,
      streamId: streamId,
      part: ["id", "contentDetails"],
    });

    // Return the details needed for the seller to stream (Server URL + Stream Key)
    return NextResponse.json({
      success: true,
      broadcastId: broadcastId, // <--- WE NEED THIS ID
      ingestionInfo: streamRes.data.cdn.ingestionInfo, // Contains RTMP URL and Stream Key
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}