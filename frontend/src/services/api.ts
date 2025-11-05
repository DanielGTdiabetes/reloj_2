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
    AemetRadarData
} from '../types';

// API Base URL - usar proxy en desarrollo o URL directa en producción
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Helper para hacer peticiones
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
}

// --- CONFIGURATION MANAGEMENT ---

export const fetchConfig = (): Promise<AppConfig> => {
    return fetchAPI<AppConfig>('/config');
};

export const updateConfigGroup = async (groupName: keyof AppConfig, data: any): Promise<void> => {
    await fetchAPI(`/config/${groupName}`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const testConfigGroup = async (groupName: keyof AppConfig): Promise<{ok: boolean, message: string}> => {
    return fetchAPI<{ok: boolean, message: string}>(`/config/${groupName}/test`, {
        method: 'POST',
    });
};

// --- HEALTH CHECK ---

export const fetchHealth = async (): Promise<HealthStatus> => {
    return fetchAPI<HealthStatus>('/health');
};

// --- WEATHER DATA ---

export const fetchWeatherData = (): Promise<WeatherData> => {
    return fetchAPI<WeatherData>('/weather');
};

// --- AEMET RADAR ---

export const fetchAemetRadarData = (): Promise<AemetRadarData> => {
    return fetchAPI<AemetRadarData>('/aemet/radar');
};

// --- SHIPS DATA ---

export const fetchShipData = (): Promise<ShipData> => {
    return fetchAPI<ShipData>('/ships');
};

// --- FLIGHTS DATA ---

export const fetchFlightData = (): Promise<FlightData> => {
    return fetchAPI<FlightData>('/flights');
};

// --- STORM DATA ---

export const fetchStormData = (): Promise<StormData> => {
    return fetchAPI<StormData>('/storms');
};

// --- NEWS ---

export const fetchNews = (): Promise<NewsItem[]> => {
    return fetchAPI<NewsItem[]>('/news');
};

// --- EPHEMERIDES ---

export const fetchEphemerides = (): Promise<EphemeridesData> => {
    return fetchAPI<EphemeridesData>('/ephemerides');
};

// --- SANTORAL ---

export const fetchSantoralData = (): Promise<SantoralData> => {
    return fetchAPI<SantoralData>('/santoral');
};

// --- ASTRONOMY ---

export const fetchAstronomyData = (): Promise<AstronomyData> => {
    return fetchAPI<AstronomyData>('/astronomy');
};

// --- SEASONAL ---

export const fetchSeasonalData = (): Promise<SeasonalData> => {
    return fetchAPI<SeasonalData>('/seasonal');
};

// --- CALENDAR ---

export const fetchCalendarEvents = (): Promise<CalendarEvent[]> => {
    return fetchAPI<CalendarEvent[]>('/calendar');
};

export const uploadIcsFile = async (file: File): Promise<{ ok: boolean, message: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE}/calendar/upload`, {
        method: 'POST',
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Upload Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
};

// --- WIFI MANAGEMENT ---

export const scanWifi = (): Promise<any[]> => {
    return fetchAPI<any[]>('/wifi/scan');
};

export const connectWifi = async (ssid: string, psk: string): Promise<{ok: boolean, message: string}> => {
    return fetchAPI<{ok: boolean, message: string}>('/wifi/connect', {
        method: 'POST',
        body: JSON.stringify({ ssid, password: psk }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
