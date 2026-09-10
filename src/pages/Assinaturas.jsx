import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
export default function Assinatura(){

    
  return (
    <div>
      <PageHeader title="Assinaturas" subtitle="Gerencie suas assinaturas" />
    </div>

  );
};