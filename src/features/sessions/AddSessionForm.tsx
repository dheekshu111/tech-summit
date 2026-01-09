import { useState } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Mic, Save } from 'lucide-react';

interface AddSessionFormProps {
    onCheckIn: () => void;
}

export function AddSessionForm({ onCheckIn }: AddSessionFormProps) {
    const [title, setTitle] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [notes, setNotes] = useState('');
    const [isRecording, setIsRecording] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;

        await db.sessions.add({
            id: crypto.randomUUID(),
            title,
            speaker,
            notes,
            tags: [],
            date: Date.now(),
            synced: 0
        });

        // Reset form
        setTitle('');
        setSpeaker('');
        setNotes('');
        onCheckIn(); // Notify parent to close form
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <Input
                placeholder="Session Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                label="What are you watching?"
                autoFocus
            />

            <Input
                placeholder="Speaker Name"
                value={speaker}
                onChange={e => setSpeaker(e.target.value)}
                label="Who is speaking?"
            />

            <TextArea
                placeholder="Quick notes..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                label="Key takeaways"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button type="button" variant="secondary" onClick={() => setIsRecording(!isRecording)} style={{ flex: 1 }}>
                    <Mic size={18} color={isRecording ? 'var(--accent)' : 'currentColor'} />
                    {isRecording ? 'Stop' : 'Record'}
                </Button>

                <Button type="submit" style={{ flex: 2 }}>
                    <Save size={18} />
                    Save Session
                </Button>
            </div>

            <Button
                type="button"
                variant="ghost"
                onClick={onCheckIn}
                style={{ marginTop: '10px', width: '100%', color: 'var(--text-muted)' }}
            >
                Cancel
            </Button>
        </form>
    );
}
