import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
import { useNavigate } from 'react-router-dom';
export default function Perfil() {
  const { user, token } = useAuth();
  const [f, setF] = useState(user || {});
  const [edit, setEdit] = useState(false);
  const nav = useNavigate();
  async function save() {
    await api.updateProfile(f, token);
    localStorage.setItem('raify_user', JSON.stringify({ ...user, ...f }));
    setEdit(false);
    alert('Perfil atualizado. Entre novamente para atualizar toda a sessão.');
  }
  function options(t)  {
    switch (t) { 
      case 'Opções do perfil':
        setEdit(true);
        break;
      case 'Configurações do Site':
        nav('/login');
        break;
      case 'Política de privacidade':
        nav('/cadastro');
        break;
      case 'Assinatura RAIFY':
        nav('/assinaturas');
        break;
      default:
        break;
    }
  }
  return (
    <>
      <PageHeader title="Meu Perfil" subtitle="Gerencie seus dados pessoais e preferências." />
      <div className="profile-wrap">
        <div className="profile-head">
          <div className="avatar-large">
            <i className="bi bi-person" />
            
          </div>
          <h4>{user?.nomeCompleto}</h4>
          <div className="profile-contact">
            <span>
              <i className="bi bi-envelope" /> {user?.email}
            </span>
            <span>
              <i className="bi bi-telephone" /> {user?.telefone || 'Não informado'}
            </span>
          </div>
        </div>
        <div className="profile-options">
          {[
            ['bi-person-gear', 'Opções do perfil', 'Atualize nome, telefone e outras informações.'],
            ['bi-sliders', 'Configurações do Site', 'Notificações, aparência e preferências.'],
            ['bi-shield-check','Política de privacidade','Consulte como seus dados são tratado'],
            ['bi-stars', 'Assinatura RAIFY', 'Gerencie seu plano e assinatura.']
          ].map(([ic, t, d]) => (
            <button key={t} onClick={() => options(t)} className="profile-option">
              <i className={`bi ${ic}`} />
              <span>
                <b>{t}</b>
                <small>{d}</small>
              </span>
              <i className="bi bi-chevron-right" />
            </button>
            
          ))}
        </div>
      </div>
      {edit && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h3>Editar perfil</h3>
              <label>Nome</label>
              <input
                className="form-control"
                value={f.nomeCompleto || ''}
                onChange={(e) => setF({ ...f, nomeCompleto: e.target.value })}
              />
              <label className="mt-3">Telefone</label>
              <input
                className="form-control"
                value={f.telefone || ''}
                onChange={(e) => setF({ ...f, telefone: e.target.value })}
              />
              <label>Email</label>
              <input
                className="form-control"
                value={f.email || ''}
                onChange={(e) => setF({ ...f, email: e.target.value })}
              />
              <label>Senha</label>
              <input
                className="form-control"
                value={f.senha || ''}
                onChange={(e) => setF({ ...f, senha: e.target.value })}
              />
              <div className="mt-4 d-flex gap-2 justify-content-end">
                <button className="btn btn-soft" onClick={() => setEdit(false)}>
                  Cancelar
                </button>
                <button className="btn btn-raify" onClick={save}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
