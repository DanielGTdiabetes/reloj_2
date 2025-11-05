"""
Servicio de gestión de configuración
Persiste la configuración en un archivo JSON
"""
import json
import os
from pathlib import Path
from typing import Dict, Any

from models.config import AppConfig, get_default_config

# Importar servicios para pruebas reales
from services.weather_service import WeatherService
from services.aemet_service import AemetService
from services.ships_service import ShipsService
from services.flights_service import FlightsService
from services.storm_service import StormService
from services.news_service import NewsService
from services.astronomy_service import AstronomyService
from services.ephemerides_service import EphemeridesService


class ConfigService:
    def __init__(self, config_file: str = "config.json"):
        self.config_file = Path(config_file)
        self._config: AppConfig = None
        self.load_config()

    def load_config(self):
        """Cargar configuración desde archivo o usar defaults"""
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self._config = AppConfig(**data)
            except Exception as e:
                print(f"Error cargando configuración: {e}, usando defaults")
                self._config = get_default_config()
                self.save_config()
        else:
            self._config = get_default_config()
            self.save_config()

    def save_config(self):
        """Guardar configuración en archivo"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self._config.model_dump(), f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error guardando configuración: {e}")

    def get_config(self) -> AppConfig:
        """Obtener configuración actual"""
        return self._config

    def get_config_dict(self) -> Dict[str, Any]:
        """Obtener configuración como diccionario (para JSON)"""
        return self._config.model_dump()

    def update_group(self, group_name: str, data: Dict[str, Any]):
        """Actualizar un grupo de configuración"""
        if not hasattr(self._config, group_name):
            raise ValueError(f"Grupo de configuración '{group_name}' no existe")

        current_group = getattr(self._config, group_name)
        group_class = type(current_group)
        updated_data = current_group.model_dump()
        updated_data.update(data)
        
        # Re-crear el objeto de configuración para el grupo para validación Pydantic
        new_group_config = group_class(**updated_data)
        setattr(self._config, group_name, new_group_config)

        self.save_config()

    async def test_group(self, group_name: str) -> Dict[str, Any]:
        """Probar configuración de un grupo con llamadas reales"""
        config = self.get_config()
        
        try:
            if group_name == "weather":
                service = WeatherService()
                result = await service.get_weather(config.weather)
                if result and result.get('current'):
                    return {"ok": True, "message": f"API de tiempo OK. Temp: {result['current']['temperature']:.1f}°C"}
                return {"ok": False, "message": "Respuesta de API de tiempo inesperada."}

            elif group_name == "aemet":
                service = AemetService()
                result = await service.get_radar_data(config.aemet)
                if result and result.get('url'):
                    return {"ok": True, "message": "API de AEMET OK. URL obtenida."}
                return {"ok": False, "message": "No se pudo obtener la URL del radar de AEMET."}

            elif group_name == "ships":
                if not config.ships.enabled:
                    return {"ok": True, "message": "Servicio deshabilitado."}
                service = ShipsService()
                result = await service.get_ships(config.ships)
                if result and isinstance(result.get('features'), list):
                    return {"ok": True, "message": f"API de barcos OK. {len(result['features'])} barcos encontrados."}
                return {"ok": False, "message": "Respuesta de API de barcos inesperada."}

            elif group_name == "flights":
                if not config.flights.enabled:
                    return {"ok": True, "message": "Servicio deshabilitado."}
                service = FlightsService()
                result = await service.get_flights(config.flights)
                if result and isinstance(result.get('features'), list):
                    return {"ok": True, "message": f"API de vuelos OK. {len(result['features'])} vuelos encontrados."}
                return {"ok": False, "message": "Respuesta de API de vuelos inesperada."}
                
            elif group_name == "storm":
                if not config.storm.enabled:
                    return {"ok": True, "message": "Servicio deshabilitado."}
                service = StormService()
                # Esta prueba intentará conectar al broker MQTT y fallará si hay un error.
                await service.get_storms(config.storm)
                return {"ok": True, "message": "Conexión a servicio de tormentas OK."}
            
            elif group_name == "news":
                if not config.news.enabled:
                    return {"ok": True, "message": "Servicio deshabilitado."}
                service = NewsService()
                result = await service.get_news(config.news)
                if result and isinstance(result, list):
                    return {"ok": True, "message": f"API de noticias OK. {len(result)} noticias obtenidas."}
                return {"ok": False, "message": "No se pudieron obtener noticias."}
                
            elif group_name == "astronomy":
                service = AstronomyService()
                result = await service.get_astronomy(config.astronomy)
                if result and result.get('moon_phase'):
                    return {"ok": True, "message": f"API de astronomía OK. Fase lunar: {result['moon_phase']}"}
                return {"ok": False, "message": "Respuesta de API de astronomía inesperada."}

            elif group_name == "ephemerides":
                service = EphemeridesService()
                result = await service.get_ephemerides(config.ephemerides)
                if result and isinstance(result.get('events'), list):
                     return {"ok": True, "message": f"API de efemérides OK. {len(result['events'])} eventos encontrados."}
                return {"ok": False, "message": "No se pudieron obtener las efemérides."}

            else:
                return {"ok": True, "message": "Configuración válida (sin prueba específica)"}

        except Exception as e:
            print(f"Error en prueba de {group_name}: {e}")
            return {"ok": False, "message": f"Error en la prueba: {str(e)}"}
