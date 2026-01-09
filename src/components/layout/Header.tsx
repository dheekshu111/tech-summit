import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { UserProfileOverlay } from '../../features/auth/UserProfileOverlay';
import { User, UserCircle } from 'lucide-react';

export function Header() {
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [hasUser, setHasUser] = useState(false);

    // Determine Title based on route
    const getTitle = () => {
        switch (location.pathname) {
            case '/sessions': return 'Sessions';
            case '/booths': return 'Booths';
            case '/network': return 'Network';
            default: return 'Conference';
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setHasUser(!!session?.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setHasUser(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <>
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: 'rgba(26, 26, 46, 0.8)', // Semi-transparent match to body bg
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontFamily: 'var(--font-heading)',
                    background: 'linear-gradient(to right, #fff, #ccc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {getTitle()}
                </h1>

                <button
                    onClick={() => setIsProfileOpen(true)}
                    style={{
                        background: hasUser ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: hasUser ? 'white' : 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {hasUser ? <User size={20} /> : <UserCircle size={24} />}
                </button>
            </header>

            {isProfileOpen && (
                <UserProfileOverlay onClose={() => setIsProfileOpen(false)} />
            )}
        </>
    );
}
