import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X, Trash2, Cloud, Phone, Mail, Globe } from 'lucide-react';
import { AudioRecorder } from '../../components/ui/AudioRecorder';

interface ContactDetailOverlayProps {
    contactId: string;
    onClose: () => void;
}

export function ContactDetailOverlay({ contactId, onClose }: ContactDetailOverlayProps) {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        db.connections.get(contactId).then(data => {
            if (data) {
                setName(data.name);
                setCompany(data.company);
                setRole(data.role);
                setPhone(data.phone || '');
                setEmail(data.email || '');
                setWebsite(data.website || '');
                setNotes(data.notes);
                if (data.audioBlob) setAudioBlob(data.audioBlob);
            }
        });
    }, [contactId]);

    // Autosave
    useEffect(() => {
        if (!name) return;

        const timer = setTimeout(async () => {
            setSaving(true);

            await db.connections.update(contactId, {
                name,
                company,
                role,
                phone,
                email,
                website,
                notes,
                audioBlob: audioBlob || undefined,
                synced: 0
            });

            setSaving(false);
            setLastSaved(new Date());
        }, 1000);

        return () => clearTimeout(timer);
    }, [name, company, role, phone, email, website, notes, audioBlob, contactId]);

    const handleDelete = async () => {
        if (confirm('Delete this contact?')) {
            await db.connections.delete(contactId);
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Button variant="ghost" onClick={onClose} style={{ padding: '8px' }}>
                    <X size={24} />
                </Button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {saving ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Saving...</span>
                    ) : lastSaved ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Cloud size={14} /> Saved
                        </span>
                    ) : null}

                    <Button variant="ghost" onClick={handleDelete} style={{ padding: '8px', color: '#ff6b6b' }}>
                        <Trash2 size={20} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Name Input - Large & Bold */}
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contact Name"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'white',
                        width: '100%',
                        outline: 'none'
                    }}
                />

                <Input
                    placeholder="Company"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    label="Company"
                />

                <Input
                    placeholder="Role"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    label="Role"
                />

                <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    label="Phone"
                    icon={<Phone size={18} />}
                />

                <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email"
                    icon={<Mail size={18} />}
                />

                <Input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    label="Website"
                    icon={<Globe size={18} />}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        fontWeight: 600,
                        display: 'block'
                    }}>
                        VOICE NOTE (Max 30s)
                    </label>
                    <AudioRecorder
                        initialBlob={audioBlob || undefined}
                        onSave={setAudioBlob}
                        maxDuration={30} // 30 seconds limit for contacts
                    />
                </div>

                {/* Notes Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <label style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        fontWeight: 600
                    }}>
                        NOTES
                    </label>
                    <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="What did you talk about?"
                        style={{
                            flex: 1,
                            background: 'rgba(255,255,255,0.03)',
                            border: 'none',
                            borderRadius: '16px',
                            padding: '20px',
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            fontFamily: 'var(--font-body)',
                            resize: 'none',
                            outline: 'none',
                            minHeight: '150px'
                        }}
                    />
                </div>

            </div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
        </div>
    );
}
