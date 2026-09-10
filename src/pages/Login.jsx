import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Brand from '../components/Brand';
export default function Login() {
  const [identifier, setI] = useState('admin');
  const [password, setP] = useState('admin');
  const [error, setE] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  async function go(e) {
    e.preventDefault();
    try {
      const r = await login(identifier, password);
      // Administrador não precisa escolher perfil: vai direto para o painel de administração.
      nav(r.user?.tipoUsuario === 'admin' ? '/app/admin' : '/caminho');
    } catch (e) {
      setE(e.message);
    }
  }
  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={go}>
        <div className="auth-logo">
          <Brand variant="stacked" />
        </div>
        <h2>Entrar no RAIFY</h2>
        <p>Gerencie sua propriedade e acompanhe sua transição orgânica.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <label>E-mail ou usuário</label>
        <input className="form-control" value={identifier} onChange={(e) => setI(e.target.value)} />
        <label>Senha</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
        <div className="auth-options">
          <label className="remember">
            <input type="checkbox" /> Lembrar de mim
          </label>
          <Link to="/recuperar">Esqueci minha senha</Link>
        </div>
        <button className="btn btn-raify w-100">Entrar</button>
        <div className="auth-footer">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
        <div className="demo-login">
          Demonstração local: <b>admin / admin</b>
        </div>
      </form>
    </div>
  );
}
