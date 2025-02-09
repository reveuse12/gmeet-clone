"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRoom } from "@/lib/livekit-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [roomName, setRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || isCreating) return;

    try {
      setIsCreating(true);
      const { room: createdRoomName } = await createRoom(roomName);
      console.log(createdRoomName); 
      router.push(`/chat/${createdRoomName}`);
    } catch (error) {
      console.error("Failed to create room:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-6 bg-card rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Create a Chat Room</h1>
        <form onSubmit={handleCreateRoom} className="space-y-4">
          <div>
            <label htmlFor="roomName" className="block text-sm font-medium mb-1">
              Room Name
            </label>
            <Input
              id="roomName"
              type="text"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={isCreating}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </div>
    </div>
  );
}