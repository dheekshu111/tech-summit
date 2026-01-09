import { useState } from 'react';
import { db } from '../lib/db';
import { BoothList } from '../features/booths/BoothList';
import { BoothDetailOverlay } from '../features/booths/BoothDetailOverlay';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export default function BoothsPage() {
    const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
    const [isNew, setIsNew] = useState(false);

    const handleCreate = async () => {
        const id = crypto.randomUUID();
        await db.booths.add({
            id,
            company: '',
            repName: '',
            notes: '',
            applied: false,
            synced: 0
        });
        setIsNew(true);
        setSelectedBoothId(id);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', position: 'sticky', top: 10, zIndex: 5 }}>
                <Button onClick={handleCreate} style={{ padding: '8px 16px' }}>
                    <Plus size={20} /> Add Booth
                </Button>
            </div>

            <BoothList onBoothClick={(id) => { setIsNew(false); setSelectedBoothId(id); }} />

            {selectedBoothId && (
                <BoothDetailOverlay
                    boothId={selectedBoothId}
                    onClose={() => setSelectedBoothId(null)}
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
