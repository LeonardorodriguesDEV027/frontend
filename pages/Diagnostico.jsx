import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'areaNome', label: 'Área / Talhão', type: 'text', options: null, full: false },
    { key: 'cultura', label: 'Cultura', type: 'text', options: null, full: false },
    {
      key: 'aplicacoesCiclo',
      label: 'Aplicações por ciclo',
      type: 'number',
      options: null,
      full: false
    },
    {
      key: 'dependencia',
      label: 'Dependência',
      type: 'select',
      options: ['Alta', 'Média', 'Baixa'],
      full: false
    },
    { key: 'alvos', label: 'Principais alvos', type: 'text', options: null, full: false },
    {
      key: 'acompanhamento',
      label: 'Acompanhamento técnico',
      type: 'select',
      options: ['Semanal', 'Quinzenal', 'Mensal', 'Sem acompanhamento'],
      full: false
    },
    { key: 'observacoes', label: 'Observações', type: 'textarea', options: null, full: true }
  ];
  return (
    <CrudPage
      title="Diagnóstico Inicial"
      module="diagnostics"
      fields={fields}
      description="Registre o cenário atual do manejo convencional."
    />
  );
}
