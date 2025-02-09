import { NextRequest, NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

// Do not cache endpoint result
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } 

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_SECRET_KEY;
  const wsUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, { identity: username ?? "Anonymous" });
  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

  return NextResponse.json(
    { token: await at.toJwt() , room},
    { headers: { "Cache-Control": "no-store" } }
  );
}
