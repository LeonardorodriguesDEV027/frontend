import React from 'react';
import CrudPage from '../components/CrudPage';
export default function Funcionarios() {
  const fields = [
    { key: 'nome', label: 'Nome completo', type: 'text' },
    { key: 'funcao', label: 'Função', type: 'text' },
    { key: 'telefone', label: 'Telefone', type: 'text' },
    { key: 'email', label: 'E-mail', type: 'text' },
    { key: 'dataAdmissao', label: 'Admissão', type: 'date' },
    { key: 'status', label: 'Status', type: 'select', options: ['Ativo', 'Inativo', 'Temporário'] },
    { key: 'observacoes', label: 'Observações', type: 'textarea', full: true }
  ];
  return (
    <CrudPage
      title="Funcionários"
      module="employees"
      fields={fields}
      description="Cadastre a equipe que participa das atividades agrícolas."
    />
  );
}
