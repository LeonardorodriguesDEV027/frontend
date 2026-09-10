import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function Areas() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [form, setF] = useState({});
  const [open, setOpen] = useState(false);
  const load = () =>
    api
      .list('areas', token)
      .then(setItems)
      .catch(() => setItems([]));
  useEffect(() => {
    load();
  }, []);
  async function save(e) {
    e.preventDefault();
    await api.create(
      'areas',
      {
        ...form,
        latitude: Number(form.latitude || -20.32),
        longitude: Number(form.longitude || -40.34)
      },
      token
    );
    setOpen(false);
    setF({});
    load();
  }
  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h3 className="fw-bold">Áreas e Talhões</h3>
          <p className="text-secondary">
            Cadastre culturas, área e localização da unidade produtiva.
          </p>
        </div>
        <button className="btn btn-raify" onClick={() => setOpen(true)}>
          + Nova área
        </button>
      </div>
      <div className="row g-3">
        {(items.length
          ? items
          : [
              {
                id: 'demo1',
                nome: 'Talhão T-01',
                cultura: 'Tomate',
                areaHa: '2,5',
                progresso: 72
              },
              {
                id: 'demo2',
                nome: 'Talhão T-02',
                cultura: 'Café',
                areaHa: '8,0',
                progresso: 55
              },
              {
                id: 'demo3',
                nome: 'Talhão T-03',
                cultura: 'Hortaliças',
                areaHa: '1,8',
                progresso: 81
              }
            ]
        ).map((a) => (
          <div className="col-md-4" key={a.id}>
            <div className="raify-card p-3">
              <h5 className="fw-bold">{a.nome}</h5>
              <div className="text-secondary small">
                {a.cultura} • {a.areaHa} ha
              </div>
              <div className="small mt-3">Transição</div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${a.progresso || 60}%` }} />
              </div>
              <b className="text-success d-block mt-2">{a.progresso || 60}%</b>
            </div>
          </div>
        ))}
      </div>
      <div className="raify-card p-3 mt-3">
        <h5 className="fw-bold">Mapa da propriedade</h5>
        <div className="map-wrap">
          <MapContainer center={[-20.32, -40.34]} zoom={10} style={{ height: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[-20.32, -40.34]}>
              <Popup>Área demonstrativa RAIFY</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      {open && (
        <div className="modal d-block" style={{ background: 'rgba(10,30,20,.45)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <form className="modal-content p-3" onSubmit={save}>
              <div className="modal-header border-0">
                <h5 className="fw-bold">Nova área / talhão</h5>
                <button type="button" className="btn-close" onClick={() => setOpen(false)} />
              </div>
              <div className="modal-body row g-3">
                {[
                  ['nome', 'Nome / talhão'],
                  ['cultura', 'Cultura'],
                  ['areaHa', 'Área (ha)'],
                  ['progresso', '% transição'],
                  ['latitude', 'Latitude'],
                  ['longitude', 'Longitude']
                ].map(([k, l]) => (
                  <div className="col-md-6" key={k}>
                    <label className="form-label">{l}</label>
                    <input
                      className="form-control"
                      value={form[k] || ''}
                      onChange={(e) => setF({ ...form, [k]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-raify">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
