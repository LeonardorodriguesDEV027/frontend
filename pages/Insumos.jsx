import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Insumos() {
  const fields = [
    { key: 'nome', label: 'Insumo', type: 'text' },
    {
      key: 'tipo',
      label: 'Tipo',
      type: 'select',
      options: ['Orgânico', 'Biológico', 'Químico', 'Semente/Muda', 'Outro']
    },
    { key: 'unidade', label: 'Unidade', type: 'text' },
    { key: 'estoque', label: 'Estoque atual', type: 'number' },
    { key: 'estoqueMinimo', label: 'Estoque mínimo', type: 'number' },
    { key: 'fornecedor', label: 'Fornecedor', type: 'text' },
    { key: 'validade', label: 'Validade', type: 'date' },
    { key: 'observacoes', label: 'Observações', type: 'textarea', full: true }
  ];
  return (
    <CrudPage
      title="Insumos"
      module="inputs"
      fields={fields}
      description="Controle os insumos utilizados na propriedade e acompanhe a substituição gradual de produtos químicos."
    />
  );
}
