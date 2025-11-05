
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
    'provider': ['MapTiler', 'OSM', 'Open-Meteo', 'OpenWeatherMap'],
    'units': ['metric', 'imperial'],
    'language': ['es', 'en'],
    'log_level': ['DEBUG', 'INFO', 'WARNING', 'ERROR'],
};

export const ConfigCard: React.FC<ConfigCardProps> = ({ groupName, initialData, onSave }) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        const isCheckbox = type === 'checkbox';
        const isNumber = type === 'number';

        const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : (isNumber ? Number(value) : value);

        const keys = name.split('.');
        
        setData((prev: any) => {
            const newState = JSON.parse(JSON.stringify(prev)); // Deep copy to avoid mutation
            let current = newState;
            
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = finalValue;
            
            return newState;
        });
    };
    
    const handleAddItem = (key: string) => {
        setData((prev: any) => {
            const currentArray = prev[key] || [];
            // Create a new item with empty strings for keys based on the first item's structure
            const newItem = currentArray.length > 0 
                ? Object.fromEntries(Object.keys(currentArray[0]).map(k => [k, '']))
                : { name: '', url: ''}; // Fallback for news sources
            return {
                ...prev,
                [key]: [...currentArray, newItem]
            };
        });
    };
    
    const handleRemoveItem = (key: string, index: number) => {
         setData((prev: any) => {
            const currentArray = prev[key] || [];
            return {
                ...prev,
                [key]: currentArray.filter((_: any, i: number) => i !== index)
            };
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
        const name = prefix ? `${prefix}.${key}` : key;
        const id = `config-${groupName}-${name}`;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            return (
                <div key={name} className="pl-4 border-l-2 border-gray-700 mt-2">
                    <label className="block text-sm font-medium text-gray-400 capitalize mb-1">{key}</label>
                    {Object.entries(value).map(([subKey, subValue]) => renderField(subKey, subValue, name))}
                </div>
            );
        }
        
        if (Array.isArray(value)) {
             return (
                 <div key={name} className="mt-4">
                     <label className="block text-lg font-medium text-gray-300 capitalize mb-2">{key.replace(/_/g, ' ')}</label>
                     {value.map((item, index) => (
                         <div key={index} className="p-3 border border-gray-700 rounded-md mb-3 relative">
                            <button onClick={() => handleRemoveItem(key, index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-400">
                                <X size={16}/>
                            </button>
                             {Object.entries(item).map(([itemKey, itemValue]) =>
                                 renderField(itemKey, itemValue, `${name}.${index}`)
                             )}
                         </div>
                     ))}
                     <button onClick={() => handleAddItem(key)} className="flex items-center text-sm text-indigo-400 hover:text-indigo-300">
                         <Plus size={16} className="mr-1" /> {key === 'sources' ? 'Añadir fuente' : `Añadir ${key.slice(0,-1)}`}
                     </button>
                 </div>
             );
        }

        let inputType = 'text';
        if (typeof value === 'number') inputType = 'number';
        if (typeof value === 'boolean') inputType = 'checkbox';
        
        const isSelect = knownSelectOptions[key];

        return (
            <div key={name} className="mb-4">
                <label htmlFor={id} className="block text-sm font-medium text-gray-300 capitalize">{key.replace(/_/g, ' ')}</label>
                {inputType === 'checkbox' ? (
                     <input
                        id={id}
                        name={name}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                    />
                ) : isSelect ? (
                     <select
                        id={id}
                        name={name}
                        value={String(value)}
                        onChange={handleChange}
                         className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-white px-3 py-2"
                     >
                        {isSelect.map(option => <option key={option} value={option}>{option}</option>)}
                     </select>
                ) : (
                    <input
                        id={id}
                        name={name}
                        type={inputType}
                        value={String(value)}
                        onChange={handleChange}
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
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                    onClick={handleTest}
                    disabled={loading}
                    className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                    {loading ? 'Probando...' : 'Probar'}
                </button>
            </div>
        </div>
    );
};