"""
Servicio de productos de temporada
Frutas, verduras y siembras según el mes
"""
from datetime import datetime
from typing import Dict, List

class SeasonalService:
    def __init__(self):
        self.cache = {}
    
    async def get_seasonal(self) -> Dict:
        """Obtener productos de temporada"""
        today = datetime.now()
        month = today.month
        
        # Base de datos de productos de temporada
        seasonal_data = {
            1: {  # Enero
                "month": "Enero",
                "fruits": [{"name": "Limón", "icon": "lemon"}, {"name": "Naranja", "icon": "orange"}],
                "vegetables": [{"name": "Col", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Rábano", "icon": "carrot"}]
            },
            2: {  # Febrero
                "month": "Febrero",
                "fruits": [{"name": "Limón", "icon": "lemon"}, {"name": "Naranja", "icon": "orange"}],
                "vegetables": [{"name": "Col", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}],
                "sowing": [{"name": "Tomate", "icon": "tomato"}, {"name": "Pimiento", "icon": "tomato"}]
            },
            3: {  # Marzo
                "month": "Marzo",
                "fruits": [{"name": "Fresa", "icon": "strawberry"}, {"name": "Naranja", "icon": "orange"}],
                "vegetables": [{"name": "Espárrago", "icon": "asparagus"}, {"name": "Lechuga", "icon": "lettuce"}],
                "sowing": [{"name": "Calabacín", "icon": "zucchini"}, {"name": "Pepino", "icon": "zucchini"}]
            },
            4: {  # Abril
                "month": "Abril",
                "fruits": [{"name": "Fresa", "icon": "strawberry"}, {"name": "Cereza", "icon": "cherries"}],
                "vegetables": [{"name": "Espárrago", "icon": "asparagus"}, {"name": "Guisante", "icon": "peas"}],
                "sowing": [{"name": "Calabaza", "icon": "zucchini"}, {"name": "Melón", "icon": "loquat"}]
            },
            5: {  # Mayo
                "month": "Mayo",
                "fruits": [{"name": "Fresa", "icon": "strawberry"}, {"name": "Cereza", "icon": "cherries"}],
                "vegetables": [{"name": "Guisante", "icon": "peas"}, {"name": "Lechuga", "icon": "lettuce"}],
                "sowing": [{"name": "Pepino", "icon": "zucchini"}, {"name": "Calabacín", "icon": "zucchini"}]
            },
            6: {  # Junio
                "month": "Junio",
                "fruits": [{"name": "Cereza", "icon": "cherries"}, {"name": "Albaricoque", "icon": "apricot"}],
                "vegetables": [{"name": "Tomate", "icon": "tomato"}, {"name": "Pimiento", "icon": "tomato"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}]
            },
            7: {  # Julio
                "month": "Julio",
                "fruits": [{"name": "Melocotón", "icon": "peach"}, {"name": "Ciruela", "icon": "plum"}],
                "vegetables": [{"name": "Tomate", "icon": "tomato"}, {"name": "Calabacín", "icon": "zucchini"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Rábano", "icon": "carrot"}]
            },
            8: {  # Agosto
                "month": "Agosto",
                "fruits": [{"name": "Higo", "icon": "fig"}, {"name": "Melón", "icon": "melon"}],
                "vegetables": [{"name": "Tomate", "icon": "tomato"}, {"name": "Calabacín", "icon": "zucchini"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}]
            },
            9: {  # Septiembre
                "month": "Septiembre",
                "fruits": [{"name": "Higo", "icon": "fig"}, {"name": "Uva", "icon": "grape"}],
                "vegetables": [{"name": "Tomate", "icon": "tomato"}, {"name": "Pimiento", "icon": "tomato"}],
                "sowing": [{"name": "Col", "icon": "lettuce"}, {"name": "Lechuga", "icon": "lettuce"}]
            },
            10: {  # Octubre
                "month": "Octubre",
                "fruits": [{"name": "Uva", "icon": "grape"}, {"name": "Granada", "icon": "pomegranate"}],
                "vegetables": [{"name": "Calabaza", "icon": "zucchini"}, {"name": "Col", "icon": "lettuce"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Rábano", "icon": "carrot"}]
            },
            11: {  # Noviembre
                "month": "Noviembre",
                "fruits": [{"name": "Naranja", "icon": "orange"}, {"name": "Caqui", "icon": "persimmon"}],
                "vegetables": [{"name": "Col", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Rábano", "icon": "carrot"}]
            },
            12: {  # Diciembre
                "month": "Diciembre",
                "fruits": [{"name": "Naranja", "icon": "orange"}, {"name": "Limón", "icon": "lemon"}],
                "vegetables": [{"name": "Col", "icon": "lettuce"}, {"name": "Zanahoria", "icon": "carrot"}],
                "sowing": [{"name": "Lechuga", "icon": "lettuce"}, {"name": "Rábano", "icon": "carrot"}]
            }
        }
        
        return seasonal_data.get(month, seasonal_data[8])  # Default a Agosto

