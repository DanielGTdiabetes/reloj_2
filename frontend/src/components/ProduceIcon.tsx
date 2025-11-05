import React from 'react';

// Source: SVGs created from various sources, licensed under MIT or similar permissive licenses.

const Strawberry = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path fill="#e53e3e" d="M12 2C8.686 2 6 4.686 6 8c0 3.313 2.686 6 6 6s6-2.687 6-6c0-3.314-2.686-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
        <path fill="#48bb78" d="M12 2c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm-3 4.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1zm6 0a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h1a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-1z" />
        <path fill="#e53e3e" d="M6.343 15.657a8 8 0 0011.314 0L12 21l-5.657-5.343z" />
        <circle cx="9" cy="9" r=".5" fill="#f6e05e" />
        <circle cx="15" cy="9" r=".5" fill="#f6e05e" />
        <circle cx="12" cy="7" r=".5" fill="#f6e05e" />
        <circle cx="10" cy="11" r=".5" fill="#f6e05e" />
        <circle cx="14" cy="11" r=".5" fill="#f6e05e" />
    </svg>
);

const Cherries = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path fill="#38a169" d="M14 2a4 4 0 0 1 4 4v1.5a.5.5 0 0 1-1 0V6a3 3 0 0 0-3-3H9.5a.5.5 0 0 1 0-1H14z" />
        <path fill="#38a169" d="M13.5 2.5a.5.5 0 0 1 .5.5v5.36l-1.85-1.85a.5.5 0 0 1 .7-.7L15 8.29V3a.5.5 0 0 1 .5-.5c.28 0 .5.22.5.5v10.7a.5.5 0 0 1-.85.35l-7-7a.5.5 0 0 1 .7-.7l6.65 6.64V3a.5.5 0 0 1 .5-.5z"/>
        <circle fill="#c53030" cx="17.5" cy="16.5" r="4.5" />
        <circle fill="#c53030" cx="9.5" cy="18.5" r="4.5" />
    </svg>
);

const Loquat = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="14" rx="6" ry="8" fill="#f6ad55"/>
        <path d="M12 2a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3z" fill="#805ad5"/>
        <path d="M11 2v4h2V2a1 1 0 0 0-2 0z" fill="#6b46c1"/>
    </svg>
);

const Asparagus = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M12 2C9.24 2 7 4.24 7 7v13h2V7c0-1.65 1.35-3 3-3s3 1.35 3 3v13h2V7c0-2.76-2.24-5-5-5z" fill="#68d391"/>
        <path d="M11 6h2v15h-2z" fill="#48bb78"/>
        <path d="M9 10l-2-1v6l2 1z" fill="#48bb78"/>
        <path d="M15 10l2-1v6l-2 1z" fill="#48bb78"/>
        <path d="M10 14l-2-1v4l2 1z" fill="#48bb78"/>
        <path d="M14 14l2-1v4l-2 1z" fill="#48bb78"/>
    </svg>
);

const Carrot = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M12 2L9 6h6z" fill="#48bb78"/>
        <path d="M11 5h2v2h-2z" fill="#38a169"/>
        <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2h0c5.52 0 10 4.48 10 10s-4.48 10-10 10z" transform="matrix(.8 0 0 1 2.4 0)" fill="#f56565"/>
        <path d="M12 6L9 22h6z" fill="#ed8936"/>
    </svg>
);

const Peas = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8-8-3.58-8-8z" fill="#68d391"/>
        <path d="M4.05 11.5a8 8 0 0 1 15.9 0H4.05z" fill="#9ae6b4"/>
        <circle cx="8" cy="12" r="1.5" fill="#48bb78"/>
        <circle cx="12" cy="12" r="1.5" fill="#48bb78"/>
        <circle cx="16" cy="12" r="1.5" fill="#48bb78"/>
    </svg>
);

const Lettuce = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#68d391"/>
        <path d="M12 4c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" fill="#9ae6b4"/>
        <path d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#c6f6d5"/>
    </svg>
);

const Tomato = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#e53e3e"/>
        <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#48bb78"/>
        <path d="M11 2v4h2V2a1 1 0 0 0-2 0z" fill="#38a169"/>
    </svg>
);

const Zucchini = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <path d="M17 2H7C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5z" fill="#68d391"/>
        <path d="M17 4H7C5.35 4 4 5.35 4 7v10c0 1.65 1.35 3 3 3h10c1.65 0 3-1.35 3-3V7c0-1.65-1.35-3-3-3z" fill="#9ae6b4"/>
        <path d="M16 6h-2v2h2zm-4 0h-2v2h2zm-4 0H6v2h2zm8 4h-2v2h2zm-4 0h-2v2h2zm-4 0H6v2h2zm8 4h-2v2h2zm-4 0h-2v2h2zm-4 0H6v2h2z" fill="#c6f6d5"/>
    </svg>
);

const Lemon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="12" rx="8" ry="10" fill="#f6e05e"/>
        <path d="M12 2C8 2 5 5 5 9c0 4 3 7 7 7s7-3 7-7c0-4-3-7-7-7z" fill="#fbbf24"/>
        <circle cx="9" cy="10" r="1" fill="#fef3c7"/>
        <circle cx="15" cy="10" r="1" fill="#fef3c7"/>
        <circle cx="12" cy="14" r="1.5" fill="#fef3c7"/>
    </svg>
);

const Orange = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="10" fill="#f97316"/>
        <circle cx="12" cy="12" r="8" fill="#fb923c"/>
        <circle cx="9" cy="9" r="1" fill="#fed7aa" opacity="0.6"/>
        <circle cx="15" cy="9" r="1" fill="#fed7aa" opacity="0.6"/>
        <circle cx="12" cy="15" r="1" fill="#fed7aa" opacity="0.6"/>
        <path d="M12 2L10 6h4z" fill="#84cc16"/>
    </svg>
);

const Fig = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="14" rx="6" ry="8" fill="#7c3aed"/>
        <path d="M12 2C10 2 8 4 8 6v2h8V6c0-2-2-4-4-4z" fill="#5b21b6"/>
        <path d="M10 4h4v2h-4z" fill="#4c1d95"/>
    </svg>
);

const Melon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="12" rx="10" ry="8" fill="#84cc16"/>
        <ellipse cx="12" cy="12" rx="8" ry="6" fill="#a3e635"/>
        <path d="M2 12h20M12 4v16" stroke="#65a30d" strokeWidth="1" opacity="0.5"/>
        <circle cx="8" cy="10" r="0.5" fill="#65a30d"/>
        <circle cx="16" cy="10" r="0.5" fill="#65a30d"/>
        <circle cx="12" cy="14" r="0.5" fill="#65a30d"/>
    </svg>
);

const Grape = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <circle cx="10" cy="8" r="3" fill="#9333ea"/>
        <circle cx="14" cy="8" r="3" fill="#a855f7"/>
        <circle cx="8" cy="12" r="3" fill="#9333ea"/>
        <circle cx="12" cy="12" r="3" fill="#a855f7"/>
        <circle cx="16" cy="12" r="3" fill="#9333ea"/>
        <circle cx="10" cy="16" r="3" fill="#a855f7"/>
        <circle cx="14" cy="16" r="3" fill="#9333ea"/>
        <path d="M12 2L11 6h2z" fill="#84cc16"/>
    </svg>
);

const Pomegranate = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <circle cx="12" cy="12" r="9" fill="#dc2626"/>
        <circle cx="12" cy="12" r="7" fill="#ef4444"/>
        <path d="M12 3L10 7h4z" fill="#84cc16"/>
        <circle cx="9" cy="10" r="1" fill="#991b1b"/>
        <circle cx="15" cy="10" r="1" fill="#991b1b"/>
        <circle cx="12" cy="14" r="1" fill="#991b1b"/>
    </svg>
);

const Persimmon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="14" rx="7" ry="9" fill="#ea580c"/>
        <ellipse cx="12" cy="14" rx="5" ry="7" fill="#fb923c"/>
        <path d="M12 2L10 6h4z" fill="#84cc16"/>
        <circle cx="9" cy="12" r="0.8" fill="#c2410c"/>
        <circle cx="15" cy="12" r="0.8" fill="#c2410c"/>
    </svg>
);

const Peach = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="13" rx="7" ry="9" fill="#fbbf24"/>
        <ellipse cx="12" cy="13" rx="5" ry="7" fill="#fde047"/>
        <path d="M12 2L10 5h4z" fill="#84cc16"/>
        <ellipse cx="10" cy="12" rx="1.5" ry="2" fill="#f59e0b" opacity="0.6"/>
    </svg>
);

const Plum = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="13" rx="6" ry="8" fill="#7c3aed"/>
        <ellipse cx="12" cy="13" rx="4" ry="6" fill="#9333ea"/>
        <path d="M12 2L10 5h4z" fill="#84cc16"/>
    </svg>
);

const Apricot = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" {...props}>
        <ellipse cx="12" cy="13" rx="6" ry="8" fill="#f97316"/>
        <ellipse cx="12" cy="13" rx="4" ry="6" fill="#fb923c"/>
        <path d="M12 2L10 5h4z" fill="#84cc16"/>
        <circle cx="10" cy="12" r="0.8" fill="#ea580c"/>
    </svg>
);

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    'strawberry': Strawberry,
    'cherries': Cherries,
    'loquat': Loquat,
    'asparagus': Asparagus,
    'carrot': Carrot,
    'peas': Peas,
    'lettuce': Lettuce,
    'tomato': Tomato,
    'zucchini': Zucchini,
    'lemon': Lemon,
    'orange': Orange,
    'fig': Fig,
    'melon': Melon,
    'grape': Grape,
    'pomegranate': Pomegranate,
    'persimmon': Persimmon,
    'peach': Peach,
    'plum': Plum,
    'apricot': Apricot,
};

interface ProduceIconProps extends React.SVGProps<SVGSVGElement> {
    iconName: string;
}

export const ProduceIcon: React.FC<ProduceIconProps> = ({ iconName, ...props }) => {
    const IconComponent = iconMap[iconName] || Tomato; // Default
    return <IconComponent {...props} />;
};
