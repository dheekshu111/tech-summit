import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X, Mail, Loader2, CheckCircle2 } from 'lucide-react';

interface LoginOverlayProps {
    onClose: () => void;
}

export function LoginOverlay({ onClose }: LoginOverlayProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
        });

        setLoading(false);

        if (error) {
            console.error(error);
            setError(error.message);
        } else {
            setSent(true);
        }
    };

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

                <h2 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.8rem',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    Cloud Sync
                </h2>

                <p style={{
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    marginBottom: '30px',
                    fontSize: '0.95rem'
                }}>
                    Sign in to backup your data and sync across devices.
                </p>

                {sent ? (
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
                        <h3 style={{ margin: '0 0 10px 0' }}>Check your email!</h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            We sent a magic link to <strong>{email}</strong>.
                            <br />Click it to log in.
                        </p>
                        <Button variant="ghost" onClick={onClose} style={{ marginTop: '20px' }}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            label="Email Address"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoFocus
                        />

                        {error && (
                            <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>
                                Error: {error}
                            </p>
                        )}

                        <Button type="submit" disabled={loading} fullWidth>
                            {loading ? <Loader2 className="spin" size={20} /> : <Mail size={20} />}
                            {loading ? 'Sending...' : 'Send Magic Link'}
                        </Button>
                    </form>
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
