

import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Calendar, BookOpen, Newspaper, Leaf, Church } from 'lucide-react';
import { fetchAstronomyData, fetchCalendarEvents, fetchEphemerides, fetchNews, fetchSeasonalData, fetchSantoralData } from '../services/api';
import type { AstronomyData, CalendarEvent, EphemeridesData, NewsItem, SeasonalData, SeasonalDataItem, SantoralData } from '../types';
import { MoonIcon } from './MoonIcon';
import { ProduceIcon } from './ProduceIcon';

type CarouselItem = {
    id: 'astro' | 'calendar' | 'ephemerides' | 'news' | 'seasonal' | 'santoral';
    title: string;
    icon: React.ElementType;
    content: React.ReactNode;
};

const renderSeasonalList = (items: SeasonalDataItem[]) => (
    <div className="flex flex-col space-y-2">
        {items.map(item => (
            <div key={item.name} className="flex items-center space-x-2">
                <ProduceIcon iconName={item.icon} className="w-6 h-6" />
                <span className="text-gray-200 text-sm">{item.name}</span>
            </div>
        ))}
    </div>
);


export const InfoCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [items, setItems] = useState<CarouselItem[]>([]);

    const fetchData = useCallback(async () => {
        const newItems: CarouselItem[] = [];

        try {
            const astro = await fetchAstronomyData();
            newItems.push({
                id: 'astro',
                title: 'Astronomía',
                icon: Sun,
                content: (
                    <div className="flex justify-around items-center h-full text-center w-full">
                        <div>
                            <p className="text-gray-400 text-sm">Amanecer</p>
                            <p className="text-2xl font-semibold">{astro.sunrise}</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <MoonIcon iconName={astro.moon_phase_icon} className="w-12 h-12" />
                            <p className="text-sm mt-1">{astro.moon_phase}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Atardecer</p>
                            <p className="text-2xl font-semibold">{astro.sunset}</p>
                        </div>
                    </div>
                )
            });
        } catch (e) { console.error('Failed to fetch astronomy data', e); }

        try {
            const seasonal = await fetchSeasonalData();
            newItems.push({
                id: 'seasonal',
                title: `Productos de ${seasonal.month}`,
                icon: Leaf,
                content: (
                    <div className="grid grid-cols-3 gap-4 text-left w-full">
                        <div>
                            <h4 className="font-semibold text-gray-300 text-md mb-2">Frutas</h4>
                            {renderSeasonalList(seasonal.fruits)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-300 text-md mb-2">Verduras</h4>
                            {renderSeasonalList(seasonal.vegetables)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-300 text-md mb-2">Siembra</h4>
                            {renderSeasonalList(seasonal.sowing)}
                        </div>
                    </div>
                )
            });
        } catch (e) { console.error('Failed to fetch seasonal data', e); }


        try {
            const events = await fetchCalendarEvents();
            if (events.length > 0) {
                 newItems.push({
                    id: 'calendar',
                    title: 'Próximos Eventos',
                    icon: Calendar,
                    content: (
                        <ul className="space-y-3">
                            {events.slice(0, 2).map(event => (
                                <li key={event.summary}>
                                    <p className="font-semibold text-md">{event.summary}</p>
                                    <p className="text-sm text-gray-400">{new Date(event.start).toLocaleString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </li>
                            ))}
                        </ul>
                    )
                });
            }
        } catch (e) { console.error('Failed to fetch calendar events', e); }

        try {
            const santoral = await fetchSantoralData();
            if (santoral.saints.length > 0) {
                newItems.push({
                    id: 'santoral',
                    title: 'Santoral de Hoy',
                    icon: Church,
                    content: (
                        <p className="text-gray-300 text-md leading-relaxed">
                            {santoral.saints.join(', ')}
                        </p>
                    )
                });
            }
        } catch (e) { console.error('Failed to fetch santoral data', e); }

        try {
            const ephemerides = await fetchEphemerides();
             if (ephemerides.events.length > 0) {
                 newItems.push({
                    id: 'ephemerides',
                    title: `Tal día como hoy: ${ephemerides.date}`,
                    icon: BookOpen,
                    content: <p className="text-gray-300 text-md leading-relaxed">{ephemerides.events[0]}</p>
                });
            }
        } catch (e) { console.error('Failed to fetch ephemerides', e); }
        
        try {
            const news = await fetchNews();
            if (news.length > 0) {
                newItems.push({
                    id: 'news',
                    title: 'Últimos Titulares',
                    icon: Newspaper,
                    content: (
                         <ul className="space-y-2">
                            {news.slice(0, 2).map(item => (
                                <li key={item.title}>
                                    <p className="font-semibold text-md">{item.title}</p>
                                    <p className="text-sm text-gray-400">{item.source}</p>
                                </li>
                            ))}
                        </ul>
                    )
                });
            }
        } catch (e) { console.error('Failed to fetch news', e); }


        setItems(newItems);

    }, []);

    useEffect(() => {
        fetchData();
        const refreshInterval = setInterval(fetchData, 600000); // Refresh data every 10 mins
        return () => clearInterval(refreshInterval);
    }, [fetchData]);


    useEffect(() => {
        if(items.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 10000); // Change panel every 10 seconds
        return () => clearInterval(interval);
    }, [items.length]);

    if (items.length === 0) {
        return <div className="bg-black bg-opacity-30 p-4 rounded-lg backdrop-blur-sm h-full flex items-center justify-center"><p>Cargando información...</p></div>;
    }

    const currentItem = items[currentIndex];
    const Icon = currentItem.icon;

    return (
        <div className="bg-black bg-opacity-30 p-4 rounded-lg backdrop-blur-sm h-full flex flex-col">
            <div className="flex items-center space-x-3 text-gray-300 mb-3 border-b border-gray-700 pb-2">
                <Icon size={18} />
                <h3 className="font-semibold text-lg">{currentItem.title}</h3>
            </div>
            <div className="flex-grow flex items-center">
                {currentItem.content}
            </div>
        </div>
    );
};