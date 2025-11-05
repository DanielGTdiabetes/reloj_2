"""
Servicio de datos de aviones
Integración con OpenSky Network
"""
import aiohttp
from datetime import datetime
from typing import Dict
from models.config import FlightsConfig

class FlightsService:
    def __init__(self):
        self.cache = {}
        self.cache_ttl = 30  # 30 segundos
    
    async def get_flights(self, config: FlightsConfig) -> Dict:
        """Obtener datos de aviones"""
        if not config.enabled:
            return {"type": "FeatureCollection", "features": []}
        
        # OpenSky Network API
        url = "https://opensky-network.org/api/states/all"
        params = {
            "lamin": config.bbox[1],
            "lamax": config.bbox[3],
            "lomin": config.bbox[0],
            "lomax": config.bbox[2]
        }
        
        # Si hay credenciales, usarlas
        auth = None
        if config.client_id and config.client_secret:
            auth = aiohttp.BasicAuth(config.client_id, config.client_secret)
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, auth=auth) as response:
                    if response.status == 200:
                        data = await response.json()
                        return self._process_opensky_data(data, config)
                    else:
                        raise Exception(f"Error en OpenSky: {response.status}")
        except Exception as e:
            print(f"Error obteniendo datos de aviones: {e}")
            return {"type": "FeatureCollection", "features": []}
    
    def _process_opensky_data(self, data: Dict, config: FlightsConfig) -> Dict:
        """Procesar datos de OpenSky"""
        features = []
        now = datetime.now().timestamp()
        
        if "states" in data:
            for state in data["states"]:
                if not state or len(state) < 17:
                    continue
                
                # Formato OpenSky: [icao24, callsign, origin_country, time_position, last_contact, 
                #                  longitude, latitude, baro_altitude, on_ground, velocity, 
                #                  true_track, vertical_rate, sensors, geo_altitude, squawk, 
                #                  spi, position_source]
                
                icao24 = state[0]
                callsign = (state[1] or "").strip()
                country = state[2]
                lon = state[5]
                lat = state[6]
                alt = state[7] or state[13] or 0  # baro_altitude o geo_altitude
                vel = state[9] or 0
                heading = state[10] or 0
                
                if lon and lat:
                    features.append({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [lon, lat]
                        },
                        "properties": {
                            "icao24": icao24,
                            "callsign": callsign,
                            "lat": lat,
                            "lon": lon,
                            "alt": alt,
                            "vel": vel,
                            "head": heading,
                            "country": country,
                            "ts": now
                        }
                    })
                
                if len(features) >= 1000:  # Limitar resultados
                    break
        
        return {"type": "FeatureCollection", "features": features}

