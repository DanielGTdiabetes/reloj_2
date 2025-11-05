import React, { useState } from 'react';
import { uploadIcsFile, updateConfigGroup } from '../services/api';
import type { CalendarConfig } from '../types';
import { Calendar, UploadCloud, Loader2 } from 'lucide-react';

interface CalendarConfigCardProps {
    initialData: CalendarConfig;
    onSave: () => void;
}

export const CalendarConfigCard: React.FC<CalendarConfigCardProps> = ({ initialData, onSave }) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [fileName, setFileName] = useState<string | undefined>(initialData.ics_filename);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setMessage(null);
        setFileName(file.name);

        try {
            const result = await uploadIcsFile(file);
            if (result.ok) {
                setMessage({ type: 'success', text: result.message });
                // Update the config state with the new filename
                const newData = { ...data, ics_filename: file.name };
                setData(newData);
                await updateConfigGroup('calendar', newData);
                onSave();
            } else {
                setMessage({ type: 'error', text: result.message });
                 setFileName(initialData.ics_filename); // Revert on failure
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Error al subir: ${error instanceof Error ? error.message : String(error)}` });
            setFileName(initialData.ics_filename); // Revert on failure
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col">
            <h2 className="text-xl font-bold capitalize mb-4 border-b border-gray-700 pb-2 flex items-center">
                <Calendar size={20} className="mr-2" /> Calendario
            </h2>
            <div className="flex-grow">
                <p className="text-sm text-gray-400 mb-2">Sube un fichero .ics para sincronizar tus eventos.</p>
                 <label htmlFor="ics-upload" className="w-full inline-flex justify-center items-center py-2 px-4 border border-dashed border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer">
                    {loading ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <UploadCloud size={16} className="mr-2"/>
                    )}
                    <span>{fileName ? `Cambiar fichero (${fileName})` : 'Seleccionar fichero .ics'}</span>
                 </label>
                 <input id="ics-upload" type="file" accept=".ics" className="hidden" onChange={handleFileChange} disabled={loading} />
            </div>
            {message && (
                <div className={`p-2 rounded text-sm mt-4 ${message.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
