# Tech Conference Companion 📱

![Badge](https://img.shields.io/badge/PWA-Ready-purple) ![Badge](https://img.shields.io/badge/Status-Offline--First-green) ![Badge](https://img.shields.io/badge/Stack-React_|_Supabase_|_Dexie-blue)

An offline-first **Progressive Web App (PWA)** built to help attendees navigate tech conferences with unreliable Wi-Fi. It seamlessly synchronizes data between a local IndexedDB and Supabase/PostgreSQL when connectivity is available.

## ✨ Key Features

*   **🎙️ Session Planner**: Create your own agenda. Voice record session notes (stored locally).
*   **🏢 Expo Booth Tracker**: Track companies you visit. "Suggest Question" generator for networking.
*   **🤝 Networking**: Generate a personal QR code to share your profile (GitHub, LinkedIn).
*   **📡 Offline-First**: Works 100% offline using Dexie.js. Syncs automatically in the background.
*   **🔒 Secure**: Authentication via Supabase with Row Level Security (RLS).

## 🛠️ Architecture

This app uses a **Local-First** architecture to ensure zero latency and offline availability.

*   **Frontend**: React, TypeScript, Vite
*   **Local Database**: IndexedDB (via Dexie.js)
*   **Cloud Database**: PostgreSQL (via Supabase)
*   **Sync Engine**: Custom bi-directional sync logic with timestamp-based conflict resolution.
*   **PWA**: `vite-plugin-pwa` for service workers and installability.

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   A Supabase project

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/dheekshu111/tech-summit.git
    cd tech-conference
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env` file with your credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  Run Locally:
    ```bash
    npm run dev
    ```

## 📦 Deployment (Vercel)

This project is optimized for Vercel.

1.  Connect your GitHub repository to Vercel.
2.  Add the **Environment Variables** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
3.  Deploy!

---
*Built with ❤️ for Tech Summits.*
