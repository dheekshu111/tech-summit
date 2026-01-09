import { useState, useEffect, type ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Linkedin, Github, Globe, User } from 'lucide-react';

type QRTab = 'profile' | 'linkedin' | 'github' | 'website';

export function MyProfile() {
    const [profile, setProfile] = useState({
        name: localStorage.getItem('myName') || '',
        role: localStorage.getItem('myRole') || '',
        company: localStorage.getItem('myCompany') || '',
        linkedin: localStorage.getItem('myLinkedin') || '',
        github: localStorage.getItem('myGithub') || '',
        website: localStorage.getItem('myWebsite') || ''
    });

    const [activeTab, setActiveTab] = useState<QRTab>('profile');

    useEffect(() => {
        localStorage.setItem('myName', profile.name);
        localStorage.setItem('myRole', profile.role);
        localStorage.setItem('myCompany', profile.company);
        localStorage.setItem('myLinkedin', profile.linkedin);
        localStorage.setItem('myGithub', profile.github);
        localStorage.setItem('myWebsite', profile.website);
    }, [profile]);

    // Determine what to encode based on active tab
    const getQRValue = () => {
        switch (activeTab) {
            case 'linkedin': return profile.linkedin;
            case 'github': return profile.github;
            case 'website': return profile.website;
            default: return JSON.stringify({
                name: profile.name,
                role: profile.role,
                company: profile.company,
                linkedin: profile.linkedin, // Still include these in the main profile blob
                github: profile.github,
                website: profile.website
            });
        }
    };

    const qrValue = getQRValue();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* QR Code Card */}
            <Card style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                color: 'black',
                padding: '24px'
            }}>
                {/* Tab Switcher */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '20px',
                    width: '100%',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={16} />} label="Card" />
                    <TabButton active={activeTab === 'linkedin'} onClick={() => setActiveTab('linkedin')} icon={<Linkedin size={16} />} label="In" />
                    <TabButton active={activeTab === 'github'} onClick={() => setActiveTab('github')} icon={<Github size={16} />} label="Git" />
                    <TabButton active={activeTab === 'website'} onClick={() => setActiveTab('website')} icon={<Globe size={16} />} label="Web" />
                </div>

                {qrValue && (activeTab === 'profile' ? profile.name : true) ? (
                    <div style={{ animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <QRCodeSVG
                            value={qrValue}
                            size={220}
                            level={"M"}
                            includeMargin={true}
                        />
                    </div>
                ) : (
                    <div style={{
                        width: '220px',
                        height: '220px',
                        background: '#f0f0f0',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#888',
                        textAlign: 'center',
                        padding: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {activeTab === 'profile' ? 'Enter details to generate QR' : `Enter ${activeTab} URL below`}
                    </div>
                )}

                <p style={{ marginTop: '16px', fontSize: '0.9rem', color: '#666', fontWeight: 500 }}>
                    {activeTab === 'profile' ? 'Scan to save Contact' : `Scan to open ${activeTab}`}
                </p>
            </Card>

            {/* Profile Form */}
            <Card>
                <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Edit Your Info</h3>
                <Input
                    label="Your Name"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Jane Doe"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                        label="Role"
                        value={profile.role}
                        onChange={e => setProfile({ ...profile, role: e.target.value })}
                        placeholder="Dev"
                    />
                    <Input
                        label="Company"
                        value={profile.company}
                        onChange={e => setProfile({ ...profile, company: e.target.value })}
                        placeholder="Google"
                    />
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0 20px 0' }} />

                <Input
                    label="LinkedIn URL"
                    value={profile.linkedin}
                    onChange={e => setProfile({ ...profile, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                />
                <Input
                    label="GitHub URL"
                    value={profile.github}
                    onChange={e => setProfile({ ...profile, github: e.target.value })}
                    placeholder="https://github.com/..."
                />
                <Input
                    label="Website / Resume URL"
                    value={profile.website}
                    onChange={e => setProfile({ ...profile, website: e.target.value })}
                    placeholder="https://jane.dev"
                />
            </Card>

            <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: active ? 'black' : '#f0f0f0',
                color: active ? 'white' : '#666',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
            }}
        >
            {icon} {label}
        </button>
    );
}
