import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchMovies } from '../services/api';
import type { MovieSummary } from '../types';

const TOP_N = 10;

export function MoviesSection() {
  const [popular, setPopular] = useState<MovieSummary[]>([]);
  const [topRated, setTopRated] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([fetchMovies('popular'), fetchMovies('top_rated')])
      .then(([pop, rated]) => {
        if (!cancelled) {
          setPopular(pop);
          setTopRated(rated);
        }
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
  }, []);

  const toChart = (movies: MovieSummary[]) =>
    movies.slice(0, TOP_N).map((movie) => ({
      name: movie.title.length > 18 ? movie.title.slice(0, 17) + '…' : movie.title,
      Nota: Number(movie.voteAverage.toFixed(1)),
    }));

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Filmes</h2>
      </div>

      {loading && <p className="status">Carregando filmes...</p>}
      {error && (
        <p className="status error">
          {error.includes('TMDB_API_KEY')
            ? 'Filmes indisponíveis: configure a chave TMDB (veja a seção "API key do TMDB" no README).'
            : error}
        </p>
      )}

      {!loading && !error && (
        <div className="movies-grid">
          <div className="chart">
            <p className="panel-subtitle">Mais populares (nota média)</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toChart(popular)}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" interval={0} angle={-30} textAnchor="end" height={90} />
                <YAxis stroke="#94a3b8" domain={[0, 10]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
                <Bar dataKey="Nota" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart">
            <p className="panel-subtitle">Melhor avaliados (nota média)</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toChart(topRated)}>
                <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#94a3b8" interval={0} angle={-30} textAnchor="end" height={90} />
                <YAxis stroke="#94a3b8" domain={[0, 10]} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569' }} />
                <Bar dataKey="Nota" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}
