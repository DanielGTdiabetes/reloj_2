import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { Map as MapInstance, GeoJSONSource } from 'maplibre-gl';
import type { AppConfig, ShipData, FlightData, StormData } from '../types';

interface MainMapProps {
    config: AppConfig;
    shipData: ShipData | null;
    flightData: FlightData | null;
    stormData: StormData | null;
}

export const MainMap: React.FC<MainMapProps> = ({ config, shipData, flightData, stormData }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<MapInstance | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const initializeMap = () => {
             try {
                const { map: mapConfig, storm: stormConfig } = config;
                // FIX: Removed invalid 'workerCount' property from map options as it's not a valid MapOption.
                const mapInstance = new maplibregl.Map({
                    container: mapContainer.current!,
                    style: mapConfig.style,
                    center: mapConfig.center,
                    zoom: mapConfig.zoom_min,
                    minZoom: mapConfig.zoom_min,
                    maxZoom: mapConfig.zoom_max,
                    interactive: false,
                    collectResourceTiming: false,
                    attributionControl: false,
                });

                map.current = mapInstance;

                mapInstance.on('load', () => {
                    setMapLoaded(true);

                    // Add ships source and layer
                    mapInstance.addSource('ships', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'ships-layer',
                        type: 'symbol',
                        source: 'ships',
                        layout: {
                            'icon-image': 'ferry-15',
                            'icon-rotate': ['get', 'cog'],
                            'icon-rotation-alignment': 'map',
                            'icon-allow-overlap': true,
                            'icon-ignore-placement': true,
                        },
                    });

                    // Add flights source and layer
                    mapInstance.addSource('flights', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'flights-layer',
                        type: 'symbol',
                        source: 'flights',
                        layout: {
                            'icon-image': 'rocket-15',
                            'icon-rotate': ['get', 'head'],
                            'icon-rotation-alignment': 'map',
                            'icon-allow-overlap': true,
                            'icon-ignore-placement': true,
                        },
                    });

                    // Add storms source and layer
                    mapInstance.addSource('storms', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'storms-layer',
                        type: 'circle',
                        source: 'storms',
                        paint: {
                            'circle-radius': 4,
                            // Dynamic color and opacity are set in the update interval
                        },
                    });
                });

                mapInstance.on('error', (e) => {
                    console.warn('A MapLibre error occurred:', e);
                    setMapError(e.error?.message || 'An unknown map error occurred.');
                });

            } catch (error: any) {
                console.warn("Map initialization failed. This is expected in sandboxed environments.", error);
                setMapError(error.message || 'Failed to initialize map component.');
            }
        };
        
        const timerId = setTimeout(initializeMap, 0);

         return () => {
            clearTimeout(timerId);
            map.current?.remove();
            map.current = null;
        };
    }, [config]);

    // Effect for updating GeoJSON data sources
    useEffect(() => {
        if (!mapLoaded || !map.current) return;
        
        const shipsSource = map.current.getSource('ships') as GeoJSONSource;
        if (shipsSource && shipData) shipsSource.setData(shipData);
        
        const flightsSource = map.current.getSource('flights') as GeoJSONSource;
        if (flightsSource && flightData) flightsSource.setData(flightData);

        const stormsSource = map.current.getSource('storms') as GeoJSONSource;
        if (stormsSource && stormData) stormsSource.setData(stormData);

    }, [shipData, flightData, stormData, mapLoaded]);
    
    // Effect for storm decay animation
    useEffect(() => {
        if (!mapLoaded || !map.current || !config.storm.enabled) return;

        const interval = setInterval(() => {
            if (!map.current || !map.current.getLayer('storms-layer')) return;
            
            const now = Date.now();
            const ttlMillis = config.storm.ttl_seconds * 1000;

            const ageExpression = ['-', now, ['get', 'ts']];

            map.current.setPaintProperty('storms-layer', 'circle-color', [
                'interpolate', ['linear'], ageExpression,
                0, '#ffffff',       // a recent strike is white
                ttlMillis * 0.5, '#63b3ed', // halfway through its life it's blue
                ttlMillis, '#2c5282'      // at the end it's dark blue
            ]);

            map.current.setPaintProperty('storms-layer', 'circle-opacity', [
                 'interpolate', ['linear'], ageExpression,
                0, 0.9,
                ttlMillis * 0.75, 0.7,
                ttlMillis, 0
            ]);

        }, 1000); // Update animation every second

        return () => clearInterval(interval);

    }, [mapLoaded, config.storm.enabled, config.storm.ttl_seconds]);


    if (mapError) {
        return (
            <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                <div className="text-center z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 opacity-50">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.59a2 2 0 0 1-2.83-2.83l.79-.79"/>
                        <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <p className="mt-2 text-sm">El mapa en vivo no está disponible en este entorno de visualización.</p>
                </div>
            </div>
        );
    }

    return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
};
