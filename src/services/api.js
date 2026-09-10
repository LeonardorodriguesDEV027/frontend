const API = import.meta.env.VITE_API_URL || '/api';
export async function request(path, { method = 'GET', body, token, formData = false } = {}) {
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  if (!formData) headers['Content-Type'] = 'application/json';
  const r = await fetch(API + path, {
    method,
    headers,
    body: formData ? body : body ? JSON.stringify(body) : undefined
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}
export const api = {
  login: (identifier, password) =>
    request('/auth/login', { method: 'POST', body: { identifier, password } }),
  register: (b) => request('/auth/register', { method: 'POST', body: b }),
  forgot: (email) => request('/auth/forgot', { method: 'POST', body: { email } }),
  reset: (b) => request('/auth/reset', { method: 'POST', body: b }),
  profile: (t) => request('/auth/me', { token: t }),
  updateProfile: (b, t) => request('/auth/me', { method: 'PUT', body: b, token: t }),
  list: (m, t) => request(`/data/${m}`, { token: t }),
  create: (m, b, t) => request(`/data/${m}`, { method: 'POST', body: b, token: t }),
  update: (m, id, b, t) => request(`/data/${m}/${id}`, { method: 'PUT', body: b, token: t }),
  remove: (m, id, t) => request(`/data/${m}/${id}`, { method: 'DELETE', token: t }),
  summary: (t) => request('/dashboard/summary', { token: t }),
  users: (t) => request('/admin/users', { token: t }),
  updateUser: (id, b, t) => request(`/admin/users/${id}`, { method: 'PUT', body: b, token: t }),
  adminStats: (t) => request('/admin/stats', { token: t }),
  upload: (file, t) => {
    const fd = new FormData();
    fd.append('file', file);
    return request('/files/upload', { method: 'POST', body: fd, token: t, formData: true });
  }
};
