import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
export default function Documentos() {
  const { token } = useAuth();
  const [it, setIt] = useState([]);
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState('Análise');
  const [uploading, setUploading] = useState(false);
  const load = () =>
    api
      .list('documents', token)
      .then(setIt)
      .catch(() => {});
  useEffect(() => {
    load();
  }, []);
  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const up = await api.upload(file, token);
      await api.create(
        'documents',
        {
          nome: file.name,
          categoria: cat,
          data: new Date().toISOString().slice(0, 10),
          url: up.url,
          path: up.path,
          status: 'Válido'
        },
        token
      );
      setFile(null);
      load();
    } finally {
      setUploading(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Documentos e Evidências"
        subtitle="Armazene laudos, análises, planos, fotos e documentos da certificação."
      />
      <div className="raify-card upload-box">
        <div>
          <h3>Enviar documento</h3>
          <p>O arquivo é armazenado no Firebase Storage e o registro fica no Firestore.</p>
        </div>
        <select className="form-select" value={cat} onChange={(e) => setCat(e.target.value)}>
          {[
            'Análise',
            'Plano',
            'Visita',
            'Receituário',
            'Certificação',
            'Foto/Evidência',
            'Outro'
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-raify" disabled={!file || uploading} onClick={upload}>
          {uploading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      <div className="report-grid mt-3">
        {it.map((d) => (
          <div className="raify-card report-card" key={d.id}>
            <i className="bi bi-file-earmark-text" />
            <div>
              <h3>{d.nome}</h3>
              <p>
                {d.categoria} • {d.data}
              </p>
            </div>
            <a className="btn btn-soft" href={d.url} target="_blank" rel="noreferrer">
              Abrir
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
