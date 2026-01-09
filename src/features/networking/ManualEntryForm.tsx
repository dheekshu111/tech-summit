import { useState } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Save, X, Phone, Mail, Globe } from 'lucide-react';
import { AudioRecorder } from '../../components/ui/AudioRecorder';

interface ManualEntryFormProps {
    onCheckIn: () => void;
}

export function ManualEntryForm({ onCheckIn }: ManualEntryFormProps) {
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        await db.connections.add({
            id: crypto.randomUUID(),
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

        onCheckIn();
    };

    return (
        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <Input
                    placeholder="Contact Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    label="Name *"
                    autoFocus
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
                    label="Phone (Optional)"
                    icon={<Phone size={18} />}
                />

                <Input
                    type="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    label="Email (Optional)"
                    icon={<Mail size={18} />}
                />

                <Input
                    type="url"
                    placeholder="https://example.com"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    label="Website (Optional)"
                    icon={<Globe size={18} />}
                />

                <div style={{ marginBottom: '20px' }}>
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
                        onSave={setAudioBlob}
                        maxDuration={30}
                    />
                </div>
                <TextArea
                    placeholder="What did you talk about?"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    label="Notes"
                />

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <Button type="button" variant="ghost" onClick={onCheckIn} style={{ flex: 1 }}>
                        <X size={18} /> Cancel
                    </Button>
                    <Button type="submit" style={{ flex: 2 }}>
                        <Save size={18} />
                        Save Contact
                    </Button>
                </div>
            </form>
        </div>
    );
}
