import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

function formatDate(v) {
  if (!v) return '—';
  // Firestore Timestamp vindo em vários formatos possíveis (serverTimestamp serializado)
  const d = v._seconds ? new Date(v._seconds * 1000) : v.seconds ? new Date(v.seconds * 1000) : new Date(v);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR');
}

const PERFIS = [
  { value: '', label: 'Todos os perfis' },
  { value: 'produtor', label: 'Produtor' },
  { value: 'agronomo', label: 'Agrônomo' },
  { value: 'admin', label: 'Administrador' }
];

export default function Admin() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [perfil, setPerfil] = useState('');

  function load() {
    setErr('');
    api.users(token).then(setUsers).catch((e) => setErr(e.message));
    api
      .adminStats(token)
      .then(setStats)
      .catch(() => setStats(null));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(u) {
    setBusy(true);
    try {
      await api.updateUser(u.id, { aprovado: !u.aprovado }, token);
      load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter((u) => {
      const matchesTerm =
        !term ||
        [u.nomeCompleto, u.email, u.telefone, u.cpf, u.crea]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term));
      const matchesPerfil = !perfil || u.tipoUsuario === perfil;
      return matchesTerm && matchesPerfil;
    });
  }, [users, q, perfil]);

  if (user?.tipoUsuario !== 'admin')
    return <div className="alert alert-warning">Área exclusiva de administrador.</div>;

  const cards = [
    ['Usuários', stats?.usuarios ?? users.length],
    ['Propriedades', stats?.propriedades ?? '—'],
    ['Planos ativos', stats?.planosAtivos ?? '—']
  ];

  return (
    <>
      <h3 className="fw-bold">Administração</h3>

      <div className="row g-3 mb-3">
        {cards.map(([a, b]) => (
          <div className="col-md-4" key={a}>
            <div className="raify-card p-3">
              <div className="metric-label" style={{ color: 'var(--raify-muted)', fontWeight: 700 }}>
                {a}
              </div>
              <div className="metric-value" style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                {b}
              </div>
            </div>
          </div>
        ))}
      </div>

      {err && <div className="alert alert-warning">{err}</div>}

      <div className="raify-card p-3">
        <div className="d-flex flex-wrap gap-2 mb-3">
          <input
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder="Buscar por nome, e-mail, telefone, CPF ou CREA"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="form-select"
            style={{ maxWidth: 220 }}
            value={perfil}
            onChange={(e) => setPerfil(e.target.value)}
          >
            {PERFIS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <span className="ms-auto align-self-center text-muted small">
            {filtered.length} de {users.length} usuário(s)
          </span>
        </div>

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Documento</th>
                <th>Perfil</th>
                <th>Propriedades</th>
                <th>Status</th>
                <th>Cadastrado em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-table">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{u.nomeCompleto || '—'}</td>
                  <td>
                    <div>{u.email || '—'}</div>
                    {u.telefone && <small className="text-muted">{u.telefone}</small>}
                  </td>
                  <td>
                    {u.tipoUsuario === 'agronomo' ? (
                      <span>CREA: {u.crea || '—'}</span>
                    ) : (
                      <span>CPF: {u.cpf || '—'}</span>
                    )}
                  </td>
                  <td>
                    <span className="status-pill secondary text-capitalize">{u.tipoUsuario}</span>
                  </td>
                  <td className="text-center">{u.totalPropriedades ?? 0}</td>
                  <td>
                    {u.status === 'BLOQUEADO' ? (
                      <span className="status-pill" style={{ background: '#FDE7E4', color: '#A33D37' }}>
                        Bloqueado
                      </span>
                    ) : u.aprovado === false ? (
                      <span className="status-pill purple">Aguardando aprovação</span>
                    ) : (
                      <span className="status-pill success">Ativo</span>
                    )}
                  </td>
                  <td>{formatDate(u.criadoEm)}</td>
                  <td className="text-end">
                    {u.tipoUsuario === 'agronomo' && (
                      <button
                        className="btn btn-sm btn-soft"
                        disabled={busy}
                        onClick={() => toggle(u)}
                      >
                        {u.aprovado ? 'Suspender aprovação' : 'Aprovar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
