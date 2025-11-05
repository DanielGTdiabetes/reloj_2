import React, { useState } from 'react';
import { scanWifi, connectWifi } from '../services/api';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface Network {
    ssid: string;
    signal: number;
}

export const WifiCard: React.FC = () => {
    const [networks, setNetworks] = useState<Network[]>([]);
    const [scanning, setScanning] = useState(false);
    const [connecting, setConnecting] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleScan = async () => {
        setScanning(true);
        setMessage(null);
        setNetworks([]);
        try {
            const result = await scanWifi();
            setNetworks(result);
            if (result.length === 0) {
                 setMessage({ type: 'error', text: 'No se encontraron redes.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error al escanear: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
            setScanning(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSsid) return;

        setConnecting(selectedSsid);
        setMessage(null);
        try {
            const result = await connectWifi(selectedSsid, password);
            if (result.ok) {
                setMessage({ type: 'success', text: result.message });
                setSelectedSsid(null);
                setPassword('');
            } else {
                 setMessage({ type: 'error', text: result.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error de conexión: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
            setConnecting(null);
            setTimeout(() => setMessage(null), 5000);
        }
    };
    
    const getSignalIcon = (signal: number) => {
        if (signal > 75) return <Wifi className="text-green-400" size={20} />;
        if (signal > 50) return <Wifi className="text-yellow-400" size={20} />;
        if (signal > 25) return <Wifi className="text-orange-400" size={20} />;
        return <WifiOff className="text-red-400" size={20} />;
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center">
                <Wifi size={22} className="mr-2"/> Gestión de Wi-Fi
            </h2>
            <div className="flex-grow">
                <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                    {scanning ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Buscando...
                        </>
                    ) : 'Buscar Redes'}
                </button>

                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                    {networks.map(net => (
                        <div key={net.ssid}>
                            <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
                                <div className="flex items-center space-x-3">
                                    {getSignalIcon(net.signal)}
                                    <span className="font-medium">{net.ssid}</span>
                                </div>
                                <button 
                                    onClick={() => setSelectedSsid(net.ssid)}
                                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                                    disabled={connecting === net.ssid}
                                >
                                     {connecting === net.ssid ? '...' : 'Conectar'}
                                </button>
                            </div>
                            {selectedSsid === net.ssid && (
                                <form onSubmit={handleConnect} className="p-3 bg-gray-700 rounded-b-md">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Introduce la contraseña"
                                        className="block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white px-3 py-2"
                                        autoFocus
                                    />
                                    <button type="submit" className="mt-2 w-full text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                                        Enviar
                                    </button>
                                </form>
                            )}
                        </div>
                    ))}
                </div>

            </div>
             {message && (
                <div className={`p-2 rounded text-sm mt-4 ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
