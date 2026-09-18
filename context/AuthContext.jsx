import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, logoutFirebase, onAuthChange } from '../services/api';

const C = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" evita mostrar a tela de login por um instante antes do
  // Firebase confirmar se já existe uma sessão salva no aparelho.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthChange "escuta" o Firebase: toda vez que alguém loga, desloga,
    // ou o app abre com uma sessão salva, esta função roda de novo.
    const unsubscribe = onAuthChange((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(identifier, password) {
    const r = await api.login(identifier, password);
    setUser(r.user);
    return r;
  }

  async function logout() {
    await logoutFirebase();
    setUser(null);
  }

  // O Firebase cuida da autenticação sozinho (via sessão persistida no
  // aparelho), então não guardamos mais token nenhum aqui.
  const value = useMemo(
    () => ({ user, login, logout, authenticated: !!user, loading }),
    [user, loading]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);
