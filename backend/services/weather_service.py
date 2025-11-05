"""
Servicio de datos meteorológicos
Integración con Open-Meteo o OpenWeatherMap
"""
import aiohttp
from typing import Dict
from models.config import WeatherConfig

class WeatherService:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 300  # 5 minutos
    
    async def get_weather(self, config: WeatherConfig) -> Dict:
        """Obtener datos meteorológicos"""
        if config.provider == "Open-Meteo":
            return await self._get_openmeteo(config)
        elif config.provider == "OpenWeatherMap":
            return await self._get_openweathermap(config)
        else:
            raise ValueError(f"Proveedor desconocido: {config.provider}")
    
    async def _get_openmeteo(self, config: WeatherConfig) -> Dict:
        """Obtener datos de Open-Meteo"""
        lat = config.location["latitude"]
        lon = config.location["longitude"]
        lang = config.language
        units = "celsius" if config.units == "metric" else "fahrenheit"
        wind_speed_unit = "kmh" if config.units == "metric" else "mph"
        
        url = f"https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m",
            "hourly": "temperature_2m,weather_code",
            "timezone": "auto",
            "forecast_days": 1,
            "wind_speed_unit": wind_speed_unit
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    current = data["current"]
                    hourly = data["hourly"]
                    
                    # Mapear weather_code a icono y descripción
                    weather_code = current["weather_code"]
                    icon, description = self._map_weather_code(weather_code, lang)
                    
                    # Pronóstico para próximas horas
                    forecast = []
                    for i in range(3):
                        if i < len(hourly["time"]):
                            time_str = hourly["time"][i]
                            hour = time_str.split("T")[1].split(":")[0]
                            forecast.append({
                                "time": f"{hour}:00",
                                "temperature": hourly["temperature_2m"][i]
                            })
                    
                    return {
                        "temperature": current["temperature_2m"],
                        "feels_like": current["apparent_temperature"],
                        "wind_speed": current["wind_speed_10m"],
                        "wind_direction": current["wind_direction_10m"],
                        "cloud_cover": current["cloud_cover"],
                        "icon": icon,
                        "description": description,
                        "forecast": forecast
                    }
                else:
                    raise Exception(f"Error en Open-Meteo: {response.status}")
    
    async def _get_openweathermap(self, config: WeatherConfig) -> Dict:
        """Obtener datos de OpenWeatherMap"""
        if not config.api_key:
            raise ValueError("OpenWeatherMap requiere API key")
        
        lat = config.location["latitude"]
        lon = config.location["longitude"]
        units = "metric" if config.units == "metric" else "imperial"
        lang = config.language
        
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            "lat": lat,
            "lon": lon,
            "appid": config.api_key,
            "units": units,
            "lang": lang
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                if response.status == 200:
                    data = await response.json()
                    weather = data["weather"][0]
                    
                    return {
                        "temperature": data["main"]["temp"],
                        "feels_like": data["main"]["feels_like"],
                        "wind_speed": data["wind"]["speed"],
                        "wind_direction": data["wind"].get("deg", 0),
                        "cloud_cover": data["clouds"]["all"],
                        "icon": weather["icon"],
                        "description": weather["description"].capitalize(),
                        "forecast": []  # Requerir llamada adicional para pronóstico
                    }
                else:
                    raise Exception(f"Error en OpenWeatherMap: {response.status}")
    
    def _map_weather_code(self, code: int, lang: str) -> tuple:
        """Mapear código WMO a icono y descripción"""
        mapping = {
            0: ("clear-day", "Despejado" if lang == "es" else "Clear"),
            1: ("partly-cloudy-day", "Mayormente despejado" if lang == "es" else "Mainly clear"),
            2: ("partly-cloudy-day", "Parcialmente nublado" if lang == "es" else "Partly cloudy"),
            3: ("cloudy", "Nublado" if lang == "es" else "Overcast"),
            45: ("cloudy", "Niebla" if lang == "es" else "Fog"),
            48: ("cloudy", "Niebla helada" if lang == "es" else "Depositing rime fog"),
            51: ("rain", "Lluvia ligera" if lang == "es" else "Light drizzle"),
            53: ("rain", "Lluvia moderada" if lang == "es" else "Moderate drizzle"),
            55: ("rain", "Lluvia intensa" if lang == "es" else "Dense drizzle"),
            61: ("rain", "Lluvia ligera" if lang == "es" else "Slight rain"),
            63: ("rain", "Lluvia moderada" if lang == "es" else "Moderate rain"),
            65: ("rain", "Lluvia intensa" if lang == "es" else "Heavy rain"),
            71: ("rain", "Nieve ligera" if lang == "es" else "Slight snow"),
            73: ("rain", "Nieve moderada" if lang == "es" else "Moderate snow"),
            75: ("rain", "Nieve intensa" if lang == "es" else "Heavy snow"),
            80: ("rain", "Chubascos ligeros" if lang == "es" else "Slight rain showers"),
            81: ("rain", "Chubascos moderados" if lang == "es" else "Moderate rain showers"),
            82: ("rain", "Chubascos intensos" if lang == "es" else "Violent rain showers"),
            85: ("rain", "Chubascos de nieve ligeros" if lang == "es" else "Slight snow showers"),
            86: ("rain", "Chubascos de nieve intensos" if lang == "es" else "Heavy snow showers"),
            95: ("rain", "Tormenta" if lang == "es" else "Thunderstorm"),
            96: ("rain", "Tormenta con granizo" if lang == "es" else "Thunderstorm with hail"),
        }
        return mapping.get(code, ("cloudy", "Desconocido" if lang == "es" else "Unknown"))

