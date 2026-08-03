import { WeatherSection } from './components/WeatherSection';

function App() {
  return (
    <>
      <header className="app-header">
        <h1>DataVision</h1>
        <p>Dashboard de dados públicos: clima, câmbio e filmes</p>
      </header>
      <main className="dashboard">
        <WeatherSection />
      </main>
      <footer className="app-footer">
        React + Recharts · Spring Boot · APIs públicas (Open-Meteo, AwesomeAPI, TMDB)
      </footer>
    </>
  );
}

export default App;
