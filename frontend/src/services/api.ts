
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
    StormStrike
} from '../types';

// --- MOCK DATA ---

const MOCK_CONFIG: AppConfig = {
    system: { timezone: 'Europe/Madrid' },
    map: {
        provider: 'MapTiler',
        style: 'https://demotiles.maplibre.org/style.json',
        center: [-0.03, 39.98],
        zoom_min: 5,
        zoom_max: 12,
    },
    aemet: { api_key: '', opacity: 0.8, animation_speed: 1, frame_count: 10, cache_ttl: 600 },
    weather: {
        provider: 'Open-Meteo',
        units: 'metric',
        language: 'es',
        location: { latitude: 39.98, longitude: -0.03 },
    },
    news: { sources: [{ name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada' }] },
    astronomy: { location: { latitude: 39.98, longitude: -0.03, elevation: 30 } },
    ephemerides: { language: 'es' },
    calendar: { api_key: '', calendar_id: 'primary' },
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

const MOCK_HEALTH: HealthStatus = {
    status: 'ok',
    cpu_percent: 15.2,
    memory_percent: 45.8,
    uptime: '3 days, 4 hours',
    config_source: '/var/lib/pantalla-reloj/config.json',
    config_checksum: 'mockchecksum12345',
    services: {
        aemet: { status: 'ok' },
        ships: { status: 'connected', count: 123, last_msg_ts: Date.now()/1000 - 5 },
        flights: { status: 'ok', count: 45, last_update_ts: Date.now()/1000 - 10 },
        storm: { status: 'connected', count: 5, last_msg_ts: Date.now()/1000 - 2 },
    },
};

const MOCK_WEATHER: WeatherData = {
    temperature: 24,
    feels_like: 26,
    wind_speed: 15,
    wind_direction: 180,
    cloud_cover: 20,
    icon: 'partly-cloudy-day',
    description: 'Parcialmente Nublado',
    forecast: [
        { time: '14:00', temperature: 25 },
        { time: '17:00', temperature: 24 },
        { time: '20:00', temperature: 22 },
        { time: '23:00', temperature: 19 },
    ],
};

const MOCK_SHIPS: ShipData = {
    type: 'FeatureCollection',
    features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.05, 39.95] }, properties: { name: 'VALENCIA', mmsi: '224000001', sog: 12.5, cog: 45, heading: 45, ts: Date.now() / 1000 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0.1, 39.8] }, properties: { name: 'MSC FANTASIA', mmsi: '224000002', sog: 18.2, cog: 180, heading: 182, ts: Date.now() / 1000 } },
    ],
};

const MOCK_FLIGHTS: FlightData = {
    type: 'FeatureCollection',
    features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [-0.2, 40.0] }, properties: { icao24: '345f01', callsign: 'IBE3018', lat: 40.0, lon: -0.2, alt: 9000, vel: 250, head: 90, country: 'Spain', ts: Date.now() / 1000 } },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [0.3, 39.7] }, properties: { icao24: '4ca2ae', callsign: 'RYR824', lat: 39.7, lon: 0.3, alt: 11000, vel: 300, head: 270, country: 'Ireland', ts: Date.now() / 1000 } },
    ],
};

const MOCK_NEWS: NewsItem[] = [{ title: 'La AEMET activa avisos por altas temperaturas en el Mediterráneo.', source: 'El País' }];
const MOCK_EPHEMERIDES: EphemeridesData = { date: '4 de Agosto', events: ['En 1914, durante la Primera Guerra Mundial, Alemania invade Bélgica, lo que provoca la entrada del Reino Unido en el conflicto.'] };
const MOCK_CALENDAR: CalendarEvent[] = [{ summary: 'Reunión de proyecto', start: '2024-08-04T16:00:00', end: '2024-08-04T17:00:00' }];
const MOCK_ASTRONOMY: AstronomyData = { sunrise: '07:05', sunset: '21:10', moon_phase: 'Gibosa Menguante', moon_phase_icon: 'waning-gibbous' };
const MOCK_SEASONAL: SeasonalData = { month: 'Agosto', fruits: [{ name: 'Higos', icon: 'loquat' }, { name: 'Melón', icon: 'loquat' }], vegetables: [{ name: 'Tomate', icon: 'tomato' }, { name: 'Calabacín', icon: 'zucchini' }], sowing: [{ name: 'Lechuga', icon: 'lettuce' }, { name: 'Zanahoria', icon: 'carrot' }] };
const MOCK_SANTORAL: SantoralData = { date: '4 de Agosto', saints: ['San Juan María Vianney', 'San Rubén'] };
const MOCK_WIFI_NETWORKS = [{ ssid: 'MiFibra-1234', signal: 92 }, { ssid: 'WIFI_VECINO', signal: 45 }];

// --- Real-time Storm Simulator ---
let stormStrikes: StormStrike[] = [];
setInterval(() => {
    // Add a new strike
    if (stormStrikes.length < MOCK_CONFIG.storm.max_points) {
        const newStrike: StormStrike = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    MOCK_CONFIG.map.center[0] + (Math.random() - 0.5) * 2,
                    MOCK_CONFIG.map.center[1] + (Math.random() - 0.5) * 2,
                ],
            },
            properties: { ts: Date.now() },
        };
        stormStrikes.push(newStrike);
    }
    // Remove old strikes
    const now = Date.now();
    const ttlMillis = MOCK_CONFIG.storm.ttl_seconds * 1000;
    stormStrikes = stormStrikes.filter(strike => now - strike.properties.ts < ttlMillis);
}, 2000); // New strike every 2 seconds


// --- Mock API Functions ---

export const fetchConfig = (): Promise<AppConfig> => Promise.resolve(MOCK_CONFIG);

export const fetchHealth = (): Promise<HealthStatus> => Promise.resolve(MOCK_HEALTH);

export const fetchWeatherData = (): Promise<WeatherData> => Promise.resolve(MOCK_WEATHER);

export const fetchShipData = (): Promise<ShipData> => Promise.resolve(MOCK_SHIPS);

export const fetchFlightData = (): Promise<FlightData> => Promise.resolve(MOCK_FLIGHTS);

export const fetchStormData = (): Promise<StormData> => Promise.resolve({ type: 'FeatureCollection', features: stormStrikes });

export const fetchNews = (): Promise<NewsItem[]> => Promise.resolve(MOCK_NEWS);

export const fetchEphemerides = (): Promise<EphemeridesData> => Promise.resolve(MOCK_EPHEMERIDES);

export const fetchCalendarEvents = (): Promise<CalendarEvent[]> => Promise.resolve(MOCK_CALENDAR);

export const fetchAstronomyData = (): Promise<AstronomyData> => Promise.resolve(MOCK_ASTRONOMY);

export const fetchSeasonalData = (): Promise<SeasonalData> => Promise.resolve(MOCK_SEASONAL);

export const fetchSantoralData = (): Promise<SantoralData> => Promise.resolve(MOCK_SANTORAL);

export const updateConfigGroup = (groupName: keyof AppConfig, data: any): Promise<void> => {
    console.log(`Simulating PATCH for ${groupName}:`, data);
    return Promise.resolve();
};

export const testConfigGroup = (groupName: keyof AppConfig): Promise<{ok: boolean, message: string}> => {
     console.log(`Simulating TEST for ${groupName}`);
    return Promise.resolve({ ok: true, message: 'Simulación de prueba correcta.' });
};

export const scanWifi = (): Promise<any[]> => Promise.resolve(MOCK_WIFI_NETWORKS);

export const connectWifi = (ssid: string, psk: string): Promise<{ok: boolean, message: string}> => {
    console.log(`Simulating connect to ${ssid} with psk ${psk}`);
    return Promise.resolve({ ok: true, message: `Conexión simulada a ${ssid} exitosa.` });
};
