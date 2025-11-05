"""
Backend principal para Pantalla Reloj Dashboard
FastAPI con integraciones reales a APIs externas
"""
import os
import json
import hashlib
import psutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn

from services.config_service import ConfigService
from services.weather_service import WeatherService
from services.aemet_service import AemetService
from services.ships_service import ShipsService
from services.flights_service import FlightsService
from services.storm_service import StormService
from services.news_service import NewsService
from services.ephemerides_service import EphemeridesService
from services.santoral_service import SantoralService
from services.astronomy_service import AstronomyService
from services.seasonal_service import SeasonalService
from services.calendar_service import CalendarService
from services.wifi_service import WifiService
from services.health_service import HealthService

app = FastAPI(title="Pantalla Reloj Dashboard API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servicios
config_service = ConfigService()
weather_service = WeatherService()
aemet_service = AemetService()
ships_service = ShipsService()
flights_service = FlightsService()
storm_service = StormService()
news_service = NewsService()
ephemerides_service = EphemeridesService()
santoral_service = SantoralService()
astronomy_service = AstronomyService()
seasonal_service = SeasonalService()
calendar_service = CalendarService()
wifi_service = WifiService()
health_service = HealthService()

# Montar archivos estáticos del frontend (después de build)
if Path("frontend/dist").exists():
    app.mount("/static", StaticFiles(directory="frontend/dist"), name="static")
    @app.get("/")
    async def read_root():
        return FileResponse("frontend/dist/index.html")

# API Routes
@app.get("/api/config")
async def get_config():
    """Obtener configuración completa"""
    return config_service.get_config_dict()

@app.post("/api/config/{group_name}")
async def update_config_group(group_name: str, data: dict):
    """Actualizar un grupo de configuración"""
    try:
        config_service.update_group(group_name, data)
        return {"ok": True, "message": f"Configuración de {group_name} guardada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/config/{group_name}/test")
async def test_config_group(group_name: str):
    """Probar configuración de un grupo"""
    try:
        result = await config_service.test_group(group_name)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/health")
async def health():
    """Health check del sistema"""
    return await health_service.get_health()

@app.get("/api/weather")
async def get_weather():
    """Obtener datos meteorológicos"""
    config = config_service.get_config()
    return await weather_service.get_weather(config.weather)

@app.get("/api/aemet/radar")
async def get_aemet_radar():
    """Obtener datos del radar AEMET"""
    config = config_service.get_config()
    return await aemet_service.get_radar_data(config.aemet)

@app.get("/api/ships")
async def get_ships():
    """Obtener datos de barcos (AIS)"""
    config = config_service.get_config()
    if not config.ships.enabled:
        return {"type": "FeatureCollection", "features": []}
    return await ships_service.get_ships(config.ships)

@app.get("/api/flights")
async def get_flights():
    """Obtener datos de aviones"""
    config = config_service.get_config()
    if not config.flights.enabled:
        return {"type": "FeatureCollection", "features": []}
    return await flights_service.get_flights(config.flights)

@app.get("/api/storms")
async def get_storms():
    """Obtener datos de tormentas (rayos)"""
    config = config_service.get_config()
    if not config.storm.enabled:
        return {"type": "FeatureCollection", "features": []}
    return await storm_service.get_storms(config.storm)

@app.get("/api/news")
async def get_news():
    """Obtener noticias"""
    config = config_service.get_config()
    return await news_service.get_news(config.news)

@app.get("/api/ephemerides")
async def get_ephemerides():
    """Obtener efemérides del día"""
    config = config_service.get_config()
    return await ephemerides_service.get_ephemerides(config.ephemerides)

@app.get("/api/santoral")
async def get_santoral():
    """Obtener santoral del día"""
    return await santoral_service.get_santoral()

@app.get("/api/astronomy")
async def get_astronomy():
    """Obtener datos astronómicos"""
    config = config_service.get_config()
    return await astronomy_service.get_astronomy(config.astronomy)

@app.get("/api/seasonal")
async def get_seasonal():
    """Obtener productos de temporada"""
    return await seasonal_service.get_seasonal()

@app.get("/api/calendar")
async def get_calendar():
    """Obtener eventos del calendario"""
    config = config_service.get_config()
    return await calendar_service.get_events(config.calendar)

@app.post("/api/calendar/upload")
async def upload_calendar(file: UploadFile = File(...)):
    """Subir archivo ICS de calendario"""
    try:
        content = await file.read()
        result = await calendar_service.upload_ics(file.filename, content)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/wifi/scan")
async def scan_wifi():
    """Escanear redes Wi-Fi"""
    config = config_service.get_config()
    return await wifi_service.scan_networks(config.wifi)

@app.post("/api/wifi/connect")
async def connect_wifi(data: dict):
    """Conectar a una red Wi-Fi"""
    config = config_service.get_config()
    return await wifi_service.connect_network(config.wifi, data.get("ssid"), data.get("password"))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081, log_level="info")

