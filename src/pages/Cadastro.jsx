import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Brand from '../components/Brand';
export default function Cadastro() {
  const [f, setF] = useState({ tipoUsuario: 'produtor' });
  const [e, setE] = useState('');
  const nav = useNavigate();
  async function save(ev) {
    ev.preventDefault();
    try {
      await api.register(f);
      alert('Cadastro realizado. Confira seu e-mail.');
      nav('/login');
    } catch (x) {
      setE(x.message);
    }
  }
  const upd = (k, v) => setF({ ...f, [k]: v });
  return (
    <div className="auth-screen">
      <form className="auth-card auth-card-wide" onSubmit={save}>
        <div className="auth-logo">
          <Brand compact />
        </div>
        <h2>Crie sua conta</h2>
        <div className="role-tabs">
          <button
            type="button"
            className={f.tipoUsuario === 'produtor' ? 'active' : ''}
            onClick={() => upd('tipoUsuario', 'produtor')}
          >
            Agricultor
          </button>
          <button
            type="button"
            className={f.tipoUsuario === 'agronomo' ? 'active' : ''}
            onClick={() => upd('tipoUsuario', 'agronomo')}
          >
            Agrônomo
          </button>
        </div>
        {e && <div className="alert alert-danger">{e}</div>}
        <div className="form-grid">
          {[
            ['nomeCompleto', 'Nome Completo'],
            ['email', 'E-mail'],
            ['telefone', 'Telefone'],
            ['cpf', 'CPF']
          ].map(([k, l]) => (
            <div key={k}>
              <label>{l}</label>
              <input
                className="form-control"
                required={['nomeCompleto', 'email'].includes(k)}
                value={f[k] || ''}
                onChange={(x) => upd(k, x.target.value)}
              />
            </div>
          ))}
          {f.tipoUsuario === 'agronomo' && (
            <div>
              <label>CREA</label>
              <input
                className="form-control"
                value={f.crea || ''}
                onChange={(x) => upd('crea', x.target.value)}
              />
            </div>
          )}
          <div>
            <label>Senha</label>
            <input
              type="password"
              className="form-control"
              required
              value={f.senha || ''}
              onChange={(x) => upd('senha', x.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-raify w-100 mt-3">Cadastrar</button>
        <div className="auth-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </div>
      </form>
    </div>
  );
}
