import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
export default function Propriedades() {
  const { token } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  useEffect(() => {
    api
      .list('properties', token)
      .then(setItems)
      .catch(() => {});
  }, []);
  const data = items.length
    ? items
    : [
        {
          id: 'demo',
          nome: 'Fazenda Boa Esperança',
          municipio: 'Venda Nova do Imigrante',
          uf: 'ES',
          areaTotal: 12.5,
          areaProducao: 8.2,
          latitude: -20.327,
          longitude: -41.135,
          culturas: [{ cultura: 'Café', sistema: 'Em transição' }]
        }
      ];
  return (
    <>
      <PageHeader
        title="Propriedades"
        subtitle="Visualize os dados gerais, culturas e localização."
        action={
          <button className="btn btn-raify" onClick={() => nav('/app/propriedades/nova')}>
            + Cadastrar propriedade
          </button>
        }
      />
      {data.map((p) => (
        <div className="property-card raify-card" key={p.id}>
          <div className="property-summary">
            <div className="property-photo">
              <i className="bi bi-image" />
            </div>
            <div>
              <h2>{p.nome}</h2>
              <p>
                <i className="bi bi-geo-alt" /> {p.municipio} - {p.uf}
              </p>
              <div className="property-stats">
                <span>
                  <b>{p.areaTotal}</b> ha total
                </span>
                <span>
                  <b>{p.areaProducao}</b> ha produção
                </span>
                <span>
                  <b>{p.culturas?.length || 1}</b> cultivo(s)
                </span>
              </div>
            </div>
          </div>
          <div className="property-map">
            <MapContainer
              center={[Number(p.latitude || -20.327), Number(p.longitude || -41.135)]}
              zoom={13}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[Number(p.latitude || -20.327), Number(p.longitude || -41.135)]}>
                <Popup>{p.nome}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ))}
    </>
  );
}
