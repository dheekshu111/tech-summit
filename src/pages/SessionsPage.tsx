import { useState } from 'react';
import { db } from '../lib/db';
import { SessionList } from '../features/sessions/SessionList';
import { SessionDetailOverlay } from '../features/sessions/SessionDetailOverlay';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export default function SessionsPage() {
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);

    const handleCreate = async () => {
        const id = crypto.randomUUID();
        await db.sessions.add({
            id,
            title: '',
            speaker: '',
            date: Date.now(),
            notes: '',
            synced: 0,
            tags: []
        });
        setIsNew(true);
        setSelectedSessionId(id);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: 10, zIndex: 5 }}>
                <Button onClick={handleCreate} style={{ padding: '8px 16px' }}>
                    <Plus size={20} /> Add Session
                </Button>
            </div>

            <SessionList onSessionClick={(id) => { setIsNew(false); setSelectedSessionId(id); }} />

            {selectedSessionId && (
                <SessionDetailOverlay
                    sessionId={selectedSessionId}
                    onClose={() => setSelectedSessionId(null)}
                    isNew={isNew}
                />
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
