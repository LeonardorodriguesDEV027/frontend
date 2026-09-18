import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'data', label: 'Data', type: 'date' },
    { key: 'propriedade', label: 'Propriedade', type: 'text' },
    { key: 'cultura', label: 'Cultura', type: 'text' },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: [
        'Agrotóxico',
        'Biológico',
        'Controle manual',
        'Controle cultural',
        'Manejo integrado',
        'Adubação',
        'Outro'
      ]
    },
    { key: 'produto', label: 'Produto / prática', type: 'text' },
    { key: 'dose', label: 'Dose / quantidade', type: 'text' },
    { key: 'motivo', label: 'Motivo', type: 'text' },
    { key: 'responsavel', label: 'Responsável', type: 'text' },
    { key: 'observacoes', label: 'Observações', type: 'textarea', full: true }
  ];
  return (
    <CrudPage
      title="Aplicações e Manejo"
      module="applications"
      fields={fields}
      description="Registre intervenções, fertilizações, produtos e práticas utilizadas na propriedade."
    />
  );
}
