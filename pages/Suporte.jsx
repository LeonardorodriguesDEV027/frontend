import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
const faqs = [
  [
    'Como começo meu plano de transição?',
    'Cadastre a propriedade, registre o diagnóstico atual e, com apoio técnico, defina metas e ações graduais.'
  ],
  [
    'O RAIFY substitui o agrônomo?',
    'Não. O sistema organiza dados e acompanhamento; recomendações técnicas devem ser feitas por profissional habilitado.'
  ],
  [
    'Posso anexar análises e documentos?',
    'Sim. A tela Documentos permite enviar arquivos ao Firebase Storage quando configurado.'
  ]
];
export default function Suporte() {
  const [tab, setTab] = useState('chat');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { me: false, text: 'Olá! Sou Mariana, agrônoma de suporte. Como posso ajudar?' },
    { me: true, text: 'Quero revisar meu plano de transição.' }
  ]);
  function send() {
    if (!msg.trim()) return;
    setMessages([...messages, { me: true, text: msg }]);
    setMsg('');
  }
  return (
    <>
      <PageHeader
        title="Suporte Técnico"
        subtitle="Converse com nossos especialistas em agricultura orgânica."
      />
      <div className="tabs-raify">
        {[
          ['chat', 'Chat'],
          ['faq', 'Perguntas frequentes'],
          ['contatos', 'Contatos']
        ].map(([k, l]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'chat' && (
        <div className="support-layout">
          <div className="raify-card chat-box">
            <div className="chat-person">
              <div className="avatar-small">ML</div>
              <div>
                <b>Mariana Lopes</b>
                <span>
                  <i /> Online
                </span>
              </div>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div className={`message ${m.me ? 'mine' : ''}`} key={i}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                placeholder="Digite uma mensagem..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button onClick={send}>
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </div>
          <Contacts />
        </div>
      )}
      {tab === 'faq' && (
        <div className="faq-list">
          {faqs.map(([q, a]) => (
            <details className="raify-card" key={q}>
              <summary>
                {q}
                <i className="bi bi-chevron-down" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      )}
      {tab === 'contatos' && <Contacts full />}
    </>
  );
}
function Contacts() {
  return (
    <div className="raify-card contacts-box">
      <h3>Contatos</h3>
      {[
        ['Mariana Lopes', 'Agrônoma responsável', 'Online'],
        ['Carlos Vieira', 'Agrônomo RAIFY', 'Offline'],
        ['Equipe RAIFY', 'Suporte da plataforma', 'Online']
      ].map(([n, r, s]) => (
        <div className="contact-row" key={n}>
          <div className="avatar-small">
            {n
              .split(' ')
              .map((x) => x[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div>
            <b>{n}</b>
            <span>{r}</span>
          </div>
          <small className={s === 'Online' ? 'online' : ''}>{s}</small>
        </div>
      ))}
    </div>
  );
}
