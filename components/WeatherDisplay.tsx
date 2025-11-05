

import React from 'react';
import type { WeatherData } from '../types';
import { Wind, Cloud, Compass } from 'lucide-react';
import { WeatherIcon } from './WeatherIcon';

interface WeatherDisplayProps {
    data: WeatherData;
    units: 'metric' | 'imperial';
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data, units }) => {
    const tempUnit = units === 'metric' ? '°C' : '°F';
    const speedUnit = units === 'metric' ? 'km/h' : 'mph';

    return (
        <div className="bg-black bg-opacity-30 p-6 rounded-lg backdrop-blur-sm flex flex-col justify-between">
            <div>
                <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 flex-shrink-0">
                       <WeatherIcon icon={data.icon} />
                    </div>
                    <div className="flex-grow">
                        <p className="text-6xl font-thin">{Math.round(data.temperature)}{tempUnit}</p>
                        <p className="text-gray-300 text-md -mt-1">Sensación {Math.round(data.feels_like)}{tempUnit}</p>
                        <p className="text-lg text-gray-200 capitalize mt-2">{data.description}</p>
                    </div>
                </div>
                <div className="flex justify-around mt-4 text-sm text-gray-300 border-t border-gray-700 pt-3">
                    <div className="flex items-center space-x-2">
                        <Wind size={16} />
                        <span>{data.wind_speed} {speedUnit}</span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Cloud size={16} />
                        <span>{data.cloud_cover}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Compass size={16} style={{ transform: `rotate(${data.wind_direction}deg)` }}/>
                         <span>Viento</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between text-center">
                {data.forecast.slice(0, 4).map(f => (
                    <div key={f.time} className="flex-1">
                        <p className="text-sm text-gray-400">{f.time}</p>
                        <p className="font-semibold text-lg mt-1">{Math.round(f.temperature)}{tempUnit}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};