import { useState, useEffect } from 'react';
import { db } from '../../lib/db';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { X, Trash2, Cloud, User, Plus, Sparkles, Trash } from 'lucide-react';
import { getRandomQuestion } from '../../lib/questionGenerator';

interface BoothDetailOverlayProps {
    boothId: string;
    onClose: () => void;
    isNew?: boolean;
}

export function BoothDetailOverlay({ boothId, onClose, isNew = false }: BoothDetailOverlayProps) {
    const [company, setCompany] = useState('');
    const [repName, setRepName] = useState('');
    const [notes, setNotes] = useState('');
    const [applied, setApplied] = useState(false);
    const [deadline, setDeadline] = useState('');
    const [questions, setQuestions] = useState<Array<{
        id: string;
        question: string;
        answer: string;
        type: 'yes/no' | 'short';
    }>>([]);

    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        db.booths.get(boothId).then(data => {
            if (data) {
                setCompany(data.company);
                setRepName(data.repName);
                setNotes(data.notes);
                setApplied(data.applied);
                setDeadline(data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : '');
                setQuestions(data.questions || []);
            }
        });
    }, [boothId]);

    // Autosave
    useEffect(() => {
        if (isNew && !company && !repName && !notes) return;

        const timer = setTimeout(async () => {
            setSaving(true);
            const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined;

            await db.booths.update(boothId, {
                company,
                repName,
                notes,
                applied,
                deadline: deadlineTimestamp,
                questions,
                synced: 0
            });

            setSaving(false);
            setLastSaved(new Date());
        }, 1000);

        return () => clearTimeout(timer);
    }, [company, repName, notes, applied, deadline, questions, boothId, isNew]);

    const addQuestion = (type: 'yes/no' | 'short' = 'short') => {
        setQuestions([{
            id: crypto.randomUUID(),
            question: '',
            answer: '',
            type
        }, ...questions]);
    };

    const addRandomQuestion = () => {
        setQuestions([{
            id: crypto.randomUUID(),
            question: getRandomQuestion(),
            answer: '',
            type: 'short'
        }, ...questions]);
    };

    const updateQuestion = (id: string, field: 'question' | 'answer' | 'type', value: string) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, [field]: value } : q
        ));
    };

    const removeQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleDelete = async () => {
        if (confirm('Delete this booth visit?')) {
            await db.booths.delete(boothId);
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

                {/* Company Input - Large & Bold */}
                <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Company Name"
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

                {/* Rep Name Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <User size={20} color="var(--primary)" />
                    <input
                        type="text"
                        value={repName}
                        onChange={e => setRepName(e.target.value)}
                        placeholder="Recruiter Name..."
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

                {/* Applied / Deadline Custom UI */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                            type="checkbox"
                            checked={applied}
                            onChange={e => setApplied(e.target.checked)}
                            id="applied-check"
                            style={{ width: '24px', height: '24px', accentColor: 'var(--accent)' }}
                        />
                        <label htmlFor="applied-check" style={{ fontSize: '1rem', fontWeight: 600 }}>
                            Reminder to apply?
                        </label>
                    </div>

                    {applied && (
                        <Input
                            type="date"
                            label="Deadline"
                            value={deadline}
                            onChange={e => setDeadline(e.target.value)}
                            style={{ colorScheme: 'dark' }}
                        />
                    )}
                </div>

                {/* Q&A Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-muted)',
                            fontWeight: 600
                        }}>
                            QUESTIONS TO ASK
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                                variant="ghost"
                                onClick={addRandomQuestion}
                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                                <Sparkles size={16} /> Suggest
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => addQuestion('short')}
                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                                <Plus size={16} /> Add
                            </Button>
                        </div>
                    </div>

                    {questions.length === 0 ? (
                        <div style={{
                            padding: '24px',
                            textAlign: 'center',
                            color: 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px dashed rgba(255,255,255,0.1)'
                        }}>
                            <p style={{ margin: 0, marginBottom: '8px' }}>No questions yet</p>
                            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
                                Click "Suggest" for ideas or "Add" to create your own
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {questions.map((q, index) => (
                                <div key={q.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid rgba(255,255,255,0.05)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: 600
                                        }}>
                                            Q{index + 1}
                                        </span>
                                        <button
                                            onClick={() => removeQuestion(q.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#ff6b6b',
                                                cursor: 'pointer',
                                                padding: '4px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        value={q.question}
                                        onChange={e => updateQuestion(q.id, 'question', e.target.value)}
                                        placeholder="Type your question..."
                                        style={{
                                            width: '100%',
                                            background: 'rgba(0,0,0,0.2)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '10px 12px',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            marginBottom: '12px',
                                            outline: 'none',
                                            fontFamily: 'var(--font-body)'
                                        }}
                                    />

                                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                        <button
                                            onClick={() => updateQuestion(q.id, 'type', 'yes/no')}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: q.type === 'yes/no' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                color: q.type === 'yes/no' ? 'white' : 'var(--text-muted)',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Yes/No
                                        </button>
                                        <button
                                            onClick={() => updateQuestion(q.id, 'type', 'short')}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: q.type === 'short' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                                color: q.type === 'short' ? 'white' : 'var(--text-muted)',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                fontWeight: 600
                                            }}
                                        >
                                            Short Answer
                                        </button>
                                    </div>

                                    {q.type === 'yes/no' ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => updateQuestion(q.id, 'answer', 'Yes')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: q.answer === 'Yes' ? '#4ade80' : 'rgba(255,255,255,0.05)',
                                                    color: q.answer === 'Yes' ? 'black' : 'white',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 600
                                                }}
                                            >
                                                ✓ Yes
                                            </button>
                                            <button
                                                onClick={() => updateQuestion(q.id, 'answer', 'No')}
                                                style={{
                                                    flex: 1,
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: q.answer === 'No' ? '#f87171' : 'rgba(255,255,255,0.05)',
                                                    color: q.answer === 'No' ? 'black' : 'white',
                                                    fontSize: '0.9rem',
                                                    cursor: 'pointer',
                                                    fontWeight: 600
                                                }}
                                            >
                                                ✗ No
                                            </button>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={q.answer}
                                            onChange={e => updateQuestion(q.id, 'answer', e.target.value)}
                                            placeholder="Type the answer..."
                                            style={{
                                                width: '100%',
                                                background: 'rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '8px',
                                                padding: '10px 12px',
                                                color: 'white',
                                                fontSize: '0.9rem',
                                                minHeight: '60px',
                                                resize: 'vertical',
                                                outline: 'none',
                                                fontFamily: 'var(--font-body)'
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
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
                        placeholder="Notes about the role, tech stack, or improved vibe..."
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
