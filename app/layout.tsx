import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App SIMULADOR DE VIDEOLLAMADA",
  description: "Creada para la asignatura Telematica, esta aplicación simula una videollamada grupal con chat integrado, utilizando tecnologías como WebRTC, PeerJS y Pusher para la comunicación en tiempo real. Permite a los usuarios unirse a salas de videollamadas, compartir su video y audio, y enviar mensajes de texto en un entorno seguro y eficiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
