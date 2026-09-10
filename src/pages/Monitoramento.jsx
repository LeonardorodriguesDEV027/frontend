import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'data', label: 'Data', type: 'date', options: null, full: false },
    { key: 'areaNome', label: 'Área / Talhão', type: 'text', options: null, full: false },
    {
      key: 'ocorrencia',
      label: 'Praga / doença / ocorrência',
      type: 'text',
      options: null,
      full: false
    },
    {
      key: 'nivel',
      label: 'Nível',
      type: 'select',
      options: ['Baixo', 'Moderado', 'Alto'],
      full: false
    },
    { key: 'conduta', label: 'Conduta', type: 'text', options: null, full: false },
    { key: 'observacoes', label: 'Observações', type: 'textarea', options: null, full: true }
  ];
  return (
    <CrudPage
      title="Monitoramento"
      module="monitoring"
      fields={fields}
      description="Registre vistorias e níveis observados antes das decisões de intervenção."
    />
  );
}
