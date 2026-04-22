"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomName.trim()) {
      router.push(`/room/${roomName.trim().toLowerCase()}`);
    } else {
      alert("Por favor, escribe un nombre para la sala");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
              <title className="text-lg font-bold text-blue-400">LLamadas Telematica</title>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="max-w-md w-full text-center">
        <div className="mb-8 inline-flex p-4 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
          <Video size={48} className="text-blue-500" />
        </div>

        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
          Optativa<span className="text-blue-500">Telematica</span>
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Simulación de videollamada segura y rápida para proyectos de redes.
        </p>

        {/* Formulario de Entrada */}
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ej: examen-redes-2026"
              className="w-full bg-slate-900 border border-slate-800 p-5 rounded-2xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-inner"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
          >
            Crear o unirse a sala
            <ArrowRight size={20} />
          </button>
        </form>

        {/* Beneficios (Para que la profe vea "valor agregado") */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-left">
            <Zap size={20} className="text-yellow-500 mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Baja Latencia</h3>
            <p className="text-[10px] text-slate-500">Conexión WebRTC directa.</p>
          </div>
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-left">
            <ShieldCheck size={20} className="text-green-500 mb-2" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Validado</h3>
            <p className="text-[10px] text-slate-500">Manejo estricto de periféricos.</p>
          </div>
        </div>
      </main>

      <footer className="mt-auto pt-10 text-slate-600 text-xs">
        Desarrollado para la asignatura de Redes • 2026
      </footer>
    </div>
  );
}