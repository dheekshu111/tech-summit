import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { Clock, User } from 'lucide-react';

interface SessionListProps {
    onSessionClick: (id: string) => void;
}

export function SessionList({ onSessionClick }: SessionListProps) {
    const sessions = useLiveQuery(() =>
        db.sessions.orderBy('date').reverse().toArray()
    );

    if (!sessions || sessions.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                opacity: 0.7
            }}>
                <p>No sessions tracked yet.</p>
                <p style={{ fontSize: '0.9rem' }}>Tap "+" to add one.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
            {sessions.map(session => (
                <Card key={session.id} onClick={() => onSessionClick(session.id)}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'white' }}>
                        {session.title}
                    </h3>

                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <User size={14} /> {session.speaker || 'Unknown'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Truncated Notes Preview */}
                    {session.notes && (
                        <p style={{
                            margin: '0',
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                        }}>
                            {session.notes}
                        </p>
                    )}
                </Card>
            ))}
        </div>
    );
}
