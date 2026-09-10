import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
const demo = {
  empresa: 'Laboratório AgroSolo',
  data: '25/07/2026',
  local: 'Talhão 01 — 0-20 cm',
  qualidade: 78,
  n: 72,
  p: 58,
  k: 81,
  ph: 5.8,
  mo: 3.4
};
export default function Solo() {
  const { token } = useAuth();
  const [tab, setTab] = useState('parametros');
  const [it, setIt] = useState([]);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({});
  useEffect(() => {
    api
      .list('soilAnalyses', token)
      .then(setIt)
      .catch(() => {});
  }, []);
  const last = it[0] || demo;
  async function save(e) {
    e.preventDefault();
    await api.create('soilAnalyses', f, token);
    setOpen(false);
    setIt([f, ...it]);
  }
  return (
    <>
      <PageHeader
        title="Análises de Solo"
        subtitle="Parâmetros, histórico, recomendações do agrônomo e relatórios."
        action={
          <button className="btn btn-raify" onClick={() => setOpen(true)}>
            + Nova análise
          </button>
        }
      />
      <div className="tabs-raify">
        {[
          ['parametros', 'Parâmetros'],
          ['historico', 'Histórico'],
          ['recomendacoes', 'Recomendações'],
          ['analises', 'Análises']
        ].map(([k, l]) => (
          <button className={tab === k ? 'active' : ''} onClick={() => setTab(k)} key={k}>
            {l}
          </button>
        ))}
      </div>
      {tab === 'parametros' && (
        <>
          <div className="raify-card last-analysis">
            <div>
              <span>Última Análise</span>
              <h3>{last.empresa}</h3>
              <p>
                {last.data} • {last.local}
              </p>
              <a href="#">Relatório anexado</a>
            </div>
            <div className="quality-score">
              <b>{last.qualidade || 78}%</b>
              <span>Índice de Qualidade do Solo</span>
            </div>
          </div>
          <div className="raify-card p-4 mt-3">
            <h3>Macronutrientes atuais</h3>
            <div className="macro-bars">
              {[
                ['N', last.n || 72, 'mg/dm³'],
                ['P', last.p || 58, 'mg/dm³'],
                ['K', last.k || 81, 'mmolc/dm³']
              ].map(([n, v, u]) => (
                <div key={n}>
                  <div className="macro-title">
                    <b>{n}</b>
                    <span>{v}%</span>
                  </div>
                  <div className="vertical-bar">
                    <i style={{ height: `${v}%` }} />
                  </div>
                  <small>{u}</small>
                  <span className={`soil-status ${v >= 60 && v <= 85 ? 'ok' : 'out'}`}>
                    {v >= 60 && v <= 85 ? 'Adequado' : 'Fora do padrão'}
                  </span>
                </div>
              ))}
            </div>
            <div className="ideal-note">
              Níveis ideais demonstrativos: N 70–80% • P 60–75% • K 70–85%. Os limites reais devem
              seguir o laudo e a orientação técnica.
            </div>
          </div>
        </>
      )}
      {tab === 'historico' && (
        <div className="soil-history-grid">
          <Chart title="Histórico do pH" values={[5.1, 5.3, 5.4, 5.6, 5.7, 5.8]} suffix="pH" />
          <Chart title="Matéria Orgânica (%)" values={[2.6, 2.7, 2.9, 3.0, 3.2, 3.4]} suffix="%" />
          <Dots title="Nitrogênio" values={[55, 58, 60, 65, 69, 72]} />
        </div>
      )}
      {tab === 'recomendacoes' && (
        <div className="recommend-grid">
          <div className="raify-card p-4">
            <span className="recommend-by">
              Recomendação de Eng. Agr. Mariana Lopes • CREA ES-000000/D
            </span>
            <h3>Recomendações Técnicas</h3>
            <ul>
              <li>Manter cobertura vegetal para proteção e aporte de matéria orgânica.</li>
              <li>Ajustar adubação conforme o resultado de fósforo e a cultura implantada.</li>
              <li>Priorizar fontes orgânicas compatíveis com o plano de transição.</li>
              <li>Monitorar pH e matéria orgânica para avaliar o impacto de longo prazo.</li>
            </ul>
            <p>
              <b>Impacto esperado:</b> melhoria gradual da estrutura do solo, maior atividade
              biológica e menor dependência de correções emergenciais.
            </p>
          </div>
          <div className="raify-card p-4">
            <h3>Próxima análise</h3>
            <div className="next-analysis">
              <i className="bi bi-calendar-check" />
              <b>Janeiro de 2027</b>
              <span>
                Repetir coleta nos mesmos pontos e profundidade para comparação histórica.
              </span>
            </div>
          </div>
        </div>
      )}
      {tab === 'analises' && (
        <div className="report-grid">
          {(it.length ? it : [demo, { ...demo, empresa: 'TerraLab', data: '12/01/2026' }]).map(
            (a, i) => (
              <div className="raify-card report-card" key={i}>
                <i className="bi bi-file-earmark-pdf" />
                <div>
                  <h3>{a.empresa}</h3>
                  <p>Postado em {a.data}</p>
                  <span>{a.local}</span>
                </div>
                <button className="btn btn-soft">Acessar relatório</button>
              </div>
            )
          )}
        </div>
      )}
      {open && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <form className="modal-content p-4" onSubmit={save}>
              <h3>Registrar análise de solo</h3>
              <div className="form-grid">
                {[
                  ['empresa', 'Empresa responsável', 'text'],
                  ['data', 'Data', 'date'],
                  ['local', 'Local da amostra', 'text'],
                  ['qualidade', 'Índice de qualidade (%)', 'number'],
                  ['ph', 'pH', 'number'],
                  ['mo', 'Matéria orgânica (%)', 'number'],
                  ['n', 'Nitrogênio (%)', 'number'],
                  ['p', 'Fósforo (%)', 'number'],
                  ['k', 'Potássio (%)', 'number']
                ].map(([k, l, t]) => (
                  <div key={k}>
                    <label>{l}</label>
                    <input
                      type={t}
                      step="any"
                      className="form-control"
                      value={f[k] || ''}
                      onChange={(e) => setF({ ...f, [k]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-soft" onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn-raify">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
function Chart({ title, values, suffix }) {
  const pts = values
    .map((v, i) => `${30 + i * 86},${180 - (v - Math.min(...values) + 1) * 22}`)
    .join(' ');
  return (
    <div className="raify-card p-4">
      <h3>{title}</h3>
      <svg viewBox="0 0 500 190" className="history-svg">
        <polyline points={pts} fill="none" stroke="#50B47D" strokeWidth="5" />
        {values.map((v, i) => (
          <g key={i}>
            <circle
              cx={30 + i * 86}
              cy={180 - (v - Math.min(...values) + 1) * 22}
              r="6"
              fill="#50B47D"
            />
            <text x={30 + i * 86} y={170 - (v - Math.min(...values) + 1) * 22} textAnchor="middle">
              {v}
              {suffix}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
function Dots({ title, values }) {
  return (
    <div className="raify-card p-4">
      <h3>{title}</h3>
      <div className="dot-chart">
        {values.map((v, i) => (
          <div key={i}>
            <i style={{ width: `${20 + v / 2}px`, height: `${20 + v / 2}px` }} />
            <span>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
