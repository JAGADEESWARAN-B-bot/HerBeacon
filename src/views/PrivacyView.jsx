import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Mic, 
  Bell, 
  Users, 
  Trash2, 
  Lock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

export function PrivacyView({ onClearAllData }) {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [contactSyncEnabled, setContactSyncEnabled] = useState(true);
  const [dataCleared, setDataCleared] = useState(false);

  const handleClear = () => {
    if (window.confirm('Are you sure you want to delete all local journey logs and incident histories from this device?')) {
      onClearAllData();
      setDataCleared(true);
      setTimeout(() => setDataCleared(false), 3000);
    }
  };

  const permissions = [
    {
      id: 'loc',
      name: 'Precise GPS Location Access',
      icon: MapPin,
      enabled: locationEnabled,
      toggle: () => setLocationEnabled(!locationEnabled),
      description: 'Used solely to calculate travel progress, estimate arrival times, and send coordinates to your trusted circle in case of SOS. Never sold or tracked in background without your consent.'
    },
    {
      id: 'mic',
      name: 'Microphone & Voice Wake Word',
      icon: Mic,
      enabled: micEnabled,
      toggle: () => setMicEnabled(!micEnabled),
      description: 'Listens locally on-device for your secret emergency phrase ("HerBeacon Help"). Audio samples are processed ephemerally and never uploaded or stored.'
    },
    {
      id: 'notif',
      name: 'Safety Check-In Notifications',
      icon: Bell,
      enabled: notificationsEnabled,
      toggle: () => setNotificationsEnabled(!notificationsEnabled),
      description: 'Delivers scheduled "Are you safe?" prompts and battery warnings. If silenced, emergency relay will still trigger via trusted circle SMS.'
    },
    {
      id: 'contacts',
      name: 'Trusted Circle Access',
      icon: Users,
      enabled: contactSyncEnabled,
      toggle: () => setContactSyncEnabled(!contactSyncEnabled),
      description: 'Only chosen trusted individuals receive your safety alerts. No address book harvesting.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <ShieldCheck size={22} color="var(--safe-green)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Privacy Center & Consent Controls
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Privacy by Design: Complete ownership over what sensors are accessed, what is shared, and how long data is retained.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px solid var(--border-glow)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: 'var(--safe-green-bg)',
          color: 'var(--safe-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Lock size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0' }}>
            Zero Unnecessary Personal Profiling
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            HerBeacon collects only what is required to keep you safe during an active journey. All telemetry remains stored strictly on this client device.
          </p>
        </div>
      </div>

      {/* Permissions List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'var(--bg-surface)',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 8px 0' }}>
          Hardware Sensor Permissions
        </h4>

        {permissions.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color="var(--primary-purple-light)" />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {p.name}
                  </span>
                </div>

                {/* Switch button */}
                <button
                  onClick={p.toggle}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: p.enabled ? 'var(--safe-green-bg)' : 'rgba(239, 68, 68, 0.15)',
                    color: p.enabled ? 'var(--safe-green)' : 'var(--emergency-red)',
                    border: `1px solid ${p.enabled ? 'var(--safe-green)' : 'rgba(239, 68, 68, 0.3)'}`
                  }}
                >
                  {p.enabled ? 'GRANTED' : 'REVOKED'}
                </button>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {p.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Data Erasure & Account Deletion */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--emergency-red)', margin: 0 }}>
          Data Deletion & Local Purge
        </h4>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
          Permanently remove all local journey paths, check-in history, and contact settings from this browser/device.
        </p>

        {dataCleared && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--safe-green-bg)',
            color: 'var(--safe-green)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={14} />
            <span>All local journey data and audit histories successfully wiped.</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleClear}
            style={{
              padding: '12px 18px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--emergency-red)',
              border: '1px solid var(--emergency-red)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Trash2 size={16} />
            <span>Delete All Safety Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
