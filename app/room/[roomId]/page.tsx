"use client";
import { useEffect, useRef, useState, use } from 'react';
import { Peer } from 'peerjs';
import { Mic, MicOff, PhoneOff, Video } from 'lucide-react';

interface PeerConnection {
  id: string;
  stream: MediaStream;
}

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<PeerConnection[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [myId, setMyId] = useState<string>("");

  // --- NUEVO: Referencia para guardar el objeto Peer y estado para el Input ---
  const peerInstance = useRef<Peer | null>(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState<string>("");
  // ---------------------------------------------------------------------------

  const myVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let peer: Peer;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setMyStream(stream);
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        peer = new Peer({
          config: { 
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] 
          }
        });

        // --- NUEVO: Guardamos la instancia en la referencia ---
        peerInstance.current = peer;

        peer.on('open', (id) => {
          setMyId(id);
        });

        peer.on('call', (call) => {
          call.answer(stream);
          call.on('stream', (userStream) => {
            setRemoteStreams((prev) => [
              ...prev.filter(p => p.id !== call.peer),
              { id: call.peer, stream: userStream }
            ]);
          });
        });

      } catch (err) {
        alert("Error de acceso a periféricos.");
      }
    };

    startCamera();

    return () => {
      peer?.destroy();
      myStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // --- NUEVO: Función para llamar a otro ID ---
  const callPeer = (id: string) => {
    if (!myStream || !peerInstance.current) {
        alert("Espera a que tu cámara cargue");
        return;
    }

    const call = peerInstance.current.call(id, myStream);
    
    call.on('stream', (userStream) => {
      setRemoteStreams((prev) => [
        ...prev.filter(p => p.id !== id),
        { id, stream: userStream }
      ]);
    });
  };
  // --------------------------------------------

  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col">
      <header className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Sala Activa</h1>
          <p className="text-xl font-mono">{roomId}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 uppercase">Tu ID (Cópialo)</p>
          <p className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded select-all">
            {myId || "Generando..."}
          </p>
        </div>
      </header>

      {/* --- NUEVO: Interfaz para realizar la llamada --- */}
      <div className="max-w-md mx-auto mb-8 flex gap-2 w-full">
        <input 
          type="text" 
          placeholder="Pega el ID del otro dispositivo..."
          className="flex-1 bg-slate-900 border border-slate-700 p-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
        />
        <button 
          onClick={() => callPeer(remotePeerIdValue)}
          className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
        >
          Llamar
        </button>
      </div>
      {/* ----------------------------------------------- */}
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden border-2 border-blue-600 shadow-2xl">
          <video ref={myVideoRef} autoPlay muted playsInline className="w-full h-full object-cover -scale-x-100" />
          <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">TÚ</div>
        </div>

        {remoteStreams.map((peer) => (
          <div key={peer.id} className="relative bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
            <video 
              autoPlay 
              playsInline 
              ref={(el) => { if (el) el.srcObject = peer.stream; }} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-800/80 px-3 py-1 rounded-full text-[10px] font-bold">
              CONECTADO
            </div>
          </div>
        ))}
      </main>

      <footer className="mt-8 flex justify-center items-center gap-6 pb-4">
        <button onClick={toggleMute} className={`p-5 rounded-2xl ${isMuted ? 'bg-red-500' : 'bg-slate-800'}`}>
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
        <button className="bg-red-600 p-5 rounded-3xl hover:bg-red-500" onClick={() => window.location.href = '/'}>
          <PhoneOff size={28} fill="currentColor" />
        </button>
      </footer>
    </div>
  );
}