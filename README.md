# DataVision

Dashboard interativo que consome APIs públicas (clima, câmbio e filmes) e apresenta os dados em gráficos dinâmicos.

**Stack:** React + TypeScript + Vite + Recharts (frontend) · Spring Boot 4 / Java 21 (backend)

## Estrutura

```
data-vision/
├── backend/    # Spring Boot — proxy e agregação das APIs externas
└── frontend/   # React + Vite — dashboard com Recharts
```

## Como rodar

### 1. Backend (porta 8080)

```bash
cd backend
mvnw spring-boot:run
```

> No Windows, se a execução de scripts `.ps1` estiver bloqueada, use `mvnw.cmd`.

Endpoints:
- `GET /api/weather?city=São Paulo` — previsão de 7 dias (Open-Meteo)
- `GET /api/currency?days=30` — série USD/EUR → BRL (AwesomeAPI)
- `GET /api/movies/popular` e `GET /api/movies/top_rated` — filmes (TMDB)

### 2. Frontend (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173`.

### API key do TMDB (opcional)

A seção de filmes usa a [TMDB API](https://developer.themoviedb.org) (grátis, requer cadastro).
Sem a chave, as outras seções funcionam normalmente e a de filmes exibe um aviso.

Defina a variável de ambiente antes de iniciar o backend:

```bash
# Windows PowerShell
$env:TMDB_API_KEY = "sua-chave-aqui"

# Linux/macOS
export TMDB_API_KEY="sua-chave-aqui"
```

## APIs consumidas

| Dados | API | Chave |
|---|---|---|
| Clima | [Open-Meteo](https://open-meteo.com) | Não |
| Câmbio | [AwesomeAPI](https://economia.awesomeapi.com.br) | Não |
| Filmes | [TMDB](https://developer.themoviedb.org) | Sim (grátis) |

## Habilidades demonstradas

- Consumo de APIs externas via `RestClient` (Spring Boot) com tratamento de erro e agregação de dados
- Visualização interativa com Recharts (área, linha e barras)
- Separação frontend/backend com CORS configurado e API keys mantidas fora do código
- Estados de carregamento/erro em cada seção do dashboard
