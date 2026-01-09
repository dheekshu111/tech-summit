import { NavLink } from 'react-router-dom';
import { Mic, Store, Users } from 'lucide-react';

export function BottomNav() {
    const navItems = [
        { path: '/sessions', label: 'Sessions', icon: Mic },
        { path: '/booths', label: 'Booths', icon: Store },
        { path: '/network', label: 'Network', icon: Users },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '400px',
            height: '70px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)', // Safari support
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
            {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink
                    key={path}
                    to={path}
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'translateY(-2px)' : 'none',
                        flex: 1,
                        height: '100%'
                    })}
                >
                    {({ isActive }) => (
                        <>
                            <Icon
                                size={24}
                                strokeWidth={isActive ? 2.5 : 2}
                                style={{
                                    filter: isActive ? 'drop-shadow(0 0 8px var(--primary-glow))' : 'none',
                                    marginBottom: '4px'
                                }}
                            />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isActive ? 600 : 400
                            }}>
                                {label}
                            </span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}
