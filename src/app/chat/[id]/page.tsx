"use client";

import { ChatSidebar } from "@/components/chat";
import { Room } from "livekit-client";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const Page = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [userName, setUserName] = useState<string>("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!hasJoined) return;

    const joinRoom = async () => {
      console.log(roomId, userName, isJoining, token);

      if (!roomId || !userName || isJoining || !token) return;

      try {
        setIsJoining(true);
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
  }, [hasJoined]);

  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleJoin = () => {
    if (userName.trim()) {
      setHasJoined(true);
    }
  };

  if (!hasJoined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="p-6 bg-card rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Enter your name</h2>
          <input
            type="text"
            className="w-full p-2 mb-4 border rounded"
            placeholder="Your name"
            value={userName}
            onChange={handleUserNameChange}
          />
          <button
            className="w-full p-2 bg-primary text-primary-foreground rounded"
            onClick={handleJoin}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return <ChatSidebar room={room} />;
};

export default Page;
