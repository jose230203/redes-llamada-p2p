"use client";
import { useEffect, useRef, useState, use } from 'react';
import { Peer } from 'peerjs';
import Pusher from 'pusher-js';
import { Mic, MicOff, PhoneOff, Send } from 'lucide-react'; 
interface Message {
  userName: string;
  message: string;
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{id: string, stream: MediaStream}[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const myVideoRef = useRef<HTMLVideoElement>(null);

  const [userName, setUserName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  
  const peerInstance = useRef<Peer | null>(null);

  useEffect(() => {
    if (!hasJoined) return;

    let peer: Peer;
    const pusher = new Pusher("9d0e9b3af88776172408", { cluster: "us2" });
    const channel = pusher.subscribe(`room-${roomId}`);

    const init = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMyStream(stream);
      if (myVideoRef.current) myVideoRef.current.srcObject = stream;

      peer = new Peer({ config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } });
      peerInstance.current = peer;

      peer.on('open', (id) => {
        fetch('/api/room', {
          method: 'POST',
          body: JSON.stringify({ type: 'join', roomId, peerId: id, userName })
        });
      });

      channel.bind('user-joined', (data: { peerId: string }) => {
        if (data.peerId !== peer.id) {
          const call = peer.call(data.peerId, stream);
          call.on('stream', (userStream) => {
            setRemoteStreams(prev => [...prev.filter(p => p.id !== data.peerId), { id: data.peerId, stream: userStream }]);
          });
        }
      });

      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (userStream) => {
          setRemoteStreams(prev => [...prev.filter(p => p.id !== call.peer), { id: call.peer, stream: userStream }]);
        });
      });

      channel.bind('new-message', (data: Message) => {
        setMessages(prev => [...prev, data]);
      });
    };

    init();
    return () => { peer?.destroy(); pusher.disconnect(); };
  }, [hasJoined]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await fetch('/api/room', {
      method: 'POST',
      body: JSON.stringify({ type: 'chat', roomId, userName, message: inputText })
    });
    setInputText("");
  };

  if (!hasJoined) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-white mb-6">¿Cómo te verán los demás?</h2>
          <input 
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-xl mb-4 text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tu nombre..."
            onChange={(e) => setUserName(e.target.value)}
          />
          <button 
            onClick={() => userName.trim() && setHasJoined(true)}
            className="w-full bg-blue-600 p-4 rounded-xl font-bold text-white hover:bg-blue-500 transition-all"
          >
            Entrar a la Sala
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black flex flex-col md:flex-row overflow-hidden font-sans">
      <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
        <div className="relative bg-slate-900 rounded-2xl overflow-hidden border-2 border-blue-600">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
          <div className="absolute bottom-4 left-4 bg-blue-600 px-3 py-1 rounded-lg text-xs font-bold">Tú: {userName}</div>
        </div>

        {remoteStreams.map((peer) => (
          <div key={peer.id} className="relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
            <video autoPlay playsInline ref={(el) => { if (el) el.srcObject = peer.stream; }} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-800 font-bold text-blue-400">Chat de la Sala</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.userName === userName ? 'items-end' : 'items-start'}`}>
              <span className="text-[10px] text-slate-500 mb-1">{m.userName}</span>
              <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${m.userName === userName ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {m.message}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input 
            className="flex-1 bg-slate-800 border border-slate-700 p-3 rounded-xl text-sm text-white outline-none"
            placeholder="Escribe un mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-500">
            <Send size={18} />
          </button>
        </form>
      </div>
      
      <button 
        onClick={() => window.location.href = '/'}
        className="absolute bottom-6 left-6 bg-red-600 p-4 rounded-full shadow-2xl hover:bg-red-500 transition-all z-50"
      >
        <PhoneOff size={24} color="white" />
      </button>
    </div>
  );
}