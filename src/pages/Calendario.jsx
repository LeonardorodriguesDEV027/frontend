import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export default function Calendario() {
  const { token } = useAuth();
  const [it, setIt] = useState([]);
  const [form, setF] = useState({ status: 'Pendente', cor: '#8b5cf6' });
  const [open, setOpen] = useState(false);
  const load = () =>
    api
      .list('calendar', token)
      .then(setIt)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    await api.create('calendar', form, token);
    setOpen(false);
    setF({ status: 'Pendente', cor: '#8b5cf6' });
    load();
  }
  const demo = it.length
    ? it
    : [
        {
          id: '1',
          data: '2026-08-10',
          hora: '08:00',
          titulo: 'Vistoria do Talhão 1',
          status: 'Concluída',
          cor: '#4CAF7D'
        },
        {
          id: '2',
          data: '2026-08-10',
          hora: '15:00',
          titulo: 'Reunião com agrônomo',
          status: 'Pendente',
          cor: '#8b5cf6'
        }
      ];
  return (
    <>
      <PageHeader
        title="Calendário"
        subtitle="Organize as atividades da propriedade."
        action={
          <button className="btn btn-raify" onClick={() => setOpen(true)}>
            + Nova atividade
          </button>
        }
      />
      <div className="calendar-layout">
        <div className="raify-card calendar-card">
          <div className="calendar-head">
            <button>‹</button>
            <h3>Agosto 2026</h3>
            <button>›</button>
          </div>
          <div className="calendar-grid">
            {days.map((d) => (
              <b key={d}>{d}</b>
            ))}
            {Array.from({ length: 35 }, (_, i) => (i < 5 ? '' : i - 4)).map((d, i) => (
              <div className={d === 10 ? 'today' : ''} key={i}>
                {d}
                {d === 10 && <i />}
              </div>
            ))}
          </div>
        </div>
        <div className="raify-card p-4">
          <h3>Atividades do dia</h3>
          {demo.map((a) => (
            <div className="agenda-item" key={a.id} style={{ borderLeftColor: a.cor }}>
              <b>
                {a.hora} — {a.titulo}
              </b>
              <span
                className={`status-pill ${a.status === 'Concluída' ? 'success' : a.status === 'Em andamento' ? 'purple' : 'secondary'}`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {open && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content p-4" onSubmit={save}>
              <h3>Nova atividade</h3>
              {[
                ['titulo', 'Atividade', 'text'],
                ['data', 'Data', 'date'],
                ['hora', 'Horário', 'time']
              ].map(([k, l, t]) => (
                <div key={k} className="mt-2">
                  <label>{l}</label>
                  <input
                    type={t}
                    className="form-control"
                    required
                    value={form[k] || ''}
                    onChange={(e) => setF({ ...form, [k]: e.target.value })}
                  />
                </div>
              ))}
              <label className="mt-2">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setF({ ...form, status: e.target.value })}
              >
                <option>Concluída</option>
                <option>Pendente</option>
                <option>Em andamento</option>
              </select>
              <div className="mt-4 d-flex justify-content-end gap-2">
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
