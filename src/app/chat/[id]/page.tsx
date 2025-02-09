"use client";

import { ChatSidebar } from "@/components/chat";
import { Room } from "livekit-client";
import { useEffect, useState } from "react";
import { getParticipantToken } from "@/lib/livekit-utils";
import { useParams } from "next/navigation";

const Page = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const { id: roomId } = useParams();
  const [userName, setUserName] = useState<string>("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const joinRoom = async () => {
      if (!roomId || !userName || isJoining) return;
      
      try {
        setIsJoining(true);
        const { token } = await getParticipantToken(roomId as string, userName);
        
        const room = new Room({
          adaptiveStream: true,
          dynacast: true,
        });

        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);
        setRoom(room);
      } catch (error) {
        console.error("Failed to join room:", error);
      } finally {
        setIsJoining(false);
      }
    };

    joinRoom();

    return () => {
      room?.disconnect();
    };
  }, [roomId, userName]);

  if (!userName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="p-6 bg-card rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Enter your name</h2>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && setUserName(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return <ChatSidebar room={room} />;
};

export default Page;
