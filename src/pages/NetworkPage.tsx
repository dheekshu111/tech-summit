import { useState } from 'react';
import { MyProfile } from '../features/networking/MyProfile';
import { ContactList } from '../features/networking/ContactList';
import { ManualEntryForm } from '../features/networking/ManualEntryForm';
import { ContactDetailOverlay } from '../features/networking/ContactDetailOverlay';
import { Button } from '../components/ui/Button';
import { QrCode, Users, Plus } from 'lucide-react';

export default function NetworkPage() {
    const [view, setView] = useState<'profile' | 'contacts'>('profile');
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>

            {/* Switcher */}
            <div style={{
                marginBottom: '24px',
                position: 'sticky',
                top: 80, // Offset for global header
                zIndex: 10,
                padding: '10px 0',
                background: 'var(--bg-main)' // Ensure opacity for sticky
            }}>
                <div style={{
                    display: 'flex',
                    background: 'var(--bg-card)',
                    padding: '4px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <button
                        onClick={() => setView('profile')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: view === 'profile' ? 'var(--primary)' : 'transparent',
                            color: view === 'profile' ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <QrCode size={16} /> My QR
                    </button>

                    <button
                        onClick={() => setView('contacts')}
                        style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '8px',
                            border: 'none',
                            background: view === 'contacts' ? 'var(--primary)' : 'transparent',
                            color: view === 'contacts' ? 'white' : 'var(--text-muted)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Users size={16} /> Contacts
                    </button>
                </div>
            </div>



            {/* Main Content */}
            <main>
                {view === 'profile' ? (
                    <MyProfile />
                ) : (
                    <>
                        {!isManualEntry ? (
                            <>
                                <div style={{ marginBottom: '16px' }}>
                                    <Button variant="secondary" fullWidth onClick={() => setIsManualEntry(true)}>
                                        <Plus size={18} /> Add Contact Manually
                                    </Button>
                                </div>
                                <ContactList onContactClick={(id) => setSelectedContactId(id)} />
                            </>
                        ) : (
                            <ManualEntryForm onCheckIn={() => setIsManualEntry(false)} />
                        )}
                    </>
                )}
            </main>

            {selectedContactId && (
                <ContactDetailOverlay
                    contactId={selectedContactId}
                    onClose={() => setSelectedContactId(null)}
                />
            )}



            <style>{`
              .spin { animation: spin 1s linear infinite; }
              @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
