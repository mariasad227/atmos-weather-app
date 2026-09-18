# Atmos — Full Stack Weather App

A weather app with a React frontend and a FastAPI backend. Weather and geocoding
data comes from [Open-Meteo](https://open-meteo.com/) (free, no API key required).
Search history and favorites are stored server-side in SQLite.

## Structure

```
weather-app/
├── backend/          FastAPI app
│   ├── main.py        API routes (weather, geocode, history, favorites)
│   ├── database.py     SQLite setup
│   └── requirements.txt
└── frontend/         React app (Vite)
    └── src/
        ├── App.jsx
        ├── api.js
        └── components/
```

## Run the backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. A `weather.db` SQLite file is
created automatically on first run.

## Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to
the backend on port 8000 (see `vite.config.js`), so no CORS setup is needed in dev.

## Building for production

```bash
cd frontend
npm run build
```

This outputs static files to `frontend/dist`, which you can serve with any
static host or point the FastAPI app to serve directly.

## API endpoints

| Method | Path                    | Description                          |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/geocode?q=`       | Search cities by name                 |
| GET    | `/api/weather?latitude=&longitude=&city=&country=` | Current conditions + 6-day forecast |
| GET    | `/api/history`          | Last 10 searches                      |
| DELETE | `/api/history`          | Clear search history                  |
| GET    | `/api/favorites`        | List favorites                        |
| POST   | `/api/favorites`        | Add a favorite (`{city, country, latitude, longitude}`) |
| DELETE | `/api/favorites/{id}`   | Remove a favorite                     |

## Notes

- No API key needed — Open-Meteo's endpoints are free and public.
- Every successful weather lookup by city is logged to search history automatically.
- The wind dial, temperature readout, and instrument-style layout are the
  visual signature of the design — built around a "weather station" theme
  rather than cartoon icon sets.
