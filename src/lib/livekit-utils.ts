import { Room, RoomEvent } from 'livekit-client';

export async function createRoom(roomName: string) {
  try {
    const response = await fetch(`/api/token?room=${roomName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

export async function getParticipantToken(roomName: string, participantName: string) {
  try {
    const response = await fetch('/api/livekit/get-participant-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, participantName }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error getting participant token:', error);
    throw error;
  }
}

export function setupChatRoom(room: Room, onMessageReceived: (message: any) => void) {
  room.on(RoomEvent.DataReceived, (payload, participant) => {
    const decoder = new TextDecoder();
    const message = JSON.parse(decoder.decode(payload));
    onMessageReceived({
      id: message.id,
      content: message.content,
      sender: {
        name: participant?.identity || 'Unknown',
        avatar: '/placeholder.svg',
      },
      timestamp: new Date(message.timestamp),
      type: 'user',
    });
  });
}

export async function sendMessage(room: Room, content: string) {
  const message = {
    id: Date.now().toString(),
    content,
    timestamp: new Date().toISOString(),
  };
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(message));
  await room.localParticipant.publishData(data, { reliable: true });
  return message;
}
