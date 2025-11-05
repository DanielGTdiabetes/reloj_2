
import React, { useContext } from 'react';
import { ConfigContext } from '../App';
import { ConfigCard } from '../components/ConfigCard';
import { WifiCard } from '../components/WifiCard';
import type { AppConfig } from '../types';

interface ConfigPageProps {
    onConfigSave: () => void;
}

export const ConfigPage: React.FC<ConfigPageProps> = ({ onConfigSave }) => {
    const config = useContext(ConfigContext);

    if (!config) {
        return <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-white">Cargando configuración...</div>;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-900 min-h-screen text-white">
            <header className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight">Configuración de Pantalla Reloj</h1>
                <p className="text-gray-400 mt-2">Gestiona todos los ajustes de tu panel.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(config)
                    .filter(key => key !== 'wifi') // Exclude wifi from generic card rendering
                    .map((key) => (
                        <ConfigCard
                            key={key}
                            groupName={key as keyof AppConfig}
                            initialData={config[key as keyof AppConfig]}
                            onSave={onConfigSave}
                        />
                ))}
                 <WifiCard />
            </div>
        </div>
    );
};
