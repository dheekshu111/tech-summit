import { type ReactNode, type CSSProperties } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    style?: CSSProperties;
}

export function Card({ children, className = '', onClick, style }: CardProps) {
    return (
        <div
            onClick={onClick}
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, background 0.2s ease',
                ...style
            }}
            className={className}
            onMouseEnter={e => {
                if (onClick) e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
                if (onClick) e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {children}
        </div>
    );
}
