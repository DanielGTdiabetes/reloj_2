import React from 'react';
import type { NewsItem } from '../types';
import './NewsTicker.css';

interface NewsTickerProps {
    items: NewsItem[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ items }) => {
    const fullText = items.map(item => `${item.source.toUpperCase()}: ${item.title}`).join(' ••• ');

    return (
        <div className="bg-black bg-opacity-50 backdrop-blur-sm p-2 rounded-lg overflow-hidden whitespace-nowrap">
            <div className="ticker-wrap">
                <div className="ticker-move">
                    <span className="ticker-item">{fullText}</span>
                    <span className="ticker-item">{fullText}</span>
                </div>
            </div>
        </div>
    );
};
