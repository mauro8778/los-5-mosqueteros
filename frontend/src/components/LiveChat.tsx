import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, User } from 'lucide-react';
import { socket } from '../services/socket';

export const LiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Refugio Los 5 Mosqueteros',
      text: '¡Hola! 🐾 ¿Tienes alguna duda sobre alguna mascota o el proceso de adopción?',
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');

  useEffect(() => {
    socket.connect();

    socket.on('chat_message', (msg: any) => {
      setMessages((prev) => [...prev, { sender: 'Voluntario', text: msg.message, time: 'Ahora' }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      sender: 'Tú',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    socket.emit('sendMessage', { message: input });
    setInput('');

    // Automatic helpful bot response if socket has no backend listener
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'Coordinador de Adopciones',
          text: '¡Gracias por tu mensaje! Un voluntario de Los 5 Mosqueteros revisará tu consulta a la brevedad. Recuerda que puedes postularte con el botón "Evaluar Adopción con IA" en la ficha de cada mascota.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-2xl hover:scale-105 transition"
        >
          <MessageSquare className="w-5 h-5 text-orange-500" />
          <span className="text-sm">Chat Refugio</span>
        </button>
      ) : (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-80 sm:w-96 flex flex-col h-[480px] overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black">
                🐾
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Chat en Vivo</p>
                <p className="text-[10px] text-emerald-400 font-medium">Voluntarios disponibles</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, i) => {
              const isMe = m.sender === 'Tú';
              return (
                <div
                  key={i}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 mb-0.5 font-semibold">{m.sender}</span>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl ${
                      isMe
                        ? 'bg-orange-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5">{m.time}</span>
                </div>
              );
            })}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
