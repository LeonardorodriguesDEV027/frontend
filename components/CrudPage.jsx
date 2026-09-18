import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import PageHeader from './PageHeader';
export default function CrudPage({ title, module, fields, description }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const load = () =>
    api
      .list(module)
      .then(setItems)
      .catch((e) => setError(e.message));
  useEffect(() => {
    load();
  }, [module]);
  const columns = useMemo(() => fields.filter((x) => x.type !== 'textarea').slice(0, 5), [fields]);
  function start(item = null) {
    setEditing(item?.id || null);
    setForm(item || {});
    setOpen(true);
  }
  async function save(e) {
    e.preventDefault();
    try {
      if (editing) {
        // Atualiza o item em memória em vez de recarregar a lista inteira.
        const updated = await api.update(module, editing, form);
        setItems((prev) => prev.map((it) => (it.id === editing ? { ...it, ...updated } : it)));
      } else {
        const created = await api.create(module, form);
        setItems((prev) => [created, ...prev]);
      }
      setOpen(false);
      setForm({});
      setEditing(null);
    } catch (e) {
      setError(e.message);
    }
  }
  async function del(id) {
    if (confirm('Excluir este registro?')) {
      try {
        await api.remove(module, id);
        setItems((prev) => prev.filter((it) => it.id !== id));
      } catch (e) {
        setError(e.message);
      }
    }
  }
  return (
    <>
      <PageHeader
        title={title}
        subtitle={description}
        action={
          <button className="btn btn-raify" onClick={() => start()}>
            + Novo registro
          </button>
        }
      />
      {error && <div className="alert alert-warning">{error}</div>}
      <div className="raify-card p-3 table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((f) => (
                <th key={f.key}>{f.label}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="empty-table">
                  Nenhum registro ainda. Clique em “Novo registro”.
                </td>
              </tr>
            ) : (
              items.map((x) => (
                <tr key={x.id}>
                  {columns.map((f) => (
                    <td key={f.key}>
                      {Array.isArray(x[f.key]) ? x[f.key].join(', ') : String(x[f.key] ?? '')}
                    </td>
                  ))}
                  <td className="text-end">
                    <button className="btn btn-sm btn-soft me-1" onClick={() => start(x)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => del(x.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {open && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <form className="modal-content p-4" onSubmit={save}>
              <div className="d-flex justify-content-between">
                <h3>
                  {editing ? 'Editar' : 'Novo'} — {title}
                </h3>
                <button type="button" className="btn-close" onClick={() => setOpen(false)} />
              </div>
              <div className="form-grid mt-3">
                {fields.map((f) => (
                  <div className={f.full ? 'full' : ''} key={f.key}>
                    <label>{f.label}</label>
                    {f.type === 'select' ? (
                      <select
                        className="form-select"
                        value={form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      >
                        <option value="">Selecione</option>
                        {(f.options || []).map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea
                        rows="4"
                        className="form-control"
                        value={form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    ) : (
                      <input
                        className="form-control"
                        type={f.type || 'text'}
                        step={f.type === 'number' ? 'any' : undefined}
                        value={form[f.key] || ''}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-soft" onClick={() => setOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn-raify">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
