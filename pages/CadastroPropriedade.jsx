import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { api } from '../services/api';
import PageHeader from '../components/PageHeader';
function Picker({ pos, onPick }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return pos ? <Marker position={pos} /> : null;
}
const checks = [
  'Realiza análise de solo?',
  'Faz correção do solo?',
  'Utiliza cobertura do solo?',
  'Utiliza adubação verde?',
  'Faz rotação de culturas?',
  'Utiliza plantio direto?',
  'Faz compostagem?'
];
export default function CadastroPropriedade() {
  const nav = useNavigate();
  const [f, setF] = useState({
    car: 'nao_sei',
    culturas: [
      {
        cultura: '',
        areaCultivada: '',
        producaoMedia: '',
        plantio: '',
        colheita: '',
        sistema: 'Em transição'
      }
    ],
    fertilizantes: [],
    controlePragas: [],
    manejos: {},
    fontesAgua: [],
    usoAgua: []
  });
  const [pos, setPos] = useState([-20.327, -41.135]);
  const upd = (k, v) => setF({ ...f, [k]: v });
  const toggle = (field, val) => {
    const a = f[field] || [];
    upd(field, a.includes(val) ? a.filter((x) => x !== val) : [...a, val]);
  };
  const culture = (i, k, v) => {
    const a = [...f.culturas];
    a[i] = { ...a[i], [k]: v };
    upd('culturas', a);
  };
  async function save(e) {
    e.preventDefault();
    const payload = {
      ...f,
      latitude: pos[0],
      longitude: pos[1],
      areaTotal: Number(f.areaTotal || 0),
      areaProducao: Number(f.areaProducao || 0)
    };
    await api.create('properties', payload);
    alert('Propriedade cadastrada com sucesso.');
    nav('/app/propriedades');
  }
  return (
    <>
      <PageHeader
        title="Cadastro de Propriedade"
        subtitle="Coloque os dados da sua propriedade para melhorar a sua transição."
      />
      <form onSubmit={save} className="property-form">
        <section className="raify-card form-section">
          <h3>1. Dados gerais e documentação</h3>
          <div className="form-grid">
            {[
              ['nome', 'Nome da propriedade'],
              ['areaTotal', 'Tamanho total (ha — máximo 20)'],
              ['municipio', 'Município'],
              ['cidade', 'Cidade'],
              ['uf', 'UF'],
              ['anoInicio', 'Ano de início das atividades agrícolas']
            ].map(([k, l]) => (
              <div key={k}>
                <label>{l}</label>
                <input
                  className="form-control"
                  max={k === 'areaTotal' ? 20 : undefined}
                  type={['areaTotal', 'anoInicio'].includes(k) ? 'number' : 'text'}
                  value={f[k] || ''}
                  onChange={(e) => upd(k, e.target.value)}
                />
              </div>
            ))}
          </div>
          <label className="mt-3">Possui CAR (Cadastro Ambiental Rural)?</label>
          <div className="choice-row">
            {[
              ['sim', 'Sim'],
              ['nao', 'Não'],
              ['nao_sei', 'Não sei']
            ].map(([v, l]) => (
              <label key={v}>
                <input
                  type="radio"
                  name="car"
                  checked={f.car === v}
                  onChange={() => upd('car', v)}
                />
                {l}
              </label>
            ))}
          </div>
          {f.car === 'sim' && (
            <div className="mt-2">
              <label>Número do CAR</label>
              <input
                className="form-control"
                value={f.numeroCar || ''}
                onChange={(e) => upd('numeroCar', e.target.value)}
              />
            </div>
          )}
        </section>
        <section className="raify-card form-section">
          <h3>2. Localização e características</h3>
          <p>Clique no mapa para indicar a localização exata da propriedade.</p>
          <div className="property-picker">
            <MapContainer center={pos} zoom={12}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Picker pos={pos} onPick={setPos} />
            </MapContainer>
          </div>
          <div className="gps-readout">
            GPS: {pos[0].toFixed(6)}, {pos[1].toFixed(6)}
          </div>
          <div className="form-grid mt-3">
            {[
              ['areaProducao', 'Área utilizada para produção (ha)'],
              ['areaPreservacao', 'Área de preservação (ha)'],
              ['areaPousio', 'Área em descanso/pousio (ha)'],
              ['areaExpansao', 'Área disponível para expansão (ha)']
            ].map(([k, l]) => (
              <div key={k}>
                <label>{l}</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  value={f[k] || ''}
                  onChange={(e) => upd(k, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>
        <section className="raify-card form-section">
          <div className="card-title-row">
            <h3>3. Culturas produzidas</h3>
            <button
              type="button"
              className="btn btn-soft"
              onClick={() =>
                upd('culturas', [...f.culturas, { cultura: '', sistema: 'Em transição' }])
              }
            >
              + Adicionar cultivo
            </button>
          </div>
          {f.culturas.map((c, i) => (
            <div className="culture-block" key={i}>
              <div className="form-grid">
                {[
                  ['cultura', 'Cultura'],
                  ['areaCultivada', 'Área cultivada (ha)'],
                  ['producaoMedia', 'Produção média'],
                  ['plantio', 'Época de plantio'],
                  ['colheita', 'Época de colheita']
                ].map(([k, l]) => (
                  <div key={k}>
                    <label>{l}</label>
                    <input
                      className="form-control"
                      value={c[k] || ''}
                      onChange={(e) => culture(i, k, e.target.value)}
                    />
                  </div>
                ))}
                <div>
                  <label>Sistema atual</label>
                  <select
                    className="form-select"
                    value={c.sistema}
                    onChange={(e) => culture(i, 'sistema', e.target.value)}
                  >
                    {['Convencional', 'Orgânico', 'Em transição', 'Agroecológico', 'Outro'].map(
                      (x) => (
                        <option key={x}>{x}</option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <div className="system-help">
                <b>Convencional:</b> manejo com técnicas e insumos convencionais. <b>Orgânico:</b>{' '}
                sem químicos sintéticos permitidos pela produção orgânica. <b>Em transição:</b>{' '}
                processo gradual de mudança. <b>Agroecológico:</b> foco no equilíbrio do
                agroecossistema e recursos naturais.
              </div>
            </div>
          ))}
        </section>
        <section className="raify-card form-section">
          <h3>4. Manejo, fertilização e controle de pragas</h3>
          <label>Quais fertilizantes você utiliza?</label>
          <div className="check-grid">
            {[
              'Adubo químico',
              'Esterco',
              'Compostagem',
              'Adubação Verde',
              'Fertilizantes orgânicos',
              'Biofertilizantes',
              'Outros'
            ].map((v) => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={f.fertilizantes.includes(v)}
                  onChange={() => toggle('fertilizantes', v)}
                />
                {v}
              </label>
            ))}
          </div>
          <label className="mt-3">Com que frequência realiza a adubação?</label>
          <small className="helper">
            Descreva como aduba as culturas e como o manejo muda durante as estações do ano.
          </small>
          <textarea
            className="form-control"
            rows="3"
            value={f.frequenciaAdubacao || ''}
            onChange={(e) => upd('frequenciaAdubacao', e.target.value)}
          />
          <label className="mt-3">Como controla atualmente as pragas?</label>
          <div className="check-grid">
            {[
              'Agrotóxicos',
              'Produtos biológicos',
              'Controle manual',
              'Controle cultural',
              'Manejo integrado',
              'Não realiza controle',
              'Outro'
            ].map((v) => (
              <label key={v}>
                <input
                  type="checkbox"
                  checked={f.controlePragas.includes(v)}
                  onChange={() => toggle('controlePragas', v)}
                />
                {v}
              </label>
            ))}
          </div>
          <label className="mt-3">Utiliza produtos para controle de pragas?</label>
          <div className="choice-row">
            <label>
              <input type="radio" name="usaProdutos" onChange={() => upd('usaProdutos', true)} />
              Sim
            </label>
            <label>
              <input type="radio" name="usaProdutos" onChange={() => upd('usaProdutos', false)} />
              Não
            </label>
          </div>
          {f.usaProdutos && (
            <textarea
              className="form-control mt-2"
              placeholder="Quais produtos utiliza?"
              value={f.produtosPragas || ''}
              onChange={(e) => upd('produtosPragas', e.target.value)}
            />
          )}
          <div className="yesno-grid mt-4">
          {checks.map((q, index) => (
    <div key={q}>
      <span>{q}</span>
      <div className="form-select">
        <label>
          <input type="radio" name={`manejo-${index}`} value="sim" checked={f.manejos[q] === true}
            onChange={() => upd("manejos", {...f.manejos,[q]: true})
            }
          />
          Sim
        </label>

        <label>
          <input
            type="radio"
            name={`manejo-${index}`}
            value="nao"
            checked={f.manejos[q] === false}
            onChange={() =>
              upd("manejos", {
                ...f.manejos,
                [q]: false
              })
            }
          />
          Não
        </label>

      </div>
    </div>
  ))}
</div>
        </section>
        <section className="raify-card form-section">
          <h3>5. Recursos naturais</h3>
          <label>Possui fonte de água?</label>
          <div className="choice-row">
            <label>
              <input type="radio" name="agua" onChange={() => upd('possuiAgua', true)} />
              Sim
            </label>
            <label>
              <input type="radio" name="agua" onChange={() => upd('possuiAgua', false)} />
              Não
            </label>
          </div>
          {f.possuiAgua && (
            <>
              <label className="mt-3">Tipos de fonte</label>
              <div className="check-grid">
                {['Rio', 'Córrego', 'Nascente', 'Poço', 'Represa', 'Outro'].map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={f.fontesAgua.includes(v)}
                      onChange={() => toggle('fontesAgua', v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
              <label className="mt-3">Para que utiliza a água?</label>
              <div className="check-grid">
                {['Irrigação', 'Consumo humano', 'Animais', 'Processamento', 'Outros'].map((v) => (
                  <label key={v}>
                    <input
                      type="checkbox"
                      checked={f.usoAgua.includes(v)}
                      onChange={() => toggle('usoAgua', v)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </>
          )}
        </section>
        <div className="form-actions">
          <button type="button" className="btn btn-soft" onClick={() => nav('/app/propriedades')}>
            Cancelar
          </button>
          <button className="btn btn-raify">Salvar propriedade</button>
        </div>
      </form>
    </>
  );
}
