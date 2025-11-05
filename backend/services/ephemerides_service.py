"""
Servicio de efemérides
Eventos históricos del día
"""
from datetime import datetime
from typing import Dict, List
from models.config import EphemeridesConfig

class EphemeridesService:
    def __init__(self):
        self.cache = {}
    
    async def get_ephemerides(self, config: EphemeridesConfig) -> Dict:
        """Obtener efemérides del día"""
        today = datetime.now()
        month = today.month
        day = today.day
        
        # Base de datos de efemérides (simplificada)
        # En producción, esto vendría de una API o base de datos
        ephemerides_db = {
            (1, 1): ["Año Nuevo"],
            (4, 23): ["Día del Libro y San Jorge"],
            (5, 1): ["Día del Trabajador"],
            (7, 20): ["En 1969, el hombre pisa la Luna por primera vez"],
            (8, 4): ["En 1914, Alemania invade Bélgica, lo que provoca la entrada del Reino Unido en la Primera Guerra Mundial"],
            (10, 12): ["Día de la Hispanidad"],
            (12, 25): ["Navidad"],
        }
        
        events = ephemerides_db.get((month, day), [])
        
        # Si no hay eventos específicos, usar eventos genéricos
        if not events:
            events = [f"Evento histórico del {day} de {self._get_month_name(month, config.language)}"]
        
        month_name = self._get_month_name(month, config.language)
        day_name = self._get_day_name(today.weekday(), config.language)
        
        return {
            "date": f"{day} de {month_name}",
            "events": events
        }
    
    def _get_month_name(self, month: int, lang: str) -> str:
        """Nombre del mes"""
        if lang == "es":
            months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        else:
            months = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"]
        return months[month - 1]
    
    def _get_day_name(self, weekday: int, lang: str) -> str:
        """Nombre del día de la semana"""
        if lang == "es":
            days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        else:
            days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        return days[weekday]

