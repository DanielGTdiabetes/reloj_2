export interface SystemConfig {
    timezone: string;
}

export interface MapConfig {
    provider: 'MapTiler' | 'OSM';
    style: string;
    center: [number, number];
    zoom_min: number;
    zoom_max: number;
}

export interface AemetConfig {
    api_key: string;
    opacity: number;
    animation_speed: number;
    frame_count: number;
    cache_ttl: number;
}

export interface WeatherConfig {
    provider: 'Open-Meteo' | 'OpenWeatherMap';
    api_key?: string;
    units: 'metric' | 'imperial';
    language: 'es' | 'en';
    location: {
        latitude: number;
        longitude: number;
    };
}

export interface NewsSource {
    name: string;
    url: string;
}

export interface NewsConfig {
    sources: NewsSource[];
}

export interface AstronomyConfig {
    location: {
        latitude: number;
        longitude: number;
        elevation: number;
    };
}

export interface EphemeridesConfig {
    language: 'es' | 'en';
}

export interface CalendarConfig {
    ics_filename?: string;
}


export interface StormConfig {
    enabled: boolean;
    mqtt: {
        host: string;
        port: number;
        username?: string;
        password?: string;
        client_id: string;
    };
    topic: string;
    ttl_seconds: number;
    max_points: number;
    max_radius_km: number;
    location?: {
        lat: number;
        lon: number;
    };
}

export interface ShipsConfig {
    enabled: boolean;
    provider: "aisstream";
    bbox: [number, number, number, number];
    ttl_seconds: number;
    max_points: number;
    ws_url: string;
    subscription: {
        BoundingBoxes: [[number, number, number, number]];
        FilterMessageTypes: ["PositionReport"];
    };
    auth?: {
        token: string;
    };
}


export interface FlightsConfig {
    enabled: boolean;
    provider: "opensky";
    bbox: [number, number, number, number];
    ttl_seconds: number;
    client_id: string;
    client_secret: string;
}


export interface WifiConfig {
    interface: string;
}

export interface DebugConfig {
    log_level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
}

export interface AppConfig {
    system: SystemConfig;
    map: MapConfig;
    aemet: AemetConfig;
    weather: WeatherConfig;
    news: NewsConfig;
    astronomy: AstronomyConfig;
    ephemerides: EphemeridesConfig;
    calendar: CalendarConfig;
    storm: StormConfig;
    ships: ShipsConfig;
    flights: FlightsConfig;
    wifi: WifiConfig;
    debug: DebugConfig;
}

export interface HealthStatus {
    status: 'ok' | 'error';
    cpu_percent: number;
    memory_percent: number;
    uptime: string;
    config_source: string;
    config_checksum: string;
    services: Record<string, { status: 'running' | 'stopped' | 'error' | 'connected' | 'ok', details?: string, last_msg_ts?: number, count?: number, last_update_ts?: number }>;
}

export interface WeatherData {
    temperature: number;
    feels_like: number;
    wind_speed: number;
    wind_direction: number;
    cloud_cover: number;
    icon: string;
    description: string;
    forecast: { time: string; temperature: number }[];
}

export interface AemetRadarFrame {
    url: string;
    timestamp: number;
}
export interface AemetRadarData {
    frames: AemetRadarFrame[];
}

export interface StormStrike {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        ts: number; // epoch ms
        amplitude?: number;
        station_count?: number;
        received_at?: number; // client-side timestamp
    };
}

export interface StormData {
    type: 'FeatureCollection';
    features: StormStrike[];
}

export interface Ship {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        name: string;
        mmsi: string;
        sog: number;
        cog: number;
        heading: number;
        ts: number;
    };
}

export interface ShipData {
    type: 'FeatureCollection';
    features: Ship[];
}

export interface Flight {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        icao24: string;
        callsign: string;
        lat: number;
        lon: number;
        alt: number;
        vel: number;
        head: number;
        country: string;
        ts: number;
    };
}

export interface FlightData {
    type: 'FeatureCollection';
    features: Flight[];
}


export interface NewsItem {
    title: string;
    source: string;
}

export interface EphemeridesData {
    date: string;
    events: string[];
}

export interface CalendarEvent {
    summary: string;
    start: string;
    end: string;
}

export interface AstronomyData {
    sunrise: string;
    sunset: string;
    moon_phase: string;
    moon_phase_icon: string;
}

export interface SeasonalDataItem {
    name: string;
    icon: string;
}

export interface SeasonalData {
    month: string;
    fruits: SeasonalDataItem[];
    vegetables: SeasonalDataItem[];
    sowing: SeasonalDataItem[];
}

export interface SantoralData {
    date: string;
    saints: string[];
}
