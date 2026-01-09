import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { X, Trash2, Cloud } from 'lucide-react';
import { AudioRecorder } from '../../components/ui/AudioRecorder';

interface SessionDetailOverlayProps {
    sessionId: string;
    onClose: () => void;
    isNew?: boolean;
}

export function SessionDetailOverlay({ sessionId, onClose, isNew = false }: SessionDetailOverlayProps) {
    const [title, setTitle] = useState('');
    const [speaker, setSpeaker] = useState('');
    const [notes, setNotes] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Load initial data
    useEffect(() => {
        db.sessions.get(sessionId).then(data => {
            if (data) {
                setTitle(data.title);
                setSpeaker(data.speaker);
                setNotes(data.notes);
                if (data.audioBlob) setAudioBlob(data.audioBlob);
            }
        });
    }, [sessionId]);

    // Autosave Effect
    useEffect(() => {
        // Skip initial render or empty state if it's new
        if (isNew && !title && !speaker && !notes) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            await db.sessions.update(sessionId, {
                title,
                speaker,
                notes,
                audioBlob: audioBlob || undefined,
                synced: 0
            });
            setSaving(false);
            setLastSaved(new Date());
        }, 1000); // 1 second debounce

        return () => clearTimeout(timer);
    }, [title, speaker, notes, audioBlob, sessionId, isNew]);

    const handleDelete = async () => {
        if (confirm('Delete this session?')) {
            await db.sessions.delete(sessionId);
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
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* Title Input - Large & Bold */}
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Untitled Session"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: '2rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'white',
                        width: '100%',
                        outline: 'none'
                    }}
                    autoFocus={isNew}
                />

                {/* Speaker Custom Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Speaker:</span>
                    <input
                        type="text"
                        value={speaker}
                        onChange={e => setSpeaker(e.target.value)}
                        placeholder="Name..."
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            color: 'white',
                            flex: 1,
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {/* Audio Recorder */}
                <div>
                    <label style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                        marginBottom: '8px',
                        fontWeight: 600,
                        display: 'block'
                    }}>
                        VOICE NOTES
                    </label>
                    <AudioRecorder
                        initialBlob={audioBlob || undefined}
                        onSave={setAudioBlob}
                        maxDuration={3600} // 1 hour limit for sessions
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
                        placeholder="Start typing your notes here..."
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
                            outline: 'none'
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
