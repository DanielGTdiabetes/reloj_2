"""
Servicio de datos de barcos (AIS)
Integración con AIS Stream
"""
import asyncio
import json
import websockets
from datetime import datetime
from typing import Dict, List
from models.config import ShipsConfig

class ShipsService:
    def __init__(self):
        self.ships_data = {}
        self.websocket = None
        self.running = False
    
    async def get_ships(self, config: ShipsConfig) -> Dict:
        """Obtener datos de barcos"""
        if not config.enabled:
            return {"type": "FeatureCollection", "features": []}
        
        # Si no hay datos en cache, iniciar conexión WebSocket
        if not self.running:
            asyncio.create_task(self._connect_ais(config))
        
        # Retornar datos actuales
        features = []
        now = datetime.now().timestamp()
        
        for mmsi, ship in self.ships_data.items():
            # Filtrar por TTL
            if now - ship.get("ts", 0) > config.ttl_seconds:
                continue
            
            # Filtrar por bounding box
            lon, lat = ship.get("coordinates", [0, 0])
            if not (config.bbox[0] <= lon <= config.bbox[2] and 
                   config.bbox[1] <= lat <= config.bbox[3]):
                continue
            
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [lon, lat]
                },
                "properties": {
                    "name": ship.get("name", "Unknown"),
                    "mmsi": mmsi,
                    "sog": ship.get("sog", 0),  # Speed over ground
                    "cog": ship.get("cog", 0),  # Course over ground
                    "heading": ship.get("heading", 0),
                    "ts": ship.get("ts", now)
                }
            })
            
            if len(features) >= config.max_points:
                break
        
        return {"type": "FeatureCollection", "features": features}
    
    async def _connect_ais(self, config: ShipsConfig):
        """Conectar a AIS Stream WebSocket"""
        self.running = True
        try:
            import websockets
            auth_header = None
            if config.auth and config.auth.get("token"):
                auth_header = {"Authorization": f"Bearer {config.auth['token']}"}
            
            async with websockets.connect(
                config.ws_url,
                extra_headers=auth_header
            ) as websocket:
                # Enviar suscripción
                subscription = {
                    "BoundingBoxes": config.subscription.BoundingBoxes,
                    "FilterMessageTypes": config.subscription.FilterMessageTypes
                }
                await websocket.send(json.dumps(subscription))
                
                # Recibir mensajes
                async for message in websocket:
                    try:
                        data = json.loads(message)
                        self._process_ais_message(data)
                    except Exception as e:
                        print(f"Error procesando mensaje AIS: {e}")
        except Exception as e:
            print(f"Error conectando a AIS Stream: {e}")
            self.running = False
        finally:
            self.running = False
    
    def _process_ais_message(self, data: Dict):
        """Procesar mensaje AIS"""
        if "Message" in data and "PositionReport" in data["Message"]:
            msg = data["Message"]["PositionReport"]
            mmsi = str(msg.get("MessageId", ""))
            
            if mmsi:
                self.ships_data[mmsi] = {
                    "name": msg.get("VesselName", "Unknown"),
                    "coordinates": [msg.get("Longitude", 0), msg.get("Latitude", 0)],
                    "sog": msg.get("Sog", 0),
                    "cog": msg.get("Cog", 0),
                    "heading": msg.get("TrueHeading", 0),
                    "ts": datetime.now().timestamp()
                }

