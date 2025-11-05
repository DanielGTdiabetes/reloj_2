
import React from 'react';

// Source: https://www.figma.com/community/file/1108993324681326758 (MIT License)

const NewMoon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="gradNewMoon" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradNewMoon)" />
    </svg>
);

const WaxingCrescent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradDark)" />
        <path d="M 50 0 A 50 50 0 0 1 50 100 A 30 50 0 0 0 50 0 Z" fill="url(#gradLight)" />
    </svg>
);

const FirstQuarter = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradDark)" />
        <path d="M 50 0 A 50 50 0 0 1 50 100 L 50 0 Z" fill="url(#gradLight)" />
    </svg>
);

const WaxingGibbous = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradLight)" />
        <path d="M 50 0 A 50 50 0 0 1 50 100 A 30 50 0 0 0 50 0 Z" fill="url(#gradDark)" transform="rotate(180 50 50)" />
    </svg>
);

const FullMoon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
        <defs>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradLight)" />
    </svg>
);

const WaningGibbous = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
         <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradLight)" />
        <path d="M 50 0 A 50 50 0 0 0 50 100 A 30 50 0 0 1 50 0 Z" fill="url(#gradDark)" />
    </svg>
);

const ThirdQuarter = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
         <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradDark)" />
        <path d="M 50 0 A 50 50 0 0 0 50 100 L 50 0 Z" fill="url(#gradLight)" />
    </svg>
);

const WaningCrescent = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 100 100" {...props}>
         <defs>
            <radialGradient id="gradDark" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#4A5568', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2D3748', stopOpacity: 1 }} />
            </radialGradient>
            <radialGradient id="gradLight" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="85%" style={{ stopColor: '#F7FAFC', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#E2E8F0', stopOpacity: 1 }} />
            </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="50" fill="url(#gradDark)" />
        <path d="M 50 0 A 50 50 0 0 0 50 100 A 30 50 0 0 1 50 0 Z" fill="url(#gradLight)" />
    </svg>
);


const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'new-moon': NewMoon,
    'waxing-crescent': WaxingCrescent,
    'first-quarter': FirstQuarter,
    'waxing-gibbous': WaxingGibbous,
    'full-moon': FullMoon,
    'waning-gibbous': WaningGibbous,
    'third-quarter': ThirdQuarter,
    'waning-crescent': WaningCrescent,
};

interface MoonIconProps extends React.SVGProps<SVGSVGElement> {
    iconName: string;
}

export const MoonIcon: React.FC<MoonIconProps> = ({ iconName, ...props }) => {
    const IconComponent = iconMap[iconName] || NewMoon; // Default to NewMoon
    return <IconComponent {...props} />;
};
