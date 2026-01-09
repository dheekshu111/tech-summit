import { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { Mic, Square, Trash2 } from 'lucide-react';

interface AudioRecorderProps {
    initialBlob?: Blob;
    onSave: (blob: Blob | null) => void;
    maxDuration?: number; // in seconds
}

export function AudioRecorder({ initialBlob, onSave, maxDuration = 300 }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [permissionError, setPermissionError] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (initialBlob) {
            setAudioUrl(URL.createObjectURL(initialBlob));
        }
        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [initialBlob]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                onSave(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setPermissionError(false);
            setDuration(0);

            timerRef.current = window.setInterval(() => {
                setDuration((prev: number) => {
                    if (prev >= maxDuration) {
                        stopRecording();
                        return prev;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            console.error('Error accessing microphone:', err);
            setPermissionError(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    };

    const deleteRecording = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
            setAudioUrl(null);
            onSave(null);
            setDuration(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        }}>
            {permissionError ? (
                <div style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>
                    Microphone access denied. Please allow permissions.
                </div>
            ) : !audioUrl ? (
                <>
                    <Button
                        variant={isRecording ? 'primary' : 'secondary'}
                        onClick={isRecording ? stopRecording : startRecording}
                        style={{
                            background: isRecording ? '#ff4d4d' : undefined, // Red when recording
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0
                        }}
                    >
                        {isRecording ? <Square size={20} fill="currentColor" /> : <Mic size={24} />}
                    </Button>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                            {isRecording ? 'Recording...' : 'Record Audio'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: isRecording ? '#ff4d4d' : 'var(--text-muted)' }}>
                            {formatTime(duration)} / {formatTime(maxDuration)}
                        </span>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                    <audio
                        controls
                        src={audioUrl}
                        style={{
                            height: '40px',
                            flex: 1,
                            borderRadius: '20px'
                        }}
                    />
                    <Button
                        variant="ghost"
                        onClick={deleteRecording}
                        style={{ color: '#ff6b6b', padding: '8px' }}
                    >
                        <Trash2 size={20} />
                    </Button>
                </div>
            )}
        </div>
    );
}
