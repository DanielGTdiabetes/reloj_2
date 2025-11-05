import React, { useState, useEffect } from 'react';

interface ClockProps {
    timezone: string;
}

export const Clock: React.FC<ClockProps> = ({ timezone }) => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    };

    return (
        <div className="bg-black bg-opacity-30 p-6 rounded-lg backdrop-blur-sm flex flex-col justify-center">
            <div className="text-8xl font-thin tracking-tight text-white text-center leading-none">
                {date.toLocaleTimeString('es-ES', timeOptions)}
            </div>
            <div className="text-xl font-light text-gray-300 text-center mt-3 capitalize">
                {date.toLocaleDateString('es-ES', dateOptions)}
            </div>
        </div>
    );
};
