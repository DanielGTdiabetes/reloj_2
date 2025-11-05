
import React, { useState, useEffect, createContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { Kiosk } from './pages/Kiosk';
import { ConfigPage } from './pages/ConfigPage';
import type { AppConfig, HealthStatus } from './types';
import { fetchConfig, fetchHealth } from './services/api';
import { Sun, Wrench } from 'lucide-react';

export const ConfigContext = createContext<AppConfig | null>(null);

const App: React.FC = () => {
    const [config, setConfig] = useState<AppConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastChecksum, setLastChecksum] = useState<string | null>(null);

    const loadConfig = useCallback(async () => {
        try {
            const fetchedConfig = await fetchConfig();
            setConfig(fetchedConfig);
        } catch (err) {
            setError('Error al cargar la configuración. ¿Está el backend en funcionamiento?');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const health: HealthStatus = await fetchHealth();
                if (lastChecksum === null) {
                    setLastChecksum(health.config_checksum);
                } else if (health.config_checksum !== lastChecksum) {
                    window.location.reload();
                }
            } catch (e) {
                console.error("Failed to check health", e);
            }
        }, 5000); // Check every 5 seconds for config changes

        return () => clearInterval(interval);
    }, [lastChecksum]);

    if (loading) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-black text-white">
                <Sun className="w-16 h-16 animate-spin-slow text-yellow-400" />
                <p className="mt-4 text-2xl font-light tracking-wider">Cargando Pantalla Reloj...</p>
            </div>
        );
    }

    if (error) {
        return <div className="w-screen h-screen flex items-center justify-center bg-red-900 text-white text-xl">{error}</div>;
    }

    return (
        <ConfigContext.Provider value={config}>
            <HashRouter>
                <div className="relative w-screen h-screen bg-black">
                    <nav className="absolute top-2 right-2 z-50">
                        <Link to="/" className="p-2 m-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition-all">
                            <Sun size={20} />
                        </Link>
                        <Link to="/config" className="p-2 m-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-80 transition-all">
                            <Wrench size={20} />
                        </Link>
                    </nav>
                    <Routes>
                        <Route path="/" element={<Kiosk />} />
                        <Route path="/config" element={<ConfigPage onConfigSave={loadConfig} />} />
                    </Routes>
                </div>
            </HashRouter>
        </ConfigContext.Provider>
    );
};

export default App;