# Backend - Pantalla Reloj Dashboard

Backend FastAPI con integraciones reales a APIs externas.

## Instalación

```bash
# Instalar dependencias
pip install -r requirements.txt

# Copiar archivo de configuración de ejemplo
cp .env.example .env
# Editar .env con tus API keys
```

## Ejecución

```bash
# Desarrollo
python main.py

# O con uvicorn directamente
uvicorn main:app --host 0.0.0.0 --port 8081 --reload
```

## APIs Integradas

- **Open-Meteo**: Datos meteorológicos (gratis, sin API key)
- **OpenWeatherMap**: Alternativa con API key
- **AEMET**: Radar de precipitaciones (requiere API key)
- **AIS Stream**: Datos de barcos en tiempo real (WebSocket)
- **OpenSky Network**: Datos de aviones (gratis, con opción de credenciales)
- **Blitzortung/MQTT**: Datos de rayos en tiempo real
- **RSS Feeds**: Noticias desde feeds RSS

## Configuración

La configuración se guarda en `config.json` en el directorio del backend.

## Estructura

- `main.py`: Aplicación FastAPI principal
- `models/`: Modelos de datos (Pydantic)
- `services/`: Servicios de integración con APIs externas
  - `config_service.py`: Gestión de configuración
  - `weather_service.py`: Datos meteorológicos
  - `aemet_service.py`: Radar AEMET
  - `ships_service.py`: Barcos (AIS)
  - `flights_service.py`: Aviones (OpenSky)
  - `storm_service.py`: Rayos (MQTT)
  - `news_service.py`: Noticias (RSS)
  - `ephemerides_service.py`: Efemérides
  - `santoral_service.py`: Santoral
  - `astronomy_service.py`: Datos astronómicos
  - `seasonal_service.py`: Productos de temporada
  - `calendar_service.py`: Calendario (ICS)
  - `wifi_service.py`: Gestión Wi-Fi
  - `health_service.py`: Health check

