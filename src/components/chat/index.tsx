"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users } from "lucide-react"
import { EmojiPicker } from "./emoji-picker"
import { Message } from "./message"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Room } from "livekit-client"
import { setupChatRoom, sendMessage as sendLiveKitMessage } from "@/lib/livekit-utils"

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar: string
  }
  timestamp: Date
  type: "user" | "system"
}

interface ChatSidebarProps {
  room?: Room | null;
}

export function ChatSidebar({ room }: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [participants, setParticipants] = useState<string[]>([])

  useEffect(() => {
    if (!room) return;

    const handleParticipantJoined = () => {
      const participantNames = Array.from(room.participants.values()).map(p => p.identity);
      participantNames.push(room.localParticipant.identity);
      setParticipants(participantNames);
    };

    const handleParticipantLeft = () => {
      const participantNames = Array.from(room.participants.values()).map(p => p.identity);
      participantNames.push(room.localParticipant.identity);
      setParticipants(participantNames);
    };

    const handleMessageReceived = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    setupChatRoom(room, handleMessageReceived);
    room.on('participantConnected', handleParticipantJoined);
    room.on('participantDisconnected', handleParticipantLeft);

    // Initialize participants
    handleParticipantJoined();

    return () => {
      room.off('participantConnected', handleParticipantJoined);
      room.off('participantDisconnected', handleParticipantLeft);
    };
  }, [room]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !room) return

    try {
      const sentMessage = await sendLiveKitMessage(room, newMessage);
      const message: Message = {
        id: sentMessage.id,
        content: newMessage,
        sender: {
          name: room.localParticipant.identity,
          avatar: "/placeholder.svg",
        },
        timestamp: new Date(sentMessage.timestamp),
        type: "user"
      }

      setMessages(prev => [...prev, message]);
      setNewMessage("")
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  return (
    <div className="w-full max-w-sm border-l bg-background">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} isCurrentUser={message.sender.name === room?.localParticipant.identity} />
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <EmojiPicker
                onChange={(emoji) => setNewMessage((prev) => prev + emoji)}
              />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="flex-1 p-4">
          <div className="space-y-4">
            {participants.map((participant) => (
              <div
                key={participant}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
              >
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {participant.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{participant}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
