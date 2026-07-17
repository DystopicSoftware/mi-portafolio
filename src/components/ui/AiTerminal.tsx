import { useState, useRef, useEffect } from 'react';
import { Terminal, Send, X, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SISTEMA ONLINE. Soy el Agente IA de Juan Villada. ¿En qué puedo ayudarte?' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || 'Error en la conexión');

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: '[ERROR DE SISTEMA]: Fallo en enlace de comunicaciones.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón Toggle Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-cyan-600 rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:bg-cyan-500 transition-all cursor-pointer border border-cyan-400"
        aria-label="Abrir Terminal IA"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Terminal className="w-6 h-6" />}
      </button>

      {/* Ventana Modal del Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[400px] z-[9999] bg-black/80 backdrop-blur-xl border border-cyan-500/30 font-mono rounded-lg flex flex-col shadow-[0_0_30px_rgba(0,243,255,0.15)] overflow-hidden">
          
          {/* Cabecera Técnica */}
          <div className="bg-cyan-950/50 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-xs tracking-widest font-bold">TERMINAL_IA :: ACTIVA</span>
            </div>
          </div>

          {/* Área de Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-600/20 border border-cyan-500/30 text-white' 
                    : 'bg-transparent text-cyan-300'
                }`}>
                  {msg.role === 'assistant' && <span className="text-cyan-500 font-bold block mb-1 text-[10px] tracking-wider">AGENTE_IA&gt;</span>}
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-cyan-500 flex items-center gap-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  PROCESANDO...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-cyan-500/30 p-3 bg-black/50">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ingresar comando..."
                className="flex-1 bg-transparent border border-cyan-500/30 rounded px-3 py-2 text-sm text-cyan-300 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white px-3 py-2 rounded flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
