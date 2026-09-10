import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';
const C = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('raify_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('raify_user') || 'null'));
  async function login(identifier, password) {
    const r = await api.login(identifier, password);
    setToken(r.token);
    setUser(r.user);
    localStorage.setItem('raify_token', r.token);
    localStorage.setItem('raify_user', JSON.stringify(r.user));
    return r;
  }
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('raify_token');
    localStorage.removeItem('raify_user');
  }
  const value = useMemo(
    () => ({ token, user, login, logout, authenticated: !!token }),
    [token, user]
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useAuth = () => useContext(C);
