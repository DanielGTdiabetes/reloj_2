"""
Servicio de datos astronómicos
Cálculo de amanecer, atardecer y fases lunares
"""
from datetime import datetime, date
from astral import LocationInfo
from astral.sun import sun
from astral.moon import phase
from typing import Dict
from models.config import AstronomyConfig

class AstronomyService:
    def __init__(self):
        self.cache = {}
    
    async def get_astronomy(self, config: AstronomyConfig) -> Dict:
        """Obtener datos astronómicos"""
        lat = config.location["latitude"]
        lon = config.location["longitude"]
        elevation = config.location.get("elevation", 0)
        
        # Crear ubicación
        location = LocationInfo(
            latitude=lat,
            longitude=lon,
            elevation=elevation
        )
        
        today = date.today()
        
        # Calcular amanecer y atardecer
        s = sun(location.observer, date=today)
        sunrise = s["sunrise"].strftime("%H:%M")
        sunset = s["sunset"].strftime("%H:%M")
        
        # Calcular fase lunar
        moon_phase_num = phase(today)
        moon_phase_name, moon_phase_icon = self._get_moon_phase(moon_phase_num)
        
        return {
            "sunrise": sunrise,
            "sunset": sunset,
            "moon_phase": moon_phase_name,
            "moon_phase_icon": moon_phase_icon
        }
    
    def _get_moon_phase(self, phase_num: float) -> tuple:
        """Obtener nombre e icono de la fase lunar"""
        # phase_num: 0.0 = luna nueva, 0.25 = cuarto creciente, 0.5 = luna llena, 0.75 = cuarto menguante
        
        if phase_num < 0.03 or phase_num > 0.97:
            return ("Luna Nueva", "new-moon")
        elif phase_num < 0.22:
            return ("Luna Creciente", "waxing-crescent")
        elif phase_num < 0.28:
            return ("Cuarto Creciente", "first-quarter")
        elif phase_num < 0.47:
            return ("Luna Creciente", "waxing-gibbous")
        elif phase_num < 0.53:
            return ("Luna Llena", "full-moon")
        elif phase_num < 0.72:
            return ("Luna Menguante", "waning-gibbous")
        elif phase_num < 0.78:
            return ("Cuarto Menguante", "third-quarter")
        else:
            return ("Luna Menguante", "waning-crescent")

