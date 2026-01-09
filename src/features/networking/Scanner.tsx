import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { X } from 'lucide-react';

interface ScannerProps {
    onClose: () => void;
}

export function Scanner({ onClose }: ScannerProps) {
    const [error, setError] = useState('');

    useEffect(() => {
        // Small timeout to ensure DOM is ready
        const timer = setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: 250 },
        /* verbose= */ false
            );

            scanner.render(
                async (decodedText) => {
                    try {
                        // Attempt to parse metadata
                        const data = JSON.parse(decodedText);

                        // Save to DB
                        await db.connections.add({
                            id: crypto.randomUUID(),
                            name: data.name || 'Unknown',
                            role: data.role || '',
                            company: data.company || '',
                            linkedin: data.linkedin || '',
                            notes: '',
                            synced: 0
                        });

                        scanner.clear();
                        onClose();
                    } catch (e) {
                        console.error(e);
                        setError('Invalid QR Code. This is not a Conference Profile.');
                    }
                },
                (errorMessage) => {
                    // ignore scan errors, they happen every frame
                    console.log(errorMessage);
                }
            );
        }, 100);

        return () => {
            clearTimeout(timer);
            // Clean up manually if needed, though scanner.clear() usually handles it
        };
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'black',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Button variant="ghost" onClick={onClose}>
                    <X size={24} /> Close
                </Button>
            </div>

            <div id="reader" style={{ width: '100%', background: 'white' }}></div>

            {error && (
                <Card style={{ marginTop: '20px', borderColor: 'red', color: '#ff6b6b' }}>
                    {error}
                </Card>
            )}

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#888' }}>
                Point camera at another user's profile QR code.
            </p>
        </div>
    );
}
