import type { CurrencyResponse, MovieSummary, WeatherResponse } from '../types';

const BASE_URL = 'http://localhost:8080/api';

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Erro ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function fetchWeather(city: string): Promise<WeatherResponse> {
  return getJson<WeatherResponse>(`${BASE_URL}/weather?city=${encodeURIComponent(city)}`);
}

export function fetchCurrency(days: number): Promise<CurrencyResponse> {
  return getJson<CurrencyResponse>(`${BASE_URL}/currency?days=${days}`);
}

export function fetchMovies(category: 'popular' | 'top_rated'): Promise<MovieSummary[]> {
  return getJson<MovieSummary[]>(`${BASE_URL}/movies/${category}`);
}
