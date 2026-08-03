import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchWeather } from '../services/api';
import type { WeatherResponse } from '../types';
import { KpiCard } from './KpiCard';

const DEFAULT_CITY = 'São Paulo';

export function WeatherSection() {
  const [city, setCity] = useState(DEFAULT_CITY);
  const [input, setInput] = useState(DEFAULT_CITY);
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather(city)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message === 'Erro 400' ? 'Cidade não encontrada.' : err.message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  const chartData = (data?.daily ?? []).map((day) => ({
    date: day.date.slice(5),
    min: day.minTemperature,
    max: day.maxTemperature,
  }));

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Clima</h2>
        <form
          className="city-form"
          onSubmit={(event) => {
            event.preventDefault();
            setCity(input.trim());
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Digite uma cidade"
            aria-label="Cidade"
          />
          <button type="submit">Buscar</button>
        </form>
      </div>

      {loading && <p className="status">Carregando previsão...</p>}
      {error && <p className="status error">{error}</p>}

      {data && !loading && !error && (
        <>
          <p className="panel-subtitle">
            {data.city} · {data.country}
          </p>
          <div className="kpi-grid">
            <KpiCard label="Temperatura" value={data.current.temperature.toFixed(1)} unit="°C" />
            <KpiCard label="Sensação" value={data.current.feelsLike.toFixed(1)} unit="°C" />
            <KpiCard label="Umidade" value={data.current.humidity.toFixed(0)} unit="%" />
            <KpiCard label="Vento" value={data.current.windSpeed.toFixed(1)} unit="km/h" />
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradMax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gradMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" unit="°C" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
                <Area
                  type="monotone"
                  dataKey="max"
                  name="Máx"
                  stroke="#f97316"
                  fill="url(#gradMax)"
                />
                <Area
                  type="monotone"
                  dataKey="min"
                  name="Mín"
                  stroke="#38bdf8"
                  fill="url(#gradMin)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
