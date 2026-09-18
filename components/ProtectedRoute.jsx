import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { authenticated, loading } = useAuth();

  // Enquanto o Firebase ainda está checando se existe uma sessão salva,
  // não redireciona para lugar nenhum — só espera. Sem isso, um usuário
  // já logado seria jogado de volta ao login por uma fração de segundo
  // toda vez que abrisse o app.
  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
        <span>Carregando...</span>
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}
