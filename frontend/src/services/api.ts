import type { 
    AppConfig, 
    HealthStatus, 
    WeatherData, 
    ShipData, 
    NewsItem, 
    EphemeridesData, 
    CalendarEvent, 
    AstronomyData, 
    FlightData, 
    SeasonalData, 
    SantoralData,
    StormData,
    StormStrike,
    AemetRadarData
} from '../types';

// --- CONFIGURATION MANAGEMENT (INTERACTIVE SIMULATION) ---

const CONFIG_KEY = 'pantallaRelojConfig';

const MOCK_DEFAULT_CONFIG: AppConfig = {
    system: { timezone: 'Europe/Madrid' },
    map: {
        provider: 'MapTiler',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [-0.038, 39.986],
        zoom_min: 6,
        zoom_max: 12,
    },
    aemet: { api_key: '', opacity: 0.7, animation_speed: 1, frame_count: 6, cache_ttl: 600 },
    weather: {
        provider: 'Open-Meteo',
        units: 'metric',
        language: 'es',
        location: { latitude: 39.98, longitude: -0.03 },
    },
    news: { sources: [{ name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' }] },
    astronomy: { location: { latitude: 39.98, longitude: -0.03, elevation: 30 } },
    ephemerides: { language: 'es' },
    calendar: { ics_filename: undefined },
    storm: {
        enabled: true,
        mqtt: { host: '127.0.0.1', port: 1883, client_id: 'pantalla-reloj-storm' },
        topic: 'blitzortung/lightning',
        ttl_seconds: 600,
        max_points: 3000,
        max_radius_km: 80,
    },
    ships: {
        enabled: true,
        provider: 'aisstream',
        bbox: [-1.0, 38.0, 1.5, 41.0],
        ttl_seconds: 120,
        max_points: 2000,
        ws_url: "wss://stream.aisstream.io/v0/stream",
        subscription: {
            BoundingBoxes: [[-1.0, 38.0, 1.5, 41.0]],
            FilterMessageTypes: ["PositionReport"]
        },
    },
    flights: {
        enabled: true,
        provider: 'opensky',
        bbox: [-1.0, 38.0, 1.5, 41.0],
        ttl_seconds: 30,
        client_id: '',
        client_secret: '',
    },
    wifi: { interface: 'wlp2s0' },
    debug: { log_level: 'INFO' },
};


// Function to get the current config, from localStorage or default
const getConfig = (): AppConfig => {
    try {
        const storedConfig = localStorage.getItem(CONFIG_KEY);
        if (storedConfig) {
            return JSON.parse(storedConfig);
        }
    } catch (error) {
        console.error("Failed to parse config from localStorage", error);
    }
    // If nothing stored or parsing fails, save and return default
    localStorage.setItem(CONFIG_KEY, JSON.stringify(MOCK_DEFAULT_CONFIG));
    return MOCK_DEFAULT_CONFIG;
};

// --- REAL-TIME SIMULATORS (DRIVEN BY CONFIG) ---

let stormStrikes: StormStrike[] = [];
let calendarEvents: CalendarEvent[] = [{ summary: 'Reunión de proyecto', start: '2024-08-04T16:00:00', end: '2024-08-04T17:00:00' }];

setInterval(() => {
    const config = getConfig();
    if (!config.storm.enabled) {
        stormStrikes = [];
        return;
    }

    // Add a new strike
    if (stormStrikes.length < config.storm.max_points) {
        const newStrike: StormStrike = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    config.map.center[0] + (Math.random() - 0.5) * 3,
                    config.map.center[1] + (Math.random() - 0.5) * 3,
                ],
            },
            properties: { ts: Date.now() },
        };
        stormStrikes.push(newStrike);
    }
    // Remove old strikes
    const now = Date.now();
    const ttlMillis = config.storm.ttl_seconds * 1000;
    stormStrikes = stormStrikes.filter(strike => now - strike.properties.ts < ttlMillis);
}, 2000); 


// --- MOCK API FUNCTIONS (NOW CONFIG-AWARE) ---

export const fetchConfig = (): Promise<AppConfig> => Promise.resolve(getConfig());

export const fetchHealth = async (): Promise<HealthStatus> => {
    const config = getConfig();
    return {
        status: 'ok',
        cpu_percent: 15.2,
        memory_percent: 45.8,
        uptime: '3 days, 4 hours',
        config_source: 'localStorage',
        config_checksum: JSON.stringify(config), // Checksum is the config itself in this simulation
        services: {
            aemet: { status: 'ok' },
            ships: { status: config.ships.enabled ? 'connected' : 'stopped', count: 123 },
            flights: { status: config.flights.enabled ? 'ok' : 'stopped', count: 45 },
            storm: { status: config.storm.enabled ? 'connected' : 'stopped', count: stormStrikes.length },
        },
    };
};

export const fetchWeatherData = (): Promise<WeatherData> => Promise.resolve({
    temperature: 24,
    feels_like: 26,
    wind_speed: 15,
    wind_direction: 180,
    cloud_cover: 20,
    icon: 'partly-cloudy-day',
    description: 'Parcialmente Nublado',
    forecast: [ { time: '14:00', temperature: 25 }, { time: '17:00', temperature: 24 }, { time: '20:00', temperature: 22 } ]
});

export const fetchShipData = (): Promise<ShipData> => {
    const config = getConfig();
    if (!config.ships.enabled) {
        return Promise.resolve({ type: 'FeatureCollection', features: [] });
    }
    return Promise.resolve({
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [config.map.center[0] + 0.1, config.map.center[1] - 0.1] }, properties: { name: 'VALENCIA', mmsi: '224000001', sog: 12.5, cog: 45, heading: 45, ts: Date.now() / 1000 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [config.map.center[0] - 0.15, config.map.center[1] + 0.05] }, properties: { name: 'MSC FANTASIA', mmsi: '224000002', sog: 18.2, cog: 180, heading: 182, ts: Date.now() / 1000 } },
        ],
    });
};

export const fetchFlightData = (): Promise<FlightData> => {
     const config = getConfig();
    if (!config.flights.enabled) {
        return Promise.resolve({ type: 'FeatureCollection', features: [] });
    }
    return Promise.resolve({
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', geometry: { type: 'Point', coordinates: [config.map.center[0] - 0.2, config.map.center[1] + 0.1] }, properties: { icao24: '345f01', callsign: 'IBE3018', lat: 40.0, lon: -0.2, alt: 9000, vel: 250, head: 90, country: 'Spain', ts: Date.now() / 1000 } },
            { type: 'Feature', geometry: { type: 'Point', coordinates: [config.map.center[0] + 0.3, config.map.center[1] - 0.2] }, properties: { icao24: '4ca2ae', callsign: 'RYR824', lat: 39.7, lon: 0.3, alt: 11000, vel: 300, head: 270, country: 'Ireland', ts: Date.now() / 1000 } },
        ],
    });
};

export const fetchAemetRadarData = (): Promise<AemetRadarData> => {
    // Simulate a list of radar image URLs
    const frames = Array.from({ length: 6 }, (_, i) => ({
        url: `https://via.placeholder.com/1920x480/0000FF/FFFFFF?text=Radar+Frame+${i + 1}`,
        timestamp: Date.now() - (5 - i) * 600000, // 10 minutes apart
    }));
    return Promise.resolve({ frames });
};


export const fetchStormData = (): Promise<StormData> => Promise.resolve({ type: 'FeatureCollection', features: stormStrikes });

export const fetchNews = (): Promise<NewsItem[]> => Promise.resolve([{ title: 'La AEMET activa avisos por altas temperaturas en el Mediterráneo.', source: 'El País' }]);
export const fetchEphemerides = (): Promise<EphemeridesData> => Promise.resolve({ date: '4 de Agosto', events: ['En 1914, Alemania invade Bélgica, lo que provoca la entrada del Reino Unido en el conflicto.'] });
export const fetchCalendarEvents = (): Promise<CalendarEvent[]> => Promise.resolve(calendarEvents);
export const fetchAstronomyData = (): Promise<AstronomyData> => Promise.resolve({ sunrise: '07:05', sunset: '21:10', moon_phase: 'Gibosa Menguante', moon_phase_icon: 'waning-gibbous' });
export const fetchSeasonalData = (): Promise<SeasonalData> => Promise.resolve({ month: 'Agosto', fruits: [{ name: 'Higos', icon: 'loquat' }, { name: 'Melón', icon: 'loquat' }], vegetables: [{ name: 'Tomate', icon: 'tomato' }, { name: 'Calabacín', icon: 'zucchini' }], sowing: [{ name: 'Lechuga', icon: 'lettuce' }, { name: 'Zanahoria', icon: 'carrot' }] });
export const fetchSantoralData = (): Promise<SantoralData> => Promise.resolve({ date: '4 de Agosto', saints: ['San Juan María Vianney', 'San Rubén'] });

export const updateConfigGroup = (groupName: keyof AppConfig, data: any): Promise<void> => {
    const currentConfig = getConfig();
    const updatedConfig = { ...currentConfig, [groupName]: data };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updatedConfig));
    console.log(`Saved new config for ${groupName}:`, data);
    return Promise.resolve();
};

export const testConfigGroup = (groupName: keyof AppConfig): Promise<{ok: boolean, message: string}> => {
     console.log(`Simulating TEST for ${groupName}`);
    return Promise.resolve({ ok: true, message: 'Simulación de prueba correcta.' });
};

// --- Calendar ICS Upload ---
const parseIcs = (icsData: string): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const lines = icsData.replace(/\r\n/g, '\n').split('\n');
    let currentEvent: Partial<CalendarEvent> | null = null;

    for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent && currentEvent.summary && currentEvent.start) {
                events.push(currentEvent as CalendarEvent);
            }
            currentEvent = null;
        } else if (currentEvent) {
            if (line.startsWith('SUMMARY:')) {
                currentEvent.summary = line.substring(8);
            } else if (line.startsWith('DTSTART')) {
                currentEvent.start = line.split(':')[1];
            } else if (line.startsWith('DTEND')) {
                 currentEvent.end = line.split(':')[1];
            }
        }
    }
    return events.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
}

export const uploadIcsFile = (file: File): Promise<{ ok: boolean, message: string }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedEvents = parseIcs(content);
                calendarEvents = parsedEvents;
                
                const currentConfig = getConfig();
                currentConfig.calendar.ics_filename = file.name;
                localStorage.setItem(CONFIG_KEY, JSON.stringify(currentConfig));

                resolve({ ok: true, message: `Calendario '${file.name}' cargado con ${parsedEvents.length} eventos.` });
            } catch (error) {
                 resolve({ ok: false, message: `Error al parsear el fichero: ${error}` });
            }
        };
        reader.onerror = () => resolve({ ok: false, message: 'No se pudo leer el fichero.' });
        reader.readAsText(file);
    });
};


// --- Wifi Management ---
export const scanWifi = (): Promise<any[]> => Promise.resolve([{ ssid: 'MiFibra-1234', signal: 92 }, { ssid: 'WIFI_VECINO', signal: 45 }]);

export const connectWifi = (ssid: string, psk: string): Promise<{ok: boolean, message: string}> => {
    console.log(`Simulating connect to ${ssid} with psk ${psk}`);
    return Promise.resolve({ ok: true, message: `Conexión simulada a ${ssid} exitosa.` });
};
