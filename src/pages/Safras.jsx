import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Safras() {
  const fields = [
    { key: 'nome', label: 'Safra', type: 'text' },
    { key: 'propriedade', label: 'Propriedade', type: 'text' },
    { key: 'cultura', label: 'Cultura', type: 'text' },
    { key: 'inicio', label: 'Início', type: 'date' },
    { key: 'fim', label: 'Previsão de término', type: 'date' },
    { key: 'areaHa', label: 'Área (ha)', type: 'number' },
    { key: 'producaoPrevista', label: 'Produção prevista', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Planejada', 'Em andamento', 'Concluída']
    },
    { key: 'observacoes', label: 'Observações', type: 'textarea', full: true }
  ];
  return (
    <CrudPage
      title="Safras"
      module="harvests"
      fields={fields}
      description="Planeje e acompanhe as safras por cultura e propriedade."
    />
  );
}
