import { useState } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Save } from 'lucide-react';

interface AddBoothFormProps {
    onCheckIn: () => void;
}

export function AddBoothForm({ onCheckIn }: AddBoothFormProps) {
    const [company, setCompany] = useState('');
    const [repName, setRepName] = useState('');
    const [notes, setNotes] = useState('');
    const [applied, setApplied] = useState(false);
    const [deadline, setDeadline] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        await db.booths.add({
            id: crypto.randomUUID(),
            company,
            repName,
            notes,
            applied,
            deadline: deadline ? new Date(deadline).getTime() : undefined,
            synced: 0
        });

        onCheckIn();
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <Input
                placeholder="Company Name (e.g. Google, Vercel)"
                value={company}
                onChange={e => setCompany(e.target.value)}
                label="Company"
                autoFocus
            />

            <Input
                placeholder="Recruiter / Rep Name"
                value={repName}
                onChange={e => setRepName(e.target.value)}
                label="Who did you meet?"
            />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                border: applied ? '1px solid var(--accent)' : '1px solid transparent',
                transition: 'all 0.2s ease'
            }}>
                <input
                    type="checkbox"
                    checked={applied}
                    onChange={e => setApplied(e.target.checked)}
                    id="applied-check"
                    style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
                />
                <label htmlFor="applied-check" style={{ flex: 1, fontSize: '1rem', cursor: 'pointer' }}>
                    By the way, did you apply?
                </label>
            </div>

            {applied && (
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                    <Input
                        type="date"
                        label="Application Deadline / Follow-up Date"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                        style={{ colorScheme: 'dark' }}
                    />
                </div>
            )}

            <TextArea
                placeholder="Conversation notes, role details, or specific instructions..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                label="Notes"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <Button type="button" variant="ghost" onClick={onCheckIn} style={{ flex: 1 }}>
                    Cancel
                </Button>
                <Button type="submit" style={{ flex: 2 }}>
                    <Save size={18} />
                    Save Booth
                </Button>
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </form>
    );
}
