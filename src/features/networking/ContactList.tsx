import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../lib/db';
import { Card } from '../../components/ui/Card';
import { Building2, Linkedin } from 'lucide-react';

interface ContactListProps {
    onContactClick: (id: string) => void;
}

export function ContactList({ onContactClick }: ContactListProps) {
    const contacts = useLiveQuery(() =>
        db.connections.toArray()
    );

    if (!contacts || contacts.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'var(--text-muted)',
            }}>
                <p>No connections yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contacts.map(contact => (
                <Card key={contact.id} onClick={() => onContactClick(contact.id)} style={{ cursor: 'pointer' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'white' }}>
                        {contact.name}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', marginBottom: '8px' }}>
                        <Building2 size={14} />
                        <span>{contact.company}</span>
                        <span style={{ opacity: 0.5 }}>|</span>
                        <span>{contact.role}</span>
                    </div>

                    {contact.linkedin && (
                        <a
                            href={contact.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#0077b5',
                                textDecoration: 'none',
                                fontSize: '0.9rem',
                                marginTop: '8px'
                            }}
                        >
                            <Linkedin size={16} /> LinkedIn Profile
                        </a>
                    )}
                </Card>
            ))}
        </div>
    );
}
