import React, { useState } from 'react';
import { updateConfigGroup, testConfigGroup } from '../services/api';
import type { AppConfig } from '../types';
import { X, Plus } from 'lucide-react';

interface ConfigCardProps {
    groupName: keyof AppConfig;
    initialData: any;
    onSave: () => void;
}

const knownSelectOptions: Record<string, string[]> = {
    'provider': ['MapTiler', 'OSM', 'Open-Meteo', 'OpenWeatherMap', 'aisstream', 'opensky'],
    'units': ['metric', 'imperial'],
    'language': ['es', 'en'],
    'log_level': ['DEBUG', 'INFO', 'WARNING', 'ERROR'],
};

export const ConfigCard: React.FC<ConfigCardProps> = ({ groupName, initialData, onSave }) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, path: string) => {
        const { value, type } = e.target;
        
        const isCheckbox = type === 'checkbox';
        const isNumber = e.target.getAttribute('data-type') === 'number' || type === 'number';

        let finalValue: any = value;
        if (isCheckbox) {
            finalValue = (e.target as HTMLInputElement).checked;
        } else if (isNumber) {
            finalValue = Number(value);
        } else if (e.target.getAttribute('data-type') === 'array-number') {
            finalValue = value.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
        } else if (e.target.getAttribute('data-type') === 'array-string') {
             finalValue = value.split(',').map(s => s.trim());
        }

        const keys = path.split('.');
        
        setData((prev: any) => {
            const newState = JSON.parse(JSON.stringify(prev));
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = finalValue;
            return newState;
        });
    };
    
    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await updateConfigGroup(groupName, data);
            setMessage({ type: 'success', text: '¡Guardado correctamente!' });
            onSave();
        } catch (error) {
            setMessage({ type: 'error', text: `Error al guardar: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleTest = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const result = await testConfigGroup(groupName);
            setMessage({ type: 'success', text: `Prueba OK: ${result.message}` });
        } catch (error) {
            setMessage({ type: 'error', text: `Prueba fallida: ${error instanceof Error ? error.message : String(error)}` });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const renderField = (key: string, value: any, prefix = '') => {
        const path = prefix ? `${prefix}.${key}` : key;
        const id = `config-${groupName}-${path}`;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
                <div key={path} className="pl-3 border-l-2 border-gray-700 mt-3 pt-2">
                    <label className="block text-sm font-medium text-gray-400 capitalize mb-1">{key.replace(/_/g, ' ')}</label>
                    {Object.entries(value).map(([subKey, subValue]) => renderField(subKey, subValue, path))}
                </div>
            );
        }
        
        const isArrayOfObjects = Array.isArray(value) && value.length > 0 && typeof value[0] === 'object';

        if (isArrayOfObjects) {
            // This is handled by a special case in the main render loop if needed, e.g., for news sources.
            // For now, we render it as a JSON string to allow editing.
            return (
                 <div key={path} className="mb-4">
                    <label htmlFor={id} className="block text-sm font-medium text-gray-300 capitalize">{key.replace(/_/g, ' ')}</label>
                    <textarea
                        id={id}
                        value={JSON.stringify(value, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleChange({ target: { value: parsed, type: 'textarea' } } as any, path);
                            } catch (err) {/* Ignore JSON parse errors while typing */}
                        }}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white px-3 py-2 font-mono h-32"
                    />
                 </div>
            )
        }
        
        const isArrayOfNumbers = Array.isArray(value) && (value.length === 0 || typeof value[0] === 'number');
        const isArrayOfStrings = Array.isArray(value) && (value.length === 0 || typeof value[0] === 'string');

        let inputType = 'text';
        let dataType = 'string';
        if (typeof value === 'number') { inputType = 'number'; dataType = 'number';}
        if (typeof value === 'boolean') { inputType = 'checkbox'; dataType = 'boolean';}
        if (isArrayOfNumbers) { inputType = 'text'; dataType = 'array-number';}
        if (isArrayOfStrings) { inputType = 'text'; dataType = 'array-string';}
        
        const isSelect = knownSelectOptions[key];

        return (
            <div key={path} className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-300 capitalize">{key.replace(/_/g, ' ')}</label>
                {inputType === 'checkbox' ? (
                     <input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => handleChange(e, path)} className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500" />
                ) : isSelect ? (
                     <select id={id} value={String(value)} onChange={(e) => handleChange(e, path)} className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white px-3 py-2">
                        {isSelect.map(option => <option key={option} value={option}>{option}</option>)}
                     </select>
                ) : (
                    <input
                        id={id} type={inputType} value={Array.isArray(value) ? value.join(', ') : String(value)}
                        onChange={(e) => handleChange(e, path)}
                        data-type={dataType}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white px-3 py-2"
                        step={inputType === 'number' && (String(value).includes('.') ? '0.1' : '1')}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold capitalize mb-4 border-b border-gray-700 pb-2">{groupName.replace(/_/g, ' ')}</h2>
            <div className="flex-grow">
                {Object.entries(data).map(([key, value]) => renderField(key, value))}
            </div>
            {message && (
                <div className={`p-2 rounded text-sm mb-4 ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                    {message.text}
                </div>
            )}
            <div className="mt-4 flex space-x-2">
                <button onClick={handleSave} disabled={loading} className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={handleTest} disabled={loading} className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
                    {loading ? 'Probando...' : 'Probar'}
                </button>
            </div>
        </div>
    );
};
