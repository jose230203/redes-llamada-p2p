# NextCall 🚀 - Sistema de Videollamada P2P & Chat

Este proyecto es una aplicación de comunicación en tiempo real que permite realizar videollamadas y mensajería instantánea directamente entre navegadores. Fue desarrollado como parte de la asignatura de **Redes de Computadoras**.

## 🌐 Despliegue (Live Demo)
La aplicación se encuentra hosteada en **Vercel** para una revisión inmediata y segura bajo protocolo HTTPS:
🔗 https://redes-llamada-p2p-orcin.vercel.app/

---

## 🛠️ Arquitectura de Red y Tecnologías

El proyecto demuestra el uso de protocolos de comunicación moderna para la transmisión de datos multimedia con baja latencia.

### 📡 Protocolos Utilizados
* **WebRTC (Web Real-Time Communication):** Protocolo base para la transmisión de audio y video sin servidores intermedios de medios.
* **UDP (User Datagram Protocol):** Utilizado para el transporte de video, priorizando la fluidez y baja latencia sobre la recuperación de paquetes.
* **WebSockets (TCP):** Implementados a través de **Pusher** para la capa de señalización (Signaling) y el chat en tiempo real.
* **STUN (Session Traversal Utilities for NAT):** Servidores de Google utilizados para el descubrimiento de IP pública y cruce de Firewalls/NAT.

### 💻 Stack Tecnológico
* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Lenguaje:** TypeScript
* **P2P Engine:** [PeerJS](https://peerjs.com/)
* **Real-time Engine:** [Pusher](https://pusher.com/)
* **Estilos:** Tailwind CSS & Lucide Icons

---

## 🚀 Características Principales

1.  **Malla Dinámica (Mesh Network):** Los dispositivos se conectan automáticamente entre sí al entrar a la misma sala (Full Mesh).
2.  **Señalización Automatizada:** No es necesario intercambiar IDs manualmente; Pusher actúa como el broker de señalización.
3.  **Chat en Tiempo Real:** Mensajería instantánea integrada para coordinación durante la llamada.
4.  **Diseño Responsivo:** Interfaz adaptada para dispositivos móviles y escritorio.
5.  **Control de Periféricos:** Validación de permisos de cámara y micrófono, con opción de silenciar audio.

---

## 🔧 Instalación y Configuración Local

Si deseas ejecutar este proyecto localmente, sigue estos pasos:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/jose230203/redes-llamada-p2p.git](https://github.com/jose230203/redes-llamada-p2p.git)
   cd redes-llamada-p2p
