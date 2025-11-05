"""
Servicio de datos de tormentas (rayos)
Integración con Blitzortung vía MQTT
"""
import asyncio
import json
import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
from typing import Dict, List
from models.config import StormConfig

class StormService:
    def __init__(self):
        self.strikes = []
        self.mqtt_client = None
        self.running = False
    
    async def get_storms(self, config: StormConfig) -> Dict:
        """Obtener datos de rayos"""
        if not config.enabled:
            return {"type": "FeatureCollection", "features": []}
        
        # Iniciar conexión MQTT si no está corriendo
        if not self.running:
            asyncio.create_task(self._connect_mqtt(config))
        
        # Filtrar rayos por TTL y radio
        now = datetime.now().timestamp() * 1000
        ttl_ms = config.ttl_seconds * 1000
        features = []
        
        center_lat = config.location.get("lat", 0) if config.location else 0
        center_lon = config.location.get("lon", 0) if config.location else 0
        
        for strike in self.strikes:
            # Filtrar por TTL
            age = now - strike.get("ts", 0)
            if age > ttl_ms:
                continue
            
            # Filtrar por radio si hay ubicación configurada
            if center_lat and center_lon:
                lon, lat = strike.get("coordinates", [0, 0])
                # Calcular distancia (simplificado)
                distance_km = ((lat - center_lat) ** 2 + (lon - center_lon) ** 2) ** 0.5 * 111
                if distance_km > config.max_radius_km:
                    continue
            
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": strike.get("coordinates", [0, 0])
                },
                "properties": {
                    "ts": strike.get("ts", now),
                    "amplitude": strike.get("amplitude", 0),
                    "station_count": strike.get("station_count", 0)
                }
            })
            
            if len(features) >= config.max_points:
                break
        
        return {"type": "FeatureCollection", "features": features}
    
    async def _connect_mqtt(self, config: StormConfig):
        """Conectar a MQTT para recibir datos de Blitzortung"""
        self.running = True
        
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                client.subscribe(config.topic)
                print(f"Conectado a MQTT, suscrito a {config.topic}")
            else:
                print(f"Error conectando a MQTT: {rc}")
        
        def on_message(client, userdata, msg):
            try:
                data = json.loads(msg.payload.decode())
                self._process_strike(data)
            except Exception as e:
                print(f"Error procesando mensaje MQTT: {e}")
        
        try:
            self.mqtt_client = mqtt.Client(client_id=config.mqtt.client_id)
            
            if config.mqtt.username and config.mqtt.password:
                self.mqtt_client.username_pw_set(
                    config.mqtt.username,
                    config.mqtt.password
                )
            
            self.mqtt_client.on_connect = on_connect
            self.mqtt_client.on_message = on_message
            
            self.mqtt_client.connect(
                config.mqtt.host,
                config.mqtt.port,
                60
            )
            
            self.mqtt_client.loop_start()
        except Exception as e:
            print(f"Error iniciando MQTT: {e}")
            self.running = False
    
    def _process_strike(self, data: Dict):
        """Procesar un rayo recibido"""
        # Formato depende de Blitzortung API
        # Ejemplo: {"lat": 39.98, "lon": -0.03, "time": 1234567890, "amplitude": 12345}
        strike = {
            "coordinates": [data.get("lon", 0), data.get("lat", 0)],
            "ts": data.get("time", datetime.now().timestamp()) * 1000,
            "amplitude": data.get("amplitude", 0),
            "station_count": data.get("station_count", 0)
        }
        
        self.strikes.append(strike)
        
        # Limpiar rayos antiguos
        now = datetime.now().timestamp() * 1000
        self.strikes = [s for s in self.strikes if now - s.get("ts", 0) < 600000]  # 10 minutos

