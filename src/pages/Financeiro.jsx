import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
export default function Financeiro() {
  const { token } = useAuth();
  const [it, setIt] = useState([]);
  const [sel, setSel] = useState(null);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ tipo: 'Despesa' });
  const load = () =>
    api
      .list('finance', token)
      .then(setIt)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    await api.create('finance', { ...f, valor: Number(f.valor || 0) }, token);
    setOpen(false);
    setF({ tipo: 'Despesa' });
    load();
  }
  const data = it.length
    ? it
    : [
        {
          id: '1',
          data: '2026-08-02',
          descricao: 'Biofertilizante',
          categoria: 'Insumos orgânicos',
          tipo: 'Despesa',
          valor: 680,
          formaPagamento: 'PIX'
        },
        {
          id: '2',
          data: '2026-08-05',
          descricao: 'Venda de hortaliças',
          categoria: 'Receita',
          tipo: 'Receita',
          valor: 2800,
          formaPagamento: 'Transferência'
        },
        {
          id: '3',
          data: '2026-08-08',
          descricao: 'Consultoria agronômica',
          categoria: 'Assistência técnica',
          tipo: 'Despesa',
          valor: 420,
          formaPagamento: 'Boleto'
        }
      ];
  return (
    <>
      <PageHeader
        title="Financeiro"
        subtitle="Acompanhe custos, receitas e o impacto econômico da transição."
        action={
          <button className="btn btn-raify" onClick={() => setOpen(true)}>
            + Lançamento
          </button>
        }
      />
      <div className="finance-kpis">
        <div>
          <span>Receitas do mês</span>
          <b>R$ 2.800,00</b>
        </div>
        <div>
          <span>Despesas do mês</span>
          <b>R$ 1.100,00</b>
        </div>
        <div>
          <span>Saldo</span>
          <b>R$ 1.700,00</b>
        </div>
      </div>
      <div className="raify-card p-4 mt-3">
        <h3>Últimos 3 meses</h3>
        <div className="finance-chart">
          {[
            ['Jun', 2100, 1500],
            ['Jul', 2450, 1380],
            ['Ago', 2800, 1100]
          ].map(([m, r, d]) => (
            <div className="fin-month" key={m}>
              <div className="fin-bars">
                <i style={{ height: `${r / 30}px` }} />
                <b style={{ height: `${d / 30}px` }} />
              </div>
              <span>{m}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="raify-card p-4 mt-3 table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((x) => (
              <tr key={x.id}>
                <td>{x.data}</td>
                <td>{x.descricao}</td>
                <td>{x.categoria}</td>
                <td>{x.tipo}</td>
                <td>
                  R${' '}
                  {Number(x.valor).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </td>
                <td>
                  <button className="btn btn-sm btn-soft" onClick={() => setSel(x)}>
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <h3>Detalhes da transação</h3>
              {Object.entries(sel)
                .filter(([k]) => k !== 'id')
                .map(([k, v]) => (
                  <div className="detail-line" key={k}>
                    <span>{k}</span>
                    <b>{String(v)}</b>
                  </div>
                ))}
              <button className="btn btn-soft mt-3" onClick={() => setSel(null)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      {open && (
        <div className="modal d-block modal-bg">
          <div className="modal-dialog modal-dialog-centered">
            <form className="modal-content p-4" onSubmit={save}>
              <h3>Novo lançamento</h3>
              {[
                ['data', 'Data', 'date'],
                ['descricao', 'Descrição', 'text'],
                ['categoria', 'Categoria', 'text'],
                ['valor', 'Valor', 'number'],
                ['formaPagamento', 'Forma de pagamento', 'text']
              ].map(([k, l, t]) => (
                <div className="mt-2" key={k}>
                  <label>{l}</label>
                  <input
                    className="form-control"
                    type={t}
                    required
                    value={f[k] || ''}
                    onChange={(e) => setF({ ...f, [k]: e.target.value })}
                  />
                </div>
              ))}
              <label className="mt-2">Tipo</label>
              <select
                className="form-select"
                value={f.tipo}
                onChange={(e) => setF({ ...f, tipo: e.target.value })}
              >
                <option>Despesa</option>
                <option>Receita</option>
              </select>
              <div className="mt-4 d-flex gap-2 justify-content-end">
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
