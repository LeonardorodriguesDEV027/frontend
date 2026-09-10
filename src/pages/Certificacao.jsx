import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
const stages = [
  [
    'Diagnóstico e documentação',
    '10/06/2026',
    '20/06/2026',
    'Concluído',
    'CAR, documentos pessoais e cadastro da propriedade',
    '10 dias'
  ],
  [
    'Adequação das práticas',
    '21/06/2026',
    '—',
    'Em andamento',
    'Plano de manejo e registros de campo',
    '3–12 meses'
  ],
  [
    'Avaliação da conformidade',
    '—',
    '—',
    'Não iniciado',
    'Registros, documentos e evidências',
    '30–60 dias'
  ],
  ['Conclusão / certificação', '—', '—', 'Não iniciado', 'Relatório final e parecer', 'Variável']
];
export default function Certificacao() {
  const [tab, setTab] = useState('visao');
  return (
    <>
      <PageHeader
        title="Certificação Orgânica"
        subtitle="Acompanhe o caminho da propriedade até a avaliação de conformidade orgânica."
      />
      <div className="tabs-raify">
        {[
          ['visao', 'Visão Geral'],
          ['etapas', 'Etapas'],
          ['grupos', 'Requisitos'],
          ['certificadoras', 'Certificadoras']
        ].map(([k, l]) => (
          <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'visao' && (
        <div className="cert-overview">
          <div className="raify-card certification-progress">
            <div>
              <span>Progresso da certificação</span>
              <b>48%</b>
              <p>2 de 4 macroetapas iniciadas</p>
            </div>
            <div className="cert-circle">48%</div>
            <div className="progress progress-lg">
              <div className="progress-bar" style={{ width: '48%' }} />
            </div>
          </div>
          <div className="cert-info">
            A certificação orgânica é um processo de avaliação da conformidade. O RAIFY organiza
            etapas, documentos e evidências, mas a aprovação depende do organismo e das regras
            aplicáveis.
          </div>
        </div>
      )}
      {tab === 'etapas' && (
        <div className="stage-list">
          {stages.map((s, i) => (
            <div className="raify-card stage-card" key={s[0]}>
              <div className="stage-number">{i + 1}</div>
              <div className="stage-content">
                <div className="card-title-row">
                  <h3>{s[0]}</h3>
                  <span
                    className={`status-pill ${s[3] === 'Concluído' ? 'success' : s[3] === 'Em andamento' ? 'purple' : 'secondary'}`}
                  >
                    {s[3]}
                  </span>
                </div>
                <div className="stage-meta">
                  <span>
                    <b>Início:</b> {s[1]}
                  </span>
                  <span>
                    <b>Conclusão:</b> {s[2]}
                  </span>
                  <span>
                    <b>Tempo estimado:</b> {s[5]}
                  </span>
                </div>
                <p>
                  <b>Documentos necessários:</b> {s[4]}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === 'grupos' && (
        <div className="requirements-grid">
          {[
            [
              'Documentação',
              75,
              [
                'Cadastro da propriedade',
                'CAR',
                'Documentos do produtor',
                'Registros de atividades'
              ]
            ],
            [
              'Práticas Agrícolas',
              45,
              ['Plano de manejo', 'Controle de insumos', 'Rastreabilidade', 'Manejo de solo']
            ],
            [
              'Gestão e Evidências',
              35,
              ['Histórico de aplicações', 'Análises', 'Fotos/evidências', 'Visitas técnicas']
            ]
          ].map(([g, p, items]) => (
            <div className="raify-card p-4" key={g}>
              <div className="card-title-row">
                <h3>{g}</h3>
                <b>{p}%</b>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${p}%` }} />
              </div>
              <ul className="req-list">
                {items.map((x, i) => (
                  <li key={x}>
                    <i className={`bi ${i < 2 ? 'bi-check-circle-fill' : 'bi-circle'}`} />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {tab === 'certificadoras' && (
        <>
          <div className="certifiers-grid">
            {[
              ['Certificadora Auditoria — Exemplo', '(27) 3333-0000', 'contato@exemplo.org', 'OAC'],
              ['Associação Participativa — Exemplo', '(27) 3333-1111', 'spg@exemplo.org', 'OPAC'],
              ['Grupo de Agricultores — Exemplo', '(27) 3333-2222', 'ocs@exemplo.org', 'OCS']
            ].map((c) => (
              <div className="raify-card certifier" key={c[0]}>
                <h3>{c[0]}</h3>
                <span className="cert-type">{c[3]}</span>
                <p>
                  <i className="bi bi-telephone" /> {c[1]}
                  <br />
                  <i className="bi bi-envelope" /> {c[2]}
                </p>
                <button className="btn btn-raify">Solicitar contato</button>
              </div>
            ))}
          </div>
          <div className="raify-card p-4 mt-3">
            <h3>Entenda os tipos</h3>
            <p>
              <b>OAC / Auditoria:</b> organismo que realiza inspeção e auditoria formal.
            </p>
            <p>
              <b>OPAC:</b> organismo de sistema participativo, com avaliação compartilhada entre
              participantes.
            </p>
            <p>
              <b>OCS:</b> organização de agricultores familiares para controle social na venda
              direta, conforme as regras aplicáveis.
            </p>
          </div>
        </>
      )}
    </>
  );
}
