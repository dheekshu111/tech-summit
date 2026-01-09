import { type ButtonHTMLAttributes, type CSSProperties } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    style,
    ...props
}: ButtonProps) {

    const baseStyle: CSSProperties = {
        padding: '12px 24px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-heading)',
    };

    const variants = {
        primary: {
            background: 'linear-gradient(135deg, var(--primary), #8a2be2)',
            color: 'white',
            boxShadow: '0 4px 12px var(--primary-glow)',
        },
        secondary: {
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'var(--text-main)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-muted)',
        }
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant], ...style }}
            {...props}
        >
            {children}
        </button>
    );
}
