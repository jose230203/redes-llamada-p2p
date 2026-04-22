import { NextResponse } from 'next/server';
import Pusher from 'pusher';

// Configura tus llaves aquí
const pusher = new Pusher({
  appId: "2145292",
  key: "9d0e9b3af88776172408",
  secret: "fc58688803210013e0a3",
  cluster: "us2",
  useTLS: true,
});

export async function POST(req: Request) {
  const { type, roomId, peerId, userName, message } = await req.json();

  if (type === 'join') {
    // Avisa que alguien entró
    await pusher.trigger(`room-${roomId}`, 'user-joined', { peerId, userName });
  } else if (type === 'chat') {
    // Envía un mensaje de chat
    await pusher.trigger(`room-${roomId}`, 'new-message', { userName, message });
  }

  return NextResponse.json({ success: true });
}