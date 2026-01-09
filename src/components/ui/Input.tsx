import { type InputHTMLAttributes, type TextareaHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

const baseStyle: CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    marginTop: '8px',
    boxSizing: 'border-box'
};

export function Input({ label, icon, style, ...props }: InputProps) {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            {label && <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '4px' }}>{label}</label>}
            <div style={{ position: 'relative' }}>
                {icon && (
                    <div style={{
                        position: 'absolute',
                        left: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)',
                        pointerEvents: 'none',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        {icon}
                    </div>
                )}
                <input
                    style={{ ...baseStyle, paddingLeft: icon ? '48px' : '16px', ...style }}
                    {...props}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                />
            </div>
        </div>
    );
}

export function TextArea({ label, style, ...props }: TextAreaProps) {
    return (
        <div style={{ marginBottom: '16px', width: '100%' }}>
            {label && <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '4px' }}>{label}</label>}
            <textarea
                style={{ ...baseStyle, minHeight: '100px', resize: 'vertical', ...style }}
                {...props}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
        </div>
    );
}
