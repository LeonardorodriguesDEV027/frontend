import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
export default function Assinatura(){

    
  return (
    <>
    <div>
      <PageHeader title="Assinaturas" subtitle="Gerencie suas assinaturas" />
    </div>
    <div className="opcoes">
      <button className="btn-raify">Planos</button>
      <button className="btn-raify">Minha Assinatura</button>
      <button className="btn-raify">Pagamentos</button>
    </div>
    <div className="topbar d-none d-lg-flex">
    </div>
    <div className="container">
      <div className="assinatura1">

      </div>
      <div className="assinatura2">

      </div>
      <div className="assinatura3">

      </div>
    </div>

    </>
    
  );
};