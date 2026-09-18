import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';

export default function Chat() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  // Escuta as mensagens do usuário em tempo real (Firestore onSnapshot).
  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = api.onMessages(setMessages);
    } catch {
      // Sem usuário logado ainda — o ProtectedRoute cuida disso.
    }
    return () => unsub();
  }, []);

  // Rola para a última mensagem sempre que a lista muda.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    const text = msg.trim();
    if (!text || sending) return;
    setSending(true);
    setMsg('');
    try {
      await api.sendMessage(text);
    } catch {
      // Se falhar, devolve o texto para o campo para o usuário tentar de novo.
      setMsg(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <PageHeader title="Chat" subtitle="Envie suas mensagens para a equipe de suporte do RAIFY." />
      <div className="raify-card chat-box">
        <div className="chat-person">
          <div className="avatar-small">R</div>
          <div>
            <b>Suporte RAIFY</b>
            <span>
              <i /> Responderemos assim que possível
            </span>
          </div>
        </div>
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="message">
              Olá! Envie sua mensagem e a equipe do RAIFY responderá por aqui.
            </div>
          )}
          {messages.map((m) => (
            <div className={`message ${m.autor === 'usuario' ? 'mine' : ''}`} key={m.id}>
              {m.texto}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="chat-input">
          <input
            placeholder="Digite uma mensagem..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button onClick={send} disabled={sending}>
            <i className="bi bi-send-fill" />
          </button>
        </div>
      </div>
    </>
  );
}
