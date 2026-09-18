import React, { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';

export default function Recuperar() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [sent, setSent] = useState(false);

  async function send(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.forgot(email);
      setSent(true);
      setMsg('Enviamos um link de redefinição para o seu e-mail. Abra-o para criar uma nova senha.');
    } catch (x) {
      setErr(x.message);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <Brand variant="stacked" />
        </div>
        <h2>Recuperar senha</h2>
        <p>Insira seu e-mail cadastrado. Vamos enviar um link para você criar uma nova senha.</p>
        {msg && <div className="alert alert-success">{msg}</div>}
        {err && <div className="alert alert-danger">{err}</div>}
        {!sent && (
          <form onSubmit={send}>
            <label>E-mail</label>
            <input
              className="form-control"
              placeholder="seu.email@exemplo.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-raify w-100 mt-3">Enviar link de redefinição</button>
          </form>
        )}
        <Link to="/login" className="d-block mt-3">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
