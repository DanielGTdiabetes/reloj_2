"""
Modelos de configuración usando Pydantic
"""
from typing import List, Optional, Literal
from pydantic import BaseModel

class SystemConfig(BaseModel):
    timezone: str = "Europe/Madrid"

class MapConfig(BaseModel):
    provider: Literal["MapTiler", "OSM"] = "MapTiler"
    style: str = "https://demotiles.maplibre.org/style.json"
    center: List[float] = [-0.038, 39.986]
    zoom_min: int = 6
    zoom_max: int = 12

class AemetConfig(BaseModel):
    api_key: str = ""
    opacity: float = 0.7
    animation_speed: float = 1.0
    frame_count: int = 6
    cache_ttl: int = 600

class WeatherConfig(BaseModel):
    provider: Literal["Open-Meteo", "OpenWeatherMap"] = "Open-Meteo"
    api_key: Optional[str] = None
    units: Literal["metric", "imperial"] = "metric"
    language: Literal["es", "en"] = "es"
    location: dict = {"latitude": 39.98, "longitude": -0.03}

class NewsSource(BaseModel):
    name: str
    url: str

class NewsConfig(BaseModel):
    sources: List[NewsSource] = [NewsSource(name="El País", url="https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada")]

class AstronomyConfig(BaseModel):
    location: dict = {"latitude": 39.98, "longitude": -0.03, "elevation": 30}

class EphemeridesConfig(BaseModel):
    language: Literal["es", "en"] = "es"

class CalendarConfig(BaseModel):
    ics_filename: Optional[str] = None

class StormMQTTConfig(BaseModel):
    host: str = "127.0.0.1"
    port: int = 1883
    username: Optional[str] = None
    password: Optional[str] = None
    client_id: str = "pantalla-reloj-storm"

class StormConfig(BaseModel):
    enabled: bool = True
    mqtt: StormMQTTConfig = StormMQTTConfig()
    topic: str = "blitzortung/lightning"
    ttl_seconds: int = 600
    max_points: int = 3000
    max_radius_km: int = 80
    location: Optional[dict] = None

class ShipsSubscription(BaseModel):
    BoundingBoxes: List[List[float]] = [[-1.0, 38.0, 1.5, 41.0]]
    FilterMessageTypes: List[str] = ["PositionReport"]

class ShipsConfig(BaseModel):
    enabled: bool = True
    provider: Literal["aisstream"] = "aisstream"
    bbox: List[float] = [-1.0, 38.0, 1.5, 41.0]
    ttl_seconds: int = 120
    max_points: int = 2000
    ws_url: str = "wss://stream.aisstream.io/v0/stream"
    subscription: ShipsSubscription = ShipsSubscription()
    auth: Optional[dict] = None

class FlightsConfig(BaseModel):
    enabled: bool = True
    provider: Literal["opensky"] = "opensky"
    bbox: List[float] = [-1.0, 38.0, 1.5, 41.0]
    ttl_seconds: int = 30
    client_id: str = ""
    client_secret: str = ""

class WifiConfig(BaseModel):
    interface: str = "wlp2s0"

class DebugConfig(BaseModel):
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

class AppConfig(BaseModel):
    system: SystemConfig = SystemConfig()
    map: MapConfig = MapConfig()
    aemet: AemetConfig = AemetConfig()
    weather: WeatherConfig = WeatherConfig()
    news: NewsConfig = NewsConfig()
    astronomy: AstronomyConfig = AstronomyConfig()
    ephemerides: EphemeridesConfig = EphemeridesConfig()
    calendar: CalendarConfig = CalendarConfig()
    storm: StormConfig = StormConfig()
    ships: ShipsConfig = ShipsConfig()
    flights: FlightsConfig = FlightsConfig()
    wifi: WifiConfig = WifiConfig()
    debug: DebugConfig = DebugConfig()

def get_default_config() -> AppConfig:
    """Retornar configuración por defecto"""
    return AppConfig()

