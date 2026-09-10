import React, { useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import Brand from '../components/Brand';
export default function Recuperar() {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setSenha] = useState('');
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState('');
  async function send() {
    await api.forgot(email);
    setStep(2);
    setMsg('Código enviado. Verifique seu e-mail.');
  }
  async function reset() {
    await api.reset({ email, codigo, novaSenha });
    setMsg('Senha alterada com sucesso.');
    setStep(1);
  }
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-logo">
          <Brand variant="stacked" />
        </div>
        <h2>Recuperar senha</h2>
        <p>
          {step === 1
            ? 'Insira seu e-mail cadastrado. Vamos enviar um código para mudança da senha.'
            : 'Insira o código enviado no seu e-mail e escolha uma nova senha.'}
        </p>
        {msg && <div className="alert alert-success">{msg}</div>}
        {step === 1 ? (
          <>
            <label>E-mail</label>
            <input
              className="form-control"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-raify w-100 mt-3" onClick={send}>
              Enviar o código
            </button>
          </>
        ) : (
          <>
            <label>Código</label>
            <input
              className="form-control"
              placeholder="000000"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
            <label className="mt-3">Nova senha</label>
            <input
              className="form-control"
              type="password"
              value={novaSenha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button className="btn btn-raify w-100 mt-3" onClick={reset}>
              Redefinir senha
            </button>
          </>
        )}
        <Link to="/login" className="d-block mt-3">
          Voltar ao login
        </Link>
      </div>
    </div>
  );
}
