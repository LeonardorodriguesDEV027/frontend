import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Page() {
  const fields = [
    { key: 'propriedade', label: 'Propriedade', type: 'text' },
    { key: 'cultura', label: 'Cultura', type: 'text' },
    { key: 'situacaoReferencia', label: 'Situação de referência', type: 'text' },
    { key: 'metaAtual', label: 'Meta de redução / mudança', type: 'text' },
    { key: 'metaPercentual', label: 'Meta percentual', type: 'number' },
    { key: 'prazo', label: 'Prazo', type: 'date' },
    { key: 'acao', label: 'Ação principal', type: 'text' },
    { key: 'responsavel', label: 'Responsável', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Planejado', 'Em andamento', 'Concluído']
    },
    { key: 'observacoes', label: 'Observações', type: 'textarea', full: true }
  ];
  return (
    <CrudPage
      title="Plano de Transição"
      module="plans"
      fields={fields}
      description="Defina metas graduais, prazos, responsáveis e ações de transição orgânica."
    />
  );
}
