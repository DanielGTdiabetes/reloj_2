
import React from 'react';

// SVG components for different weather conditions
// Source: https://github.com/amCharts/amCharts4/tree/master/dist/es2015/images/weather
// License: https://www.amcharts.com/mit-license/ (MIT License)

const ClearDay = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g>
            <path d="M32,16.5A15.5,15.5,0,1,1,16.5,32,15.52,15.52,0,0,1,32,16.5M32,15A17,17,0,1,0,49,32,17,17,0,0,0,32,15Z" fill="#f4a71d"/>
            <path d="M32,23.38a8.62,8.62,0,1,1-8.62,8.62A8.63,8.63,0,0,1,32,23.38M32,22a10,10,0,1,0,10,10A10,10,0,0,0,32,22Z" fill="#f4a71d"/>
            <rect x="31" y="49" width="2" height="10" fill="#f4a71d"/>
            <rect x="31" y="5" width="2" height="10" fill="#f4a71d"/>
            <rect x="5" y="31" width="10" height="2" fill="#f4a71d"/>
            <rect x="49" y="31" width="10" height="2" fill="#f4a71d"/>
            <rect x="13.2" y="15.2" width="2" height="10" transform="translate(-7.72 15.2) rotate(-45)" fill="#f4a71d"/>
            <rect x="48.8" y="46.8" width="2" height="10" transform="translate(-23.18 48.8) rotate(-45)" fill="#f4a71d"/>
            <rect x="46.8" y="13.2" width="10" height="2" transform="translate(13.2 -31.32) rotate(45)" fill="#f4a71d"/>
            <rect x="15.2" y="48.8" width="10" height="2" transform="translate(-28.82 25.06) rotate(45)" fill="#f4a71d"/>
        </g>
    </svg>
);

const Cloudy = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g>
            <path d="M46.5,23.5a14.33,14.33,0,0,0-2.61.3A17.5,17.5,0,0,0,14,29a17.41,17.41,0,0,0,.5,4.5A13.5,13.5,0,0,0,13,51.5H46.5a13,13,0,0,0,0-26A14.1,14.1,0,0,0,46.5,23.5Z" fill="#94a3b8"/>
        </g>
    </svg>
);

const PartlyCloudyDay = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g>
            <path d="M32,16.5A15.5,15.5,0,1,1,16.5,32,15.52,15.52,0,0,1,32,16.5m0-1.5A17,17,0,1,0,49,32,17,17,0,0,0,32,15Z" fill="#f4a71d"/>
            <path d="M32,23.38a8.62,8.62,0,1,1-8.62,8.62A8.63,8.63,0,0,1,32,23.38m0-1.38A10,10,0,1,0,42,32,10,10,0,0,0,32,22Z" fill="#f4a71d"/>
            <path d="M46.5,23.5a14.33,14.33,0,0,0-2.61.3A17.5,17.5,0,0,0,14,29a17.41,17.41,0,0,0,.5,4.5A13.5,13.5,0,0,0,13,51.5H46.5a13,13,0,0,0,0-26A14.1,14.1,0,0,0,46.5,23.5Z" fill="#94a3b8"/>
        </g>
    </svg>
);

const Rain = () => (
    <svg viewBox="0 0 64 64" className="w-full h-full">
        <g>
            <path d="M46.5,23.5a14.33,14.33,0,0,0-2.61.3A17.5,17.5,0,0,0,14,29a17.41,17.41,0,0,0,.5,4.5A13.5,13.5,0,0,0,13,51.5H46.5a13,13,0,0,0,0-26A14.1,14.1,0,0,0,46.5,23.5Z" fill="#94a3b8"/>
            <path d="M24,50v8.1a2,2,0,0,0,2,2,2,2,0,0,0,2-2V50a2,2,0,0,0-2-2A2,2,0,0,0,24,50Z" fill="#4299e1"/>
            <path d="M34,50v8.1a2,2,0,0,0,2,2,2,2,0,0,0,2-2V50a2,2,0,0,0-2-2A2,2,0,0,0,34,50Z" fill="#4299e1"/>
            <path d="M44,50v8.1a2,2,0,0,0,2,2,2,2,0,0,0,2-2V50a2,2,0,0,0-2-2A2,2,0,0,0,44,50Z" fill="#4299e1"/>
        </g>
    </svg>
);


interface WeatherIconProps {
    icon: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ icon }) => {
    switch(icon) {
        case 'clear-day':
        case 'sunny':
            return <ClearDay />;
        case 'partly-cloudy-day':
            return <PartlyCloudyDay />;
        case 'cloudy':
            return <Cloudy />;
        case 'rain':
            return <Rain />;
        // Add more cases for other weather conditions
        default:
            return <Cloudy />; // Default icon
    }
};
