"""
Servicio de santoral
Santos del día
"""
from datetime import datetime
from typing import Dict, List

class SantoralService:
    def __init__(self):
        self.cache = {}
    
    async def get_santoral(self) -> Dict:
        """Obtener santoral del día"""
        today = datetime.now()
        month = today.month
        day = today.day
        
        # Base de datos de santoral (simplificada)
        # En producción, esto vendría de una API o base de datos completa
        santoral_db = {
            (1, 1): ["Santa María, Madre de Dios"],
            (1, 6): ["Epifanía del Señor"],
            (4, 23): ["San Jorge"],
            (6, 13): ["San Antonio de Padua"],
            (7, 25): ["Santiago Apóstol"],
            (8, 4): ["San Juan María Vianney", "San Rubén"],
            (9, 29): ["San Miguel Arcángel"],
            (10, 1): ["Santa Teresa de Jesús"],
            (12, 25): ["Navidad"],
        }
        
        saints = santoral_db.get((month, day), [])
        
        # Si no hay santos específicos, usar santo genérico
        if not saints:
            saints = ["Santo del día"]
        
        month_name = self._get_month_name(month)
        
        return {
            "date": f"{day} de {month_name}",
            "saints": saints
        }
    
    def _get_month_name(self, month: int) -> str:
        """Nombre del mes"""
        months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        return months[month - 1]

