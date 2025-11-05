"""
Servicio de salud del sistema
Health check y estadísticas
"""
import psutil
import hashlib
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict

class HealthService:
    def __init__(self, config_file: str = "config.json"):
        self.config_file = Path(config_file)
        self.start_time = datetime.now()
    
    async def get_health(self) -> Dict:
        """Obtener estado de salud del sistema"""
        # CPU y memoria
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        memory_percent = memory.percent
        
        # Uptime
        uptime_delta = datetime.now() - self.start_time
        uptime_str = self._format_uptime(uptime_delta)
        
        # Checksum de configuración
        config_checksum = self._get_config_checksum()
        
        # Servicios
        services = {
            "aemet": {"status": "ok"},
            "ships": {"status": "stopped", "count": 0},
            "flights": {"status": "stopped", "count": 0},
            "storm": {"status": "stopped", "count": 0}
        }
        
        return {
            "status": "ok",
            "cpu_percent": round(cpu_percent, 1),
            "memory_percent": round(memory_percent, 1),
            "uptime": uptime_str,
            "config_source": "config.json",
            "config_checksum": config_checksum,
            "services": services
        }
    
    def _get_config_checksum(self) -> str:
        """Obtener checksum de la configuración"""
        if self.config_file.exists():
            try:
                with open(self.config_file, "rb") as f:
                    content = f.read()
                    return hashlib.md5(content).hexdigest()
            except Exception:
                pass
        return ""
    
    def _format_uptime(self, delta: timedelta) -> str:
        """Formatear uptime"""
        days = delta.days
        hours, remainder = divmod(delta.seconds, 3600)
        minutes, _ = divmod(remainder, 60)
        
        if days > 0:
            return f"{days} días, {hours} horas"
        elif hours > 0:
            return f"{hours} horas, {minutes} minutos"
        else:
            return f"{minutes} minutos"

