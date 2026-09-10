import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'areaNome', label: 'Área / Talhão', type: 'text', options: null, full: false },
    { key: 'pratica', label: 'Prática', type: 'text', options: null, full: false },
    {
      key: 'categoria',
      label: 'Categoria',
      type: 'select',
      options: [
        'Monitoramento',
        'Controle biológico',
        'Controle físico',
        'Manejo cultural',
        'Nutrição e solo',
        'MIP / MID'
      ],
      full: false
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Planejado', 'Em avaliação', 'Em uso'],
      full: false
    },
    { key: 'dataInicio', label: 'Início', type: 'date', options: null, full: false },
    { key: 'resultado', label: 'Resultado observado', type: 'textarea', options: null, full: true }
  ];
  return (
    <CrudPage
      title="Manejos Alternativos"
      module="alternatives"
      fields={fields}
      description="Acompanhe práticas que podem reduzir a dependência química."
    />
  );
}
