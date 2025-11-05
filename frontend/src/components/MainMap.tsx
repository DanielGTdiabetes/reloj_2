import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { Map as MapInstance, GeoJSONSource } from 'maplibre-gl';
import type { AppConfig, ShipData, FlightData, StormData, AemetRadarData } from '../types';

interface MainMapProps {
    config: AppConfig;
    shipData: ShipData | null;
    flightData: FlightData | null;
    stormData: StormData | null;
    aemetRadarData: AemetRadarData | null;
}

export const MainMap: React.FC<MainMapProps> = ({ config, shipData, flightData, stormData, aemetRadarData }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<MapInstance | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState<string | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const initializeMap = () => {
             try {
                const { map: mapConfig } = config;
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

                    // AEMET Radar
                    mapInstance.addSource('aemet-radar', {
                        type: 'image',
                        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Transparent pixel
                        coordinates: [
                            [-10, 25], // Placeholder, will be updated
                            [10, 25],
                            [10, 45],
                            [-10, 45]
                        ]
                    });
                     mapInstance.addLayer({
                        id: 'aemet-radar-layer',
                        type: 'raster',
                        source: 'aemet-radar',
                        paint: { 'raster-opacity': config.aemet.opacity }
                    });


                    // Lightning Icon
                    const size = 64;
                    const lightningSvg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M7 21l3-9H4l9-10v8h6L9 21z"/></svg>`;
                    const blob = new Blob([lightningSvg], {type: 'image/svg+xml'});
                    const url = URL.createObjectURL(blob);
                    const image = new Image(size, size);
                    image.src = url;
                    image.onload = () => {
                        if (map.current && !map.current.hasImage('lightning-bolt')) {
                            map.current.addImage('lightning-bolt', image, { sdf: true });
                        }
                        URL.revokeObjectURL(url);
                    };

                    // Add sources and layers
                    mapInstance.addSource('ships', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'ships-layer', type: 'symbol', source: 'ships',
                        layout: { 'icon-image': 'ferry-15', 'icon-rotate': ['get', 'cog'], 'icon-rotation-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true }
                    });

                    mapInstance.addSource('flights', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'flights-layer', type: 'symbol', source: 'flights',
                        layout: { 'icon-image': 'airport-15', 'icon-rotate': ['get', 'head'], 'icon-rotation-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true }
                    });

                    mapInstance.addSource('storms', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
                    mapInstance.addLayer({
                        id: 'storms-layer', type: 'symbol', source: 'storms',
                        layout: { 'icon-image': 'lightning-bolt', 'icon-size': 0.6, 'icon-allow-overlap': true, 'icon-ignore-placement': true },
                        paint: {}
                    });
                });

                mapInstance.on('error', (e) => {
                    console.warn('A MapLibre error occurred:', e.error?.message || e);
                    setMapError(e.error?.message || 'An unknown map error occurred.');
                });

            } catch (error: any) {
                console.warn("Map initialization failed. This is expected in sandboxed environments.", error);
                setMapError(error.message || 'Failed to initialize map component.');
            }
        };
        
        const timerId = setTimeout(initializeMap, 100);

         return () => {
            clearTimeout(timerId);
            map.current?.remove();
            map.current = null;
        };
    }, [config]);

    // Effect for updating GeoJSON data sources
    useEffect(() => {
        if (!mapLoaded || !map.current) return;
        
        (map.current.getSource('ships') as GeoJSONSource)?.setData(shipData || { type: 'FeatureCollection', features: [] });
        (map.current.getSource('flights') as GeoJSONSource)?.setData(flightData || { type: 'FeatureCollection', features: [] });
        (map.current.getSource('storms') as GeoJSONSource)?.setData(stormData || { type: 'FeatureCollection', features: [] });

    }, [shipData, flightData, stormData, mapLoaded]);
    
    // Effect for storm decay animation
    useEffect(() => {
        if (!mapLoaded || !map.current || !config.storm.enabled) return;
        const interval = setInterval(() => {
            if (!map.current?.getLayer('storms-layer')) return;
            const now = Date.now();
            const ttlMillis = config.storm.ttl_seconds * 1000;
            const ageExpression = ['-', now, ['get', 'ts']];
            map.current.setPaintProperty('storms-layer', 'icon-color', ['interpolate', ['linear'], ageExpression, 0, '#ffffff', ttlMillis * 0.5, '#63b3ed', ttlMillis, '#2c5282']);
            map.current.setPaintProperty('storms-layer', 'icon-opacity', ['interpolate', ['linear'], ageExpression, 0, 0.9, ttlMillis * 0.75, 0.7, ttlMillis, 0]);
        }, 1000);
        return () => clearInterval(interval);
    }, [mapLoaded, config.storm.enabled, config.storm.ttl_seconds]);

    // Effect for AEMET radar animation
    useEffect(() => {
        if (!mapLoaded || !map.current || !aemetRadarData || aemetRadarData.frames.length === 0) return;
        
        let frameIndex = 0;
        const radarSource = map.current.getSource('aemet-radar') as maplibregl.ImageSource;
        if (!radarSource) return;

        const interval = setInterval(() => {
            const frame = aemetRadarData.frames[frameIndex];
            // In a real scenario, coordinates would come from AEMET API
            const coordinates: [[number, number], [number, number], [number, number], [number, number]] = [[-9.5, 44], [4.5, 44], [4.5, 35], [-9.5, 35]];
            radarSource.updateImage({ url: frame.url, coordinates });
            frameIndex = (frameIndex + 1) % aemetRadarData.frames.length;
        }, 1000 / config.aemet.animation_speed);

        map.current.setPaintProperty('aemet-radar-layer', 'raster-opacity', config.aemet.opacity);

        return () => clearInterval(interval);
    }, [mapLoaded, aemetRadarData, config.aemet.animation_speed, config.aemet.opacity]);


    if (mapError) {
        return (
            <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center text-gray-500 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                <div className="text-center z-10">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 opacity-50"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    <p className="mt-2 text-sm">El mapa en vivo no está disponible en este entorno de visualización.</p>
                </div>
            </div>
        );
    }

    return <div ref={mapContainer} className="absolute inset-0 w-full h-full" />;
};
