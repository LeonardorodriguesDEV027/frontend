import React from 'react';
const reports = [
  ['Redução de agrotóxicos', 'Comparativo por área, cultura, período e ciclo.'],
  ['Evolução do plano', 'Metas, ações previstas, realizadas e pendências.'],
  ['Manejos alternativos', 'Práticas não químicas e resultados observados.'],
  ['Aplicações por cultura', 'Distribuição das aplicações e seus motivos.'],
  ['Acompanhamento técnico', 'Visitas, orientações e pendências.'],
  ['Indicadores de transição', 'Visão consolidada por propriedade.']
];
export default function Relatorios() {
  return (
    <>
      <h3 className="fw-bold">Relatórios</h3>
      <p className="text-secondary">Modelos demonstrativos prontos para expansão para PDF/CSV.</p>
      <div className="row g-3">
        {reports.map(([a, b]) => (
          <div className="col-md-6 col-xl-4" key={a}>
            <div className="raify-card p-4 h-100">
              <h5 className="fw-bold">{a}</h5>
              <p className="text-secondary">{b}</p>
              <button
                className="btn btn-soft"
                onClick={() =>
                  alert(
                    'Relatório demonstrativo: integração PDF/CSV pode ser habilitada no backend.'
                  )
                }
              >
                Gerar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
