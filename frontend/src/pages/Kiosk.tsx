import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../App';
import { MainMap } from '../components/MainMap';
import { Clock } from '../components/Clock';
import { WeatherDisplay } from '../components/WeatherDisplay';
import { InfoCarousel } from '../components/InfoCarousel';
import type { ShipData, WeatherData, FlightData, StormData, StormStrike, AemetRadarData } from '../types';
import { fetchShipData, fetchWeatherData, fetchFlightData, fetchStormData, fetchAemetRadarData } from '../services/api';

export const Kiosk: React.FC = () => {
    const config = useContext(ConfigContext);
    const [shipData, setShipData] = useState<ShipData | null>(null);
    const [flightData, setFlightData] = useState<FlightData | null>(null);
    const [stormData, setStormData] = useState<StormData | null>(null);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [aemetRadarData, setAemetRadarData] = useState<AemetRadarData | null>(null);

    // Fetch static or slowly changing data
    useEffect(() => {
        const fetchOnce = async () => {
            try {
                setWeatherData(await fetchWeatherData());
                setAemetRadarData(await fetchAemetRadarData());
            } catch (error) {
                console.error("Error fetching static data:", error);
            }
        };
        fetchOnce();
        const interval = setInterval(fetchOnce, 300000); // Refresh weather & radar data every 5 minutes
        return () => clearInterval(interval);
    }, []);

    // Fetch real-time geo data at different intervals
    useEffect(() => {
        if (!config) return;

        const intervals: number[] = [];

        if (config.ships.enabled) {
            const fetchShips = async () => {
                try {
                    setShipData(await fetchShipData());
                } catch (error) {
                    console.error("Error fetching ship data:", error);
                }
            };
            fetchShips();
            intervals.push(window.setInterval(fetchShips, 10000));
        }

        if (config.flights.enabled) {
            const fetchFlights = async () => {
                try {
                    setFlightData(await fetchFlightData());
                } catch (error) {
                    console.error("Error fetching flight data:", error);
                }
            };
            fetchFlights();
            intervals.push(window.setInterval(fetchFlights, 8000));
        }

        if (config.storm.enabled) {
            const fetchStorms = async () => {
                try {
                    const data = await fetchStormData();
                    const now = Date.now();
                    const featuresWithTimestamp = data.features.map((f: StormStrike) => ({
                        ...f,
                        properties: { ...f.properties, received_at: now }
                    }));
                    setStormData({ ...data, features: featuresWithTimestamp });
                } catch (error) {
                    console.error("Error fetching storm data:", error);
                }
            };
            fetchStorms();
            intervals.push(window.setInterval(fetchStorms, 3000));
        }

        return () => intervals.forEach(clearInterval);
    }, [config]);

    if (!config) {
        return null;
    }
    
    const aemetAttributionVisible = config.aemet.api_key !== '' || (aemetRadarData && aemetRadarData.frames.length > 0);

    return (
        <div className="w-full h-full flex bg-black overflow-hidden relative text-white">
            {/* Left Info Panel */}
            <div className="w-1/4 h-full flex-shrink-0 p-6 flex flex-col space-y-6 overflow-hidden">
                 <Clock timezone={config.system.timezone} />
                 {weatherData && <WeatherDisplay data={weatherData} units={config.weather.units} />}
                 <div className="flex-grow min-h-0">
                    <InfoCarousel />
                 </div>
            </div>

            {/* Right Map Panel */}
            <div className="w-3/4 h-full relative">
                <MainMap 
                    config={config} 
                    shipData={shipData} 
                    flightData={flightData} 
                    stormData={stormData}
                    aemetRadarData={aemetRadarData}
                />
            </div>

            {aemetAttributionVisible && (
                <div className="absolute bottom-1 right-4 text-xs text-gray-400 pointer-events-none">
                    Datos © AEMET
                </div>
            )}
        </div>
    );
};
