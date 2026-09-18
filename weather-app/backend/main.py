from typing import Optional

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database import init_db, get_conn

app = FastAPI(title="Atmos Weather API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# WMO weather codes -> (label, icon key)
WEATHER_CODES = {
    0: ("Clear sky", "clear"),
    1: ("Mainly clear", "clear"),
    2: ("Partly cloudy", "cloudy"),
    3: ("Overcast", "cloudy"),
    45: ("Fog", "fog"),
    48: ("Depositing rime fog", "fog"),
    51: ("Light drizzle", "drizzle"),
    53: ("Moderate drizzle", "drizzle"),
    55: ("Dense drizzle", "drizzle"),
    56: ("Light freezing drizzle", "drizzle"),
    57: ("Dense freezing drizzle", "drizzle"),
    61: ("Slight rain", "rain"),
    63: ("Moderate rain", "rain"),
    65: ("Heavy rain", "rain"),
    66: ("Light freezing rain", "rain"),
    67: ("Heavy freezing rain", "rain"),
    71: ("Slight snow", "snow"),
    73: ("Moderate snow", "snow"),
    75: ("Heavy snow", "snow"),
    77: ("Snow grains", "snow"),
    80: ("Slight rain showers", "rain"),
    81: ("Moderate rain showers", "rain"),
    82: ("Violent rain showers", "rain"),
    85: ("Slight snow showers", "snow"),
    86: ("Heavy snow showers", "snow"),
    95: ("Thunderstorm", "storm"),
    96: ("Thunderstorm with hail", "storm"),
    99: ("Thunderstorm with heavy hail", "storm"),
}


def describe_code(code: int):
    label, icon = WEATHER_CODES.get(code, ("Unknown", "cloudy"))
    return {"code": code, "label": label, "icon": icon}


@app.on_event("startup")
def startup():
    init_db()


class FavoriteIn(BaseModel):
    city: str
    country: Optional[str] = None
    latitude: float
    longitude: float


class HistoryIn(BaseModel):
    city: str
    country: Optional[str] = None
    latitude: float
    longitude: float


@app.get("/api/geocode")
async def geocode(q: str):
    async with httpx.AsyncClient() as client:
        r = await client.get(GEOCODE_URL, params={"name": q, "count": 5, "language": "en", "format": "json"})
        r.raise_for_status()
        data = r.json()
    results = data.get("results") or []
    return [
        {
            "city": item["name"],
            "country": item.get("country"),
            "admin1": item.get("admin1"),
            "latitude": item["latitude"],
            "longitude": item["longitude"],
        }
        for item in results
    ]


@app.get("/api/weather")
async def weather(latitude: float, longitude: float, city: Optional[str] = None, country: Optional[str] = None):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,"
                   "weather_code,wind_speed_10m,wind_direction_10m,surface_pressure",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max",
        "timezone": "auto",
        "forecast_days": 6,
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(FORECAST_URL, params=params)
        if r.status_code != 200:
            raise HTTPException(status_code=502, detail="Upstream weather provider error")
        data = r.json()

    current = data["current"]
    daily = data["daily"]

    forecast = []
    for i in range(len(daily["time"])):
        forecast.append({
            "date": daily["time"][i],
            "temp_max": daily["temperature_2m_max"][i],
            "temp_min": daily["temperature_2m_min"][i],
            "precipitation_probability": daily["precipitation_probability_max"][i],
            "wind_speed_max": daily["wind_speed_10m_max"][i],
            "weather": describe_code(daily["weather_code"][i]),
        })

    result = {
        "location": {"city": city, "country": country, "latitude": latitude, "longitude": longitude},
        "timezone": data.get("timezone"),
        "current": {
            "temperature": current["temperature_2m"],
            "apparent_temperature": current["apparent_temperature"],
            "humidity": current["relative_humidity_2m"],
            "is_day": bool(current["is_day"]),
            "precipitation": current["precipitation"],
            "wind_speed": current["wind_speed_10m"],
            "wind_direction": current["wind_direction_10m"],
            "pressure": current["surface_pressure"],
            "weather": describe_code(current["weather_code"]),
        },
        "forecast": forecast,
    }

    if city:
        with get_conn() as conn:
            conn.execute(
                "INSERT INTO history (city, country, latitude, longitude) VALUES (?, ?, ?, ?)",
                (city, country, latitude, longitude),
            )
            conn.commit()

    return result


@app.get("/api/history")
def get_history():
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT * FROM history ORDER BY searched_at DESC LIMIT 10"
        ).fetchall()
        return [dict(row) for row in rows]


@app.delete("/api/history")
def clear_history():
    with get_conn() as conn:
        conn.execute("DELETE FROM history")
        conn.commit()
    return {"ok": True}


@app.get("/api/favorites")
def get_favorites():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM favorites ORDER BY added_at DESC").fetchall()
        return [dict(row) for row in rows]


@app.post("/api/favorites")
def add_favorite(fav: FavoriteIn):
    with get_conn() as conn:
        try:
            conn.execute(
                "INSERT INTO favorites (city, country, latitude, longitude) VALUES (?, ?, ?, ?)",
                (fav.city, fav.country, fav.latitude, fav.longitude),
            )
            conn.commit()
        except Exception:
            raise HTTPException(status_code=409, detail="Already in favorites")
    return {"ok": True}


@app.delete("/api/favorites/{fav_id}")
def remove_favorite(fav_id: int):
    with get_conn() as conn:
        conn.execute("DELETE FROM favorites WHERE id = ?", (fav_id,))
        conn.commit()
    return {"ok": True}
