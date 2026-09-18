import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from '../components/Brand';
export default function Caminho() {
  const nav = useNavigate();
  const { user } = useAuth();
  return (
    <div className="path-page">
      <div className="path-card">
        <Brand />
        <h1>Como deseja continuar?</h1>
        <p>Escolha a interface mais adequada ao seu perfil.</p>
        <div className="path-grid">
          <button onClick={() => nav('/app')}>
            <i className="bi bi-flower1" />
            <b>Sou Agricultor</b>
            <span>Propriedade, safra, transição, solo, custos e certificação.</span>
          </button>
          <button
            onClick={() => nav('/app')}
            disabled={!['agronomo', 'admin'].includes(user?.tipoUsuario)}
          >
            <i className="bi bi-person-badge" />
            <b>Sou Agrônomo</b>
            <span>Acompanhamento técnico, recomendações e produtores vinculados.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
