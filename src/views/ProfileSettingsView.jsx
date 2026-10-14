import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  ShieldAlert, 
  Volume2, 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  Check, 
  Save,
  Lock,
  Heart
} from 'lucide-react';

export function ProfileSettingsView({ 
  user, 
  onUpdateUser, 
  onLogout, 
  theme, 
  onToggleTheme 
}) {
  const [name, setName] = useState(user?.name || 'Elena Vance');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [email, setEmail] = useState(user?.email || 'elena.vance@example.com');
  const [bloodType, setBloodType] = useState(user?.bloodType || 'O+');
  const [emergencyNotes, setEmergencyNotes] = useState(user?.emergencyNotes || 'Asthma inhaler in outer bag pocket.');
  const [countdownSecs, setCountdownSecs] = useState(user?.settings?.sosCountdownSeconds || 5);
  const [sirenSound, setSirenSound] = useState(user?.settings?.sirenSoundEnabled ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      phone,
      email,
      bloodType,
      emergencyNotes,
      settings: {
        ...user?.settings,
        sosCountdownSeconds: Number(countdownSecs),
        sirenSoundEnabled: sirenSound
      }
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Settings size={22} color="var(--primary-purple-light)" />
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
              Profile & Emergency Preferences
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Personal health details, emergency countdown timing, and security thresholds.
          </p>
        </div>

        {savedMessage && (
          <div style={{
            padding: '6px 14px',
            backgroundColor: 'var(--safe-green-bg)',
            color: 'var(--safe-green)',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check size={14} />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Personal Details Card */}
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"}
              alt={name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>
                {name}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                HerBeacon Verified User
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Primary Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Blood Type (for Emergency Responders)
              </label>
              <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+ (Universal Donor)</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
              Emergency Medical Notes (Sent to Responders upon SOS)
            </label>
            <textarea
              rows={3}
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              placeholder="e.g. Asthmatic, carries inhaler. Penicillin allergy."
            />
          </div>
        </div>

        {/* SOS Emergency Behavior Preferences */}
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>
            Emergency SOS Behavior
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Accidental Activation Countdown
              </label>
              <select
                value={countdownSecs}
                onChange={(e) => setCountdownSecs(e.target.value)}
              >
                <option value={3}>3 Seconds (Fast)</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={10}>10 Seconds (Extra Safe)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                Audible Emergency Siren
              </label>
              <select
                value={sirenSound ? 'true' : 'false'}
                onChange={(e) => setSirenSound(e.target.value === 'true')}
              >
                <option value="true">Enabled (Loud Audible Deterrent)</option>
                <option value="false">Muted (Discreet Silent Dispatch)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Theme and Display Preferences */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Interface Appearance & Theme
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Currently using {theme === 'dark' ? 'Deep Purple & Soft Lavender Dark Theme' : 'Light Mode'}.
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-lavender)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>

        {/* Action Buttons: Save & Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="submit"
            style={{
              padding: '13px 28px',
              backgroundColor: 'var(--primary-purple)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-glow)'
            }}
          >
            <Save size={16} />
            <span>Save Preferences</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            style={{
              padding: '12px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--emergency-red)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              fontWeight: 600,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </form>
    </div>
  );
}
