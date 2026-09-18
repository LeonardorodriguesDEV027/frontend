import React, { useEffect, useState } from 'react';
export default function WeatherCard({
  lat = -20.32,
  lon = -40.34,
  property = 'Fazenda Boa Esperança'
}) {
  const [w, setW] = useState({
    temperature: 24,
    humidity: 72,
    wind: 8,
    desc: 'Parcialmente nublado'
  });
  useEffect(() => {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.current)
          setW({
            temperature: Math.round(d.current.temperature_2m),
            humidity: d.current.relative_humidity_2m,
            wind: Math.round(d.current.wind_speed_10m),
            desc: 'Condições atuais'
          });
      })
      .catch(() => {});
  }, [lat, lon]);
  return (
    <div className="weather-card">
      <div className="weather-top">
        <b>{property}</b>
        <i className="bi bi-chevron-down" />
      </div>
      <div className="weather-main">
        <div>
          <div className="weather-temp">{w.temperature}°</div>
          <span>{w.desc}</span>
        </div>
        <div className="weather-location">
          <i className="bi bi-geo-alt" /> Sua propriedade
        </div>
        <div className="weather-data">
          <span>
            <i className="bi bi-droplet" /> {w.humidity}%
          </span>
          <span>
            <i className="bi bi-wind" /> {w.wind} km/h
          </span>
        </div>
      </div>
    </div>
  );
}
