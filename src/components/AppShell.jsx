import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from './Brand';
const nav = [
  ['/app', 'bi-house', 'Dashboard'],
  ['/app/propriedades', 'bi-house-heart', 'Propriedades'],
  ['/app/areas', 'bi-map', 'Áreas e Talhões'],
  ['/app/diagnostico', 'bi-clipboard-data', 'Diagnóstico Inicial'],
  ['/app/calendario', 'bi-calendar3', 'Calendário'],
  ['/app/safras', 'bi-basket2', 'Safras'],
  ['/app/solo', 'bi-moisture', 'Análises de Solo'],
  ['/app/insumos', 'bi-box-seam', 'Insumos'],
  ['/app/plano', 'bi-list-check', 'Plano de Transição'],
  ['/app/aplicacoes', 'bi-droplet', 'Aplicações e Manejo'],
  ['/app/alternativas', 'bi-recycle', 'Manejos Alternativos'],
  ['/app/monitoramento', 'bi-graph-up', 'Monitoramento'],
  ['/app/certificacao', 'bi-patch-check', 'Certificação Orgânica'],
  ['/app/financeiro', 'bi-cash-coin', 'Financeiro'],
  ['/app/funcionarios', 'bi-people', 'Funcionários'],
  ['/app/tecnico', 'bi-person-workspace', 'Acompanhamento Técnico'],
  ['/app/relatorios', 'bi-bar-chart', 'Relatórios'],
  ['/app/educacao', 'bi-book', 'Conteúdo Educacional'],
  ['/app/suporte', 'bi-chat-dots', 'Suporte Técnico'],
  ['/app/documentos', 'bi-folder2-open', 'Documentos'],
  ['/app/perfil', 'bi-person-circle', 'Perfil'],
  ['/app/admin', 'bi-gear', 'Administração'],
  ['/app/chat', 'bi-gear', 'Chat'],
  ['/app/assinaturas', 'bi-gear', 'Assinatura']
];
export default function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navg = useNavigate();
  const go = (p) => {
    setOpen(false);
    navg(p);
  };
  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <Brand />
          <button className="sidebar-close d-lg-none" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>
        <div className="sidebar-scroll">
          {nav.map(([to, icon, l]) => (
            <NavLink
              key={to}
              end={to === '/app'}
              to={to}
              onClick={() => setOpen(false)}
              className="navlink"
            >
              <i className={`bi ${icon}`} />
              <span>{l}</span>
            </NavLink>
          ))}
        </div>
      </aside>
      {open && <div className="sidebar-backdrop" onClick={() => setOpen(false)} />}
      <main className="main-content">
        <div className="mobile-greenbar d-lg-none">
          <button onClick={() => setOpen(true)}>
            <i className="bi bi-list" />
          </button>
          <Brand compact />
          <div className="mobile-actions">
            <i className="bi bi-bell" />
            <button onClick={() => go('/app/perfil')}>
              <i className="bi bi-person-circle" />
            </button>
          </div>
        </div>
        <div className="topbar d-none d-lg-flex">
          <Brand compact />
          <div className="topbar-right">
            <button className="icon-btn">
              <i className="bi bi-bell" />
            </button>
            <button className="user-chip" onClick={() => go('/app/perfil')}>
              <i className="bi bi-person-circle" />
              <span>
                <b>{user?.nomeCompleto || 'Usuário'}</b>
                <small>{user?.tipoUsuario || 'admin'}</small>
              </span>
            </button>
            <button className="btn btn-sm btn-soft" onClick={logout}>
              Sair
            </button>
          </div>
        </div>
        <Outlet />
      </main>
      
    </div>
  );
}
