"""
Servicio de calendario
Parseo de archivos ICS
"""
import os
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List
from models.config import CalendarConfig

class CalendarService:
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        self.events = []
        self.load_events()
    
    async def get_events(self, config: CalendarConfig) -> List[Dict]:
        """Obtener eventos del calendario"""
        if config.ics_filename:
            ics_file = self.data_dir / config.ics_filename
            if ics_file.exists():
                self.load_ics(ics_file)
        
        # Filtrar eventos futuros y ordenar
        now = datetime.now()
        future_events = [
            event for event in self.events
            if datetime.fromisoformat(event["start"].replace("Z", "+00:00")) > now
        ]
        future_events.sort(key=lambda x: x["start"])
        
        return future_events[:10]  # Máximo 10 eventos
    
    async def upload_ics(self, filename: str, content: bytes) -> Dict:
        """Subir archivo ICS"""
        try:
            # Guardar archivo
            ics_file = self.data_dir / filename
            with open(ics_file, "wb") as f:
                f.write(content)
            
            # Parsear y cargar eventos
            self.load_ics(ics_file)
            
            return {
                "ok": True,
                "message": f"Calendario '{filename}' cargado con {len(self.events)} eventos."
            }
        except Exception as e:
            return {
                "ok": False,
                "message": f"Error al procesar archivo: {str(e)}"
            }
    
    def load_ics(self, ics_file: Path):
        """Cargar eventos desde archivo ICS"""
        self.events = []
        
        try:
            with open(ics_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Parsear ICS (simplificado)
            # Buscar eventos
            event_pattern = r"BEGIN:VEVENT(.*?)END:VEVENT"
            events = re.findall(event_pattern, content, re.DOTALL)
            
            for event_text in events:
                event = {}
                
                # Extraer campos
                summary_match = re.search(r"SUMMARY:(.*)", event_text)
                if summary_match:
                    event["summary"] = summary_match.group(1).strip()
                
                dtstart_match = re.search(r"DTSTART[^:]*:(.*)", event_text)
                if dtstart_match:
                    event["start"] = self._parse_ical_date(dtstart_match.group(1).strip())
                
                dtend_match = re.search(r"DTEND[^:]*:(.*)", event_text)
                if dtend_match:
                    event["end"] = self._parse_ical_date(dtend_match.group(1).strip())
                
                if event.get("summary") and event.get("start"):
                    self.events.append(event)
            
            # Guardar eventos parseados
            self.save_events()
        except Exception as e:
            print(f"Error cargando ICS: {e}")
    
    def _parse_ical_date(self, date_str: str) -> str:
        """Parsear fecha iCalendar"""
        # Formato: 20240804T160000Z o 20240804T160000
        if len(date_str) >= 15:
            year = date_str[0:4]
            month = date_str[4:6]
            day = date_str[6:8]
            hour = date_str[9:11] if len(date_str) > 9 else "00"
            minute = date_str[11:13] if len(date_str) > 11 else "00"
            second = date_str[13:15] if len(date_str) > 13 else "00"
            return f"{year}-{month}-{day}T{hour}:{minute}:{second}"
        return date_str
    
    def load_events(self):
        """Cargar eventos guardados"""
        events_file = self.data_dir / "events.json"
        if events_file.exists():
            try:
                import json
                with open(events_file, "r", encoding="utf-8") as f:
                    self.events = json.load(f)
            except Exception as e:
                print(f"Error cargando eventos: {e}")
                self.events = []
    
    def save_events(self):
        """Guardar eventos"""
        events_file = self.data_dir / "events.json"
        try:
            import json
            with open(events_file, "w", encoding="utf-8") as f:
                json.dump(self.events, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Error guardando eventos: {e}")

