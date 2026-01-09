import Dexie, { type EntityTable } from 'dexie';

// Define Types for our Tables
export interface Session {
    id: string; // UUID
    title: string;
    speaker: string;
    notes: string;
    audioBlob?: Blob; // Voice recording
    tags: string[];
    date: number; // Timestamp
    synced: number; // 0 = false, 1 = true (Dexie supports numbers better for indexing)
}

export interface Booth {
    id: string;
    company: string;
    repName: string;
    notes: string;
    applied: boolean;
    deadline?: number;
    questions?: Array<{
        id: string;
        question: string;
        answer: string;
        type: 'yes/no' | 'short';
    }>;
    synced: number;
}

export interface Connection {
    id: string;
    name: string;
    role: string;
    company: string;
    phone?: string;
    email?: string;
    website?: string;
    linkedin?: string;
    notes: string;
    audioBlob?: Blob; // Voice note (15-30s limit)
    synced: number;
}

// Initialize Database
const db = new Dexie('ConferenceDB') as Dexie & {
    sessions: EntityTable<Session, 'id'>;
    booths: EntityTable<Booth, 'id'>;
    connections: EntityTable<Connection, 'id'>;
};

// Define Schema
// Note: We only index fields we need to search/filter by!
db.version(3).stores({
    sessions: 'id, date, synced, *tags', // *tags means multi-valued index
    booths: 'id, company, applied, synced',
    connections: 'id, name, company, synced'
});

export { db };
