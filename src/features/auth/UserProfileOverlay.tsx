import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { syncData } from '../../lib/sync';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X, Mail, Loader2, LogOut, RefreshCw, Cloud, CheckCircle2, Lock, User as UserIcon } from 'lucide-react';
import { type User } from '@supabase/supabase-js';

interface UserProfileOverlayProps {
    onClose: () => void;
}

export function UserProfileOverlay({ onClose }: UserProfileOverlayProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Auth State
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Sync State
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('lastSyncTime'));

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !username) {
            setError('All fields are required');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else if (data.user) {
            // Check if email confirmation is required
            if (data.session) {
                // User is automatically logged in (email confirmation disabled in Supabase)
                setUser(data.user);
                setSuccess('Account created successfully!');
            } else {
                // Email confirmation required
                setSuccess('Account created! Please check your email to verify before signing in.');
            }
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        setError('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) {
            setError(error.message);
        } else if (data.user) {
            setUser(data.user);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        onClose();
    };

    const handleSync = async () => {
        setIsSyncing(true);
        await syncData();
        const time = new Date().toLocaleString();
        setLastSync(time);
        localStorage.setItem('lastSyncTime', time);
        setIsSyncing(false);
    };

    const displayName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '30px',
                width: '100%',
                maxWidth: '400px',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                {/* LOGGED IN VIEW */}
                {user ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '80px', height: '80px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: 'bold', color: 'white'
                        }}>
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)' }}>{displayName}</h2>
                            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {user.email}
                            </p>
                        </div>

                        <div style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Cloud size={18} color="#32cd32" />
                                    <span style={{ fontSize: '0.9rem' }}>Cloud Sync Active</span>
                                </div>
                                {lastSync && (
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        Last: {lastSync}
                                    </span>
                                )}
                            </div>

                            <Button onClick={handleSync} disabled={isSyncing} fullWidth variant="secondary">
                                <RefreshCw size={16} className={isSyncing ? 'spin' : ''} />
                                {isSyncing ? 'Syncing...' : 'Sync Now'}
                            </Button>
                        </div>

                        <Button onClick={handleLogout} variant="ghost" fullWidth style={{ color: '#ff6b6b' }}>
                            <LogOut size={18} /> Sign Out
                        </Button>
                    </div>
                ) : (
                    /* LOGGED OUT VIEW */
                    <>
                        <h2 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.8rem',
                            marginBottom: '10px',
                            textAlign: 'center'
                        }}>
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </h2>

                        <p style={{
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            marginBottom: '20px',
                            fontSize: '0.95rem'
                        }}>
                            {mode === 'signin'
                                ? 'Sign in to sync your data across devices'
                                : 'Sign up to backup your conference data'}
                        </p>

                        {/* Mode Switcher */}
                        <div style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '4px',
                            borderRadius: '12px',
                            marginBottom: '20px'
                        }}>
                            <button
                                onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: mode === 'signin' ? 'var(--primary)' : 'transparent',
                                    color: mode === 'signin' ? 'white' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: mode === 'signup' ? 'var(--primary)' : 'transparent',
                                    color: mode === 'signup' ? 'white' : 'var(--text-muted)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Sign Up
                            </button>
                        </div>

                        {success ? (
                            <div style={{ textAlign: 'center', animation: 'scaleIn 0.3s ease' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    padding: '16px',
                                    background: 'rgba(50, 205, 50, 0.1)',
                                    borderRadius: '50%',
                                    color: '#32cd32',
                                    marginBottom: '20px'
                                }}>
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 style={{ margin: '0 0 10px 0' }}>Success!</h3>
                                <p style={{ color: 'var(--text-muted)' }}>
                                    {success}
                                </p>
                                <Button variant="ghost" onClick={onClose} style={{ marginTop: '20px' }}>
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {mode === 'signup' && (
                                    <Input
                                        type="text"
                                        placeholder="Username"
                                        label="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        icon={<UserIcon size={18} />}
                                        autoFocus
                                    />
                                )}

                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    label="Email Address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    icon={<Mail size={18} />}
                                    autoFocus={mode === 'signin'}
                                />

                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    label="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    icon={<Lock size={18} />}
                                />

                                {error && (
                                    <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>
                                        {error}
                                    </p>
                                )}

                                <Button type="submit" disabled={loading} fullWidth>
                                    {loading ? <Loader2 className="spin" size={20} /> : null}
                                    {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                                </Button>
                            </form>
                        )}
                    </>
                )}
            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
