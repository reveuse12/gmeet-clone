"use client";

import {
  ControlBar,
  DisconnectButton,
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { MyVideoConference } from "@/components/video";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Copy,
  Calendar,
  Users,
} from "lucide-react";
import Header from "@/components/header";

export default function MeetPage() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [meetingCode, setMeetingCode] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [username, setUsername] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const generateMeetingCode = async () => {
    if (!username.trim()) {
      setError("Please enter your name first");
      return;
    }
    // Generate a more readable room code with random words
    const adjectives = ['happy', 'swift', 'clever', 'bright', 'calm'];
    const nouns = ['tiger', 'eagle', 'dolphin', 'falcon', 'wolf'];
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const code = `${adjectives[Math.floor(Math.random() * adjectives.length)]}-${
      nouns[Math.floor(Math.random() * nouns.length)]
    }-${numbers}`;
    
    setMeetingCode(code);
    await connectToRoom(code);
  };

  const connectToRoom = async (roomCode: string) => {
    if (!username.trim()) {
      setError("Please enter your name first");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/token", {
        params: {
          room: roomCode,
          username: username.trim(),
        },
      });
      setToken(data.token);
      setIsConnected(true);
    } catch (err) {
      setError("Failed to connect to room");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = async () => {
    if (!joinCode) {
      setError("Please enter a meeting code");
      return;
    }
    if (!username.trim()) {
      setError("Please enter your name first");
      return;
    }
    await connectToRoom(joinCode);
  };

  if (isConnected && token) {
    return (
      <LiveKitRoom
        video={isCameraOn}
        audio={isMicOn}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_WEBSOCKET_URL}
        data-lk-theme="default"
        style={{ height: "100dvh" }}
      >
        <div className="relative h-full">
          <MyVideoConference />
          <RoomAudioRenderer />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-sm">
            <ControlBar 
              controls={{
                microphone: true,
                camera: true,
                screenShare: true,
                leave: false
              }}
            />
            <DisconnectButton>
              Leave Meeting
            </DisconnectButton>
          </div>
        </div>
      </LiveKitRoom>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container py-8">
        {isLoading ? (
          <div className="text-center">Connecting to room...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Tabs defaultValue="new" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="new">New Meeting</TabsTrigger>
              <TabsTrigger value="join">Join Meeting</TabsTrigger>
            </TabsList>

            {/* New Meeting Tab */}
            <TabsContent value="new" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl bg-muted border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCameraOn ? (
                        <Video className="h-16 w-16 text-muted-foreground" />
                      ) : (
                        <VideoOff className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full p-2">
                      <Button
                        variant={isCameraOn ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setIsCameraOn(!isCameraOn)}
                      >
                        {isCameraOn ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant={isMicOn ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Meeting Settings</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="camera">Camera</Label>
                        <Switch
                          id="camera"
                          checked={isCameraOn}
                          onCheckedChange={setIsCameraOn}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mic">Microphone</Label>
                        <Switch
                          id="mic"
                          checked={isMicOn}
                          onCheckedChange={setIsMicOn}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meeting Controls */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Start a Meeting
                    </h2>
                    <p className="text-muted-foreground">
                      Create a new meeting and invite others to join.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username-create">Your Name</Label>
                      <Input
                        id="username-create"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={generateMeetingCode}
                      disabled={isLoading || !username.trim()}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Create Meeting
                    </Button>

                    {meetingCode && (
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="flex items-center justify-between mb-2">
                          <Label>Meeting Code</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigator.clipboard.writeText(meetingCode)
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <code className="text-lg font-mono">{meetingCode}</code>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full" size="lg">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule for Later
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Users className="mr-2 h-4 w-4" />
                        Invite Participants
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Join Meeting Tab */}
            <TabsContent value="join" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Video Preview */}
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl bg-muted border overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isCameraOn ? (
                        <Video className="h-16 w-16 text-muted-foreground" />
                      ) : (
                        <VideoOff className="h-16 w-16 text-muted-foreground" />
                      )}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-background/95 backdrop-blur-sm rounded-full p-2">
                      <Button
                        variant={isCameraOn ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setIsCameraOn(!isCameraOn)}
                      >
                        {isCameraOn ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <VideoOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant={isMicOn ? "outline" : "destructive"}
                        size="icon"
                        onClick={() => setIsMicOn(!isMicOn)}
                      >
                        {isMicOn ? (
                          <Mic className="h-4 w-4" />
                        ) : (
                          <MicOff className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Meeting Settings</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="camera-join">Camera</Label>
                        <Switch
                          id="camera-join"
                          checked={isCameraOn}
                          onCheckedChange={setIsCameraOn}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mic-join">Microphone</Label>
                        <Switch
                          id="mic-join"
                          checked={isMicOn}
                          onCheckedChange={setIsMicOn}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Join Controls */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">
                      Join a Meeting
                    </h2>
                    <p className="text-muted-foreground">
                      Enter a meeting code to join an existing meeting.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username-join">Your Name</Label>
                      <Input
                        id="username-join"
                        placeholder="Enter your name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meeting-code">Meeting Code</Label>
                      <Input
                        id="meeting-code"
                        placeholder="Enter meeting code"
                        className="text-lg font-mono"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleJoinMeeting}
                      disabled={isLoading || !username.trim() || !joinCode.trim()}
                    >
                      Join Meeting
                    </Button>

                    <div className="text-sm text-muted-foreground text-center">
                      By joining, you agree to our Terms of Service and Privacy
                      Policy.
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
        </main>
    </div>
  );
}
