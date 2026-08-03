export interface WeatherResponse {
  city: string;
  country: string;
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    weatherCode: string;
  };
  daily: Array<{
    date: string;
    maxTemperature: number;
    minTemperature: number;
    precipitationProbability: number;
  }>;
}

export interface CurrencyResponse {
  base: string;
  days: Array<{
    date: string;
    usdBid: number;
    eurBid: number;
  }>;
}

export interface MovieSummary {
  title: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
}
