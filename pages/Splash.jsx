import React from 'react';
import { useNavigate } from 'react-router-dom';
import Brand from '../components/Brand';
export default function Splash() {
  const nav = useNavigate();
  return (
    <div className="splash-page">
      <div className="splash-photo" />
      <div className="splash-overlay" />
      <div className="splash-brand">
        <Brand />
      </div>
      <div className="splash-content">
        <h1>Seja bem-vindo</h1>
        <p>Seu Sistema de Apoio à Transição Orgânica</p>
        <button className="btn splash-primary" onClick={() => nav('/login')}>
          Login
        </button>
        <button className="btn splash-secondary" onClick={() => nav('/cadastro')}>
          Cadastrar
        </button>
      </div>
    </div>
  );
}
