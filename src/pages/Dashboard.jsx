import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import WeatherCard from '../components/WeatherCard';
const activities = [
  ['08:00', 'Análise visual do Talhão 1', 'Concluída', 'success'],
  ['10:30', 'Aplicação de biofertilizante', 'Em andamento', 'purple'],
  ['15:00', 'Reunião com agrônomo', 'Pendente', 'secondary']
];
export default function Dashboard() {
  const { user, token } = useAuth();
  const [s, setS] = useState({});
  useEffect(() => {
    api
      .summary(token)
      .then(setS)
      .catch(() => {});
  }, []);
  return (
    <>
      <PageHeader
        title={`Bom dia, ${(user?.nomeCompleto || 'Agricultor').split(' ')[0]}!`}
        subtitle="Acompanhe sua propriedade e a evolução da transição."
      />
      <WeatherCard />
      <div className="dashboard-grid mt-4">
        <div className="raify-card p-4 transition-card">
          <div className="card-title-row">
            <h3>Progresso da Transição</h3>
            <b className="percent">62%</b>
          </div>
          <div className="progress progress-lg">
            <div className="progress-bar" style={{ width: '62%' }} />
          </div>
          <p>
            Você está avançando. Continue registrando suas práticas e acompanhando as recomendações.
          </p>
        </div>
        <div className="raify-card cost-card">
          <div className="cost-icon">R$</div>
          <div>
            <span>Custos do mês</span>
            <strong>R$ 1.500,00</strong>
            <small>-8% em relação ao mês anterior</small>
          </div>
        </div>
      </div>
      <div className="dashboard-grid mt-3">
        <div className="raify-card p-4">
          <div className="card-title-row">
            <h3>Última análise de solo</h3>
            <a href="/app/solo">Ver análise</a>
          </div>
          {[
            ['Nitrogênio (N)', 72],
            ['Fósforo (P)', 58],
            ['Potássio (K)', 81]
          ].map(([n, v]) => (
            <div className="npk-row" key={n}>
              <span>{n}</span>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${v}%` }} />
              </div>
              <b>{v}%</b>
            </div>
          ))}
        </div>
        <div className="raify-card p-4">
          <div className="card-title-row">
            <h3>
              <i className="bi bi-calendar3" /> Atividades de hoje
            </h3>
            <a href="/app/calendario">Ver todas</a>
          </div>
          {activities.map(([t, n, st, c]) => (
            <div className="activity-row" key={n}>
              <div className="activity-time">{t}</div>
              <div className="activity-name">{n}</div>
              <span className={`status-pill ${c}`}>{st}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="dashboard-grid mt-3">
        <div className="raify-card p-4">
          <h3>Qualidade do solo — 6 meses</h3>
          <svg className="soil-line" viewBox="0 0 520 190">
            <polyline
              fill="none"
              stroke="#50B47D"
              strokeWidth="5"
              points="25,145 110,120 195,132 280,88 365,70 495,42"
            />
            {[
              [25, 145],
              [110, 120],
              [195, 132],
              [280, 88],
              [365, 70],
              [495, 42]
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="7" fill="#50B47D" />
            ))}
          </svg>
          <div className="chart-labels">
            <span>Mar</span>
            <span>Abr</span>
            <span>Mai</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Ago</span>
          </div>
        </div>
        <div className="raify-card p-4">
          <h3>Insumos orgânicos x químicos</h3>
          <div className="bars-compare">
            {[
              ['Mar', 42, 58],
              ['Abr', 48, 52],
              ['Mai', 57, 43],
              ['Jun', 64, 36],
              ['Jul', 71, 29],
              ['Ago', 76, 24]
            ].map(([m, o, q]) => (
              <div className="bar-month" key={m}>
                <div className="bar-stack">
                  <i style={{ height: `${o}%` }} />
                  <b style={{ height: `${q}%` }} />
                </div>
                <span>{m}</span>
              </div>
            ))}
          </div>
          <div className="legend">
            <span>
              <i className="dot org" /> Orgânicos
            </span>
            <span>
              <i className="dot chem" /> Químicos
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
