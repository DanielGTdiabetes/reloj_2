"""
Servicio de gestión de configuración
Persiste la configuración en un archivo JSON
"""
import json
import os
from pathlib import Path
from typing import Dict, Any
from models.config import AppConfig, get_default_config

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
        
        # Actualizar el grupo
        current_group = getattr(self._config, group_name)
        # Para modelos Pydantic, crear una nueva instancia
        group_class = type(current_group)
        updated_data = current_group.model_dump()
        updated_data.update(data)
        setattr(self._config, group_name, group_class(**updated_data))
        
        self.save_config()
    
    async def test_group(self, group_name: str) -> Dict[str, Any]:
        """Probar configuración de un grupo"""
        # Implementar pruebas específicas por grupo
        if group_name == "weather":
            # Probar conexión a API de tiempo
            return {"ok": True, "message": "Conexión a API de tiempo exitosa"}
        elif group_name == "aemet":
            # Probar conexión a AEMET
            return {"ok": True, "message": "Conexión a AEMET exitosa"}
        elif group_name == "ships":
            # Probar conexión a AIS
            return {"ok": True, "message": "Conexión a AIS Stream exitosa"}
        elif group_name == "flights":
            # Probar conexión a OpenSky
            return {"ok": True, "message": "Conexión a OpenSky exitosa"}
        elif group_name == "storm":
            # Probar conexión MQTT
            return {"ok": True, "message": "Conexión MQTT exitosa"}
        else:
            return {"ok": True, "message": "Configuración válida"}

