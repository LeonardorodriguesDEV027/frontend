import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Recuperar from './pages/Recuperar';
import Caminho from './pages/Caminho';
import Dashboard from './pages/Dashboard';
import Propriedades from './pages/Propriedades';
import CadastroPropriedade from './pages/CadastroPropriedade';
import Perfil from './pages/Perfil';
import Calendario from './pages/Calendario';
import Safras from './pages/Safras';
import Funcionarios from './pages/Funcionarios';
import Solo from './pages/Solo';
import Educacao from './pages/Educacao';
import Certificacao from './pages/Certificacao';
import Insumos from './pages/Insumos';
import Suporte from './pages/Suporte';
import Financeiro from './pages/Financeiro';
import Plano from './pages/Plano';
import Aplicacoes from './pages/Aplicacoes';
import Documentos from './pages/Documentos';
import Admin from './pages/Admin';
import Areas from './pages/Areas';
import Diagnostico from './pages/Diagnostico';
import Monitoramento from './pages/Monitoramento';
import Relatorios from './pages/Relatorios';
import Tecnico from './pages/Tecnico';
import Alternativas from './pages/Alternativas';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route
          path="/caminho"
          element={
            <ProtectedRoute>
              <Caminho />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="propriedades" element={<Propriedades />} />
          <Route path="propriedades/nova" element={<CadastroPropriedade />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="safras" element={<Safras />} />
          <Route path="funcionarios" element={<Funcionarios />} />
          <Route path="solo" element={<Solo />} />
          <Route path="educacao" element={<Educacao />} />
          <Route path="certificacao" element={<Certificacao />} />
          <Route path="insumos" element={<Insumos />} />
          <Route path="suporte" element={<Suporte />} />
          <Route path="financeiro" element={<Financeiro />} />
          <Route path="plano" element={<Plano />} />
          <Route path="aplicacoes" element={<Aplicacoes />} />
          <Route path="documentos" element={<Documentos />} />
          <Route path="admin" element={<Admin />} />
          <Route path="areas" element={<Areas />} />
          <Route path="diagnostico" element={<Diagnostico />} />
          <Route path="monitoramento" element={<Monitoramento />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="tecnico" element={<Tecnico />} />
          <Route path="alternativas" element={<Alternativas />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
