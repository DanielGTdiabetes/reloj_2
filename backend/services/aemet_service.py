"""
Servicio de datos AEMET
Radar de precipitaciones
"""
import aiohttp
from datetime import datetime, timedelta
from typing import Dict, List
from models.config import AemetConfig

class AemetService:
    def __init__(self):
        self.cache = {}
    
    async def get_radar_data(self, config: AemetConfig) -> Dict:
        """Obtener datos del radar AEMET"""
        if not config.api_key:
            # Sin API key, retornar datos simulados pero indicar que se necesita API key
            frames = []
            now = datetime.now()
            for i in range(config.frame_count):
                timestamp = now - timedelta(minutes=(config.frame_count - i - 1) * 10)
                # URL de ejemplo - en producción esto vendría de la API de AEMET
                frames.append({
                    "url": f"https://www.aemet.es/imagenes_d/eltiempo/observacion/radar/{timestamp.strftime('%Y%m%d%H%M')}.gif",
                    "timestamp": int(timestamp.timestamp() * 1000)
                })
            return {"frames": frames}
        
        # Con API key, hacer llamada real a AEMET
        # La API de AEMET requiere autenticación y tiene un formato específico
        # Por ahora retornamos un placeholder que indica que se necesita implementar
        # la integración completa con la API de AEMET
        
        url = "https://opendata.aemet.es/opendata/api/radar/nacional"
        headers = {"api_key": config.api_key}
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers) as response:
                    if response.status == 200:
                        data = await response.json()
                        # Procesar datos de AEMET según su formato
                        # Esto requiere conocimiento del formato específico de AEMET
                        frames = self._process_aemet_data(data, config)
                        return {"frames": frames}
                    else:
                        raise Exception(f"Error en AEMET API: {response.status}")
        except Exception as e:
            print(f"Error obteniendo datos de AEMET: {e}")
            # Fallback a datos simulados
            return await self._get_fallback_radar(config)
    
    def _process_aemet_data(self, data: Dict, config: AemetConfig) -> List[Dict]:
        """Procesar datos de AEMET (implementar según formato real)"""
        # TODO: Implementar procesamiento real de datos AEMET
        return []
    
    async def _get_fallback_radar(self, config: AemetConfig) -> Dict:
        """Datos de radar de fallback"""
        frames = []
        now = datetime.now()
        for i in range(config.frame_count):
            timestamp = now - timedelta(minutes=(config.frame_count - i - 1) * 10)
            frames.append({
                "url": f"https://www.aemet.es/imagenes_d/eltiempo/observacion/radar/{timestamp.strftime('%Y%m%d%H%M')}.gif",
                "timestamp": int(timestamp.timestamp() * 1000)
            })
        return {"frames": frames}

