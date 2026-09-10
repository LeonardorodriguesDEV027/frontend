import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
const content = [
  [
    'Manejo Integrado de Pragas',
    'Aprenda a monitorar antes de intervir e a combinar métodos de controle.',
    'Manejo',
    '12 min'
  ],
  [
    'Saúde do Solo',
    'Cobertura, matéria orgânica e práticas que favorecem a vida do solo.',
    'Solo',
    '15 min'
  ],
  [
    'Transição Orgânica',
    'Entenda etapas, registros e mudanças graduais na propriedade.',
    'Transição',
    '10 min'
  ],
  [
    'Bioinsumos',
    'Conceitos básicos, armazenamento e uso responsável de produtos biológicos.',
    'Insumos',
    '8 min'
  ],
  [
    'Certificação Orgânica',
    'Conheça auditoria, OPAC/SPG e OCS de forma simples.',
    'Certificação',
    '14 min'
  ],
  [
    'Rastreabilidade',
    'Como registros de campo ajudam na gestão e na conformidade.',
    'Gestão',
    '9 min'
  ]
];
export default function Educacao() {
  const [q, setQ] = useState('');
  return (
    <>
      <PageHeader
        title="Conteúdo Educacional"
        subtitle="Aprenda no seu ritmo sobre agricultura orgânica e práticas sustentáveis."
      />
      <div className="education-search">
        <i className="bi bi-search" />
        <input placeholder="Buscar conteúdo..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="education-grid">
        {content
          .filter((x) => x[0].toLowerCase().includes(q.toLowerCase()))
          .map(([t, d, c, m]) => (
            <article className="raify-card edu-card" key={t}>
              <div className="edu-icon">
                <i className="bi bi-book" />
              </div>
              <span>{c}</span>
              <h3>{t}</h3>
              <p>{d}</p>
              <footer>
                <small>
                  <i className="bi bi-clock" /> {m}
                </small>
                <button className="btn btn-soft">Abrir conteúdo</button>
              </footer>
            </article>
          ))}
      </div>
    </>
  );
}
