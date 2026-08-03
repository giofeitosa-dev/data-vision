import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchCurrency } from '../services/api';
import type { CurrencyResponse } from '../types';
import { KpiCard } from './KpiCard';

const DAY_OPTIONS = [7, 30, 90];

export function CurrencySection() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<CurrencyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCurrency(days)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  const chartData = (data?.days ?? []).map((day) => ({
    date: day.date.slice(5),
    'USD → BRL': day.usdBid,
    'EUR → BRL': day.eurBid,
  }));

  const latest = data?.days[0];

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Câmbio</h2>
        <div className="day-selector" role="group" aria-label="Período">
          {DAY_OPTIONS.map((option) => (
            <button
              key={option}
              className={option === days ? 'active' : ''}
              onClick={() => setDays(option)}
            >
              {option} dias
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status">Carregando câmbio...</p>}
      {error && <p className="status error">{error}</p>}

      {data && !loading && !error && (
        <>
          <div className="kpi-grid">
            <KpiCard
              label="Dólar hoje"
              value={latest?.usdBid.toFixed(2) ?? '—'}
              unit={`R$ ${data.base}`}
            />
            <KpiCard
              label="Euro hoje"
              value={latest?.eurBid.toFixed(2) ?? '—'}
              unit={`R$ ${data.base}`}
            />
            <KpiCard label="Pontos da série" value={String(data.days.length)} />
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="USD → BRL"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="EUR → BRL"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
