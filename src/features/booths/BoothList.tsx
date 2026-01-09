import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { Calendar, CheckCircle2, User } from 'lucide-react';

interface BoothListProps {
    onBoothClick: (id: string) => void;
}

export function BoothList({ onBoothClick }: BoothListProps) {
    const booths = useLiveQuery(() =>
        db.booths.orderBy('company').toArray()
    );

    if (!booths || booths.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                opacity: 0.7
            }}>
                <p>No booths visited yet.</p>
                <p style={{ fontSize: '0.9rem' }}>Go talk to some people!</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
            {booths.map(booth => (
                <Card key={booth.id} onClick={() => onBoothClick(booth.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'white' }}>
                            {booth.company}
                        </h3>
                        {booth.applied && (
                            <span style={{
                                background: 'var(--accent)',
                                color: 'white',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                <CheckCircle2 size={12} /> APPLICATION DUE
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>
                        {booth.repName && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={14} color="var(--primary)" /> {booth.repName}
                            </span>
                        )}
                        {booth.deadline && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff6b6b' }}>
                                <Calendar size={14} />
                                Due: {new Date(booth.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {booth.notes && (
                        <p style={{
                            margin: '0',
                            fontSize: '0.95rem',
                            color: 'rgba(255,255,255,0.8)',
                            lineHeight: '1.4',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '10px',
                            borderRadius: '8px'
                        }}>
                            {booth.notes}
                        </p>
                    )}
                </Card>
            ))}
        </div>
    );
}
