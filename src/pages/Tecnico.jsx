import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'data', label: 'Data', type: 'date', options: null, full: false },
    { key: 'areaNome', label: 'Área / Talhão', type: 'text', options: null, full: false },
    { key: 'tecnico', label: 'Agrônomo / técnico', type: 'text', options: null, full: false },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: ['Visita', 'Orientação', 'Revisão do plano'],
      full: false
    },
    { key: 'orientacao', label: 'Orientação técnica', type: 'textarea', options: null, full: true },
    { key: 'proximaVisita', label: 'Próxima visita', type: 'date', options: null, full: false }
  ];
  return (
    <CrudPage
      title="Acompanhamento Técnico"
      module="technical"
      fields={fields}
      description="Visitas, orientações e revisões do plano de transição."
    />
  );
}
