import React, { useContext } from 'react';
import { ConfigContext } from '../App';
import { ConfigCard } from '../components/ConfigCard';
import { WifiCard } from '../components/WifiCard';
import { CalendarConfigCard } from '../components/CalendarConfigCard';
import type { AppConfig } from '../types';

interface ConfigPageProps {
    onConfigSave: () => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({ onConfigSave }) => {
    const config = useContext(ConfigContext);

    if (!config) {
        return <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">Cargando configuración...</div>;
    }

    const standardConfigKeys = Object.keys(config).filter(key => !['wifi', 'calendar'].includes(key)) as (keyof AppConfig)[];

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-white">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Configuración de Pantalla Reloj</h1>
                <p className="text-gray-400 mt-2">Gestiona todos los ajustes de tu panel.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {standardConfigKeys.map((key) => (
                    <ConfigCard
                        key={key}
                        groupName={key}
                        initialData={config[key]}
                        onSave={onConfigSave}
                    />
                ))}
                <CalendarConfigCard initialData={config.calendar} onSave={onConfigSave} />
                <WifiCard />
            </div>
        </div>
    );
};
