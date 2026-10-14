import React from 'react';
import { Shield, Radio, Battery, BatteryCharging, Wifi, WifiOff, EyeOff, AlertTriangle, User } from 'lucide-react';

export function Navbar({ 
  user, 
  batteryLevel, 
  isCharging, 
  isOnline, 
  onTriggerSos, 
  onToggleDiscreet, 
  onOpenProfile, 
  currentLocationName,
  safetyStatus 
}) {
  const getStatusColor = () => {
    if (safetyStatus === 'emergency') return '#EF4444';
    if (safetyStatus === 'caution') return '#F59E0B';
    return '#10B981';
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      backgroundColor: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backdropFilter: 'blur(12px)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Brand & Beacon Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Shield size={24} color="#EDE9FE" />
          <div style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            boxShadow: `0 0 8px ${getStatusColor()}`
          }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Her<span style={{ color: 'var(--primary-purple-light)' }}>Beacon</span>
            </span>
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '999px',
              backgroundColor: 'var(--primary-lavender-glow)',
              color: 'var(--primary-lavender)',
              fontWeight: 600,
              border: '1px solid var(--border-subtle)'
            }}>
              AI SECURE
            </span>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, display: 'none' }}>
            Your Safety. Your Beacon.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-subtle)' }}>
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: getStatusColor()
            }} />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentLocationName || 'Detecting live location...'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Action Tools: Battery, Network, Discreet, SOS, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Network & Battery Badges (Desktop & Tablet) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px'
        }}>
          {isOnline ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--safe-green)' }} title="Online connected">
              <Wifi size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>LIVE</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--caution-yellow)' }} title="Offline Safety Mode active">
              <WifiOff size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>OFFLINE</span>
            </div>
          )}

          <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: batteryLevel < 20 ? 'var(--emergency-red)' : 'var(--text-muted)' }}>
            {isCharging ? <BatteryCharging size={14} color="#10B981" /> : <Battery size={14} />}
            <span style={{ fontSize: '11px', fontWeight: 600 }}>{batteryLevel}%</span>
          </div>
        </div>

        {/* Discreet Camouflage Button */}
        <button
          onClick={onToggleDiscreet}
          title="Switch to Discreet Safety Mode (Notes/Calculator Camouflage)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-muted)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <EyeOff size={15} />
          <span style={{ display: 'none' }}>Discreet</span>
        </button>

        {/* Quick SOS Trigger Button */}
        <button
          onClick={onTriggerSos}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 18px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '13px',
            letterSpacing: '0.04em',
            boxShadow: 'var(--shadow-emergency)'
          }}
          className="beacon-sos-pulse"
        >
          <Radio size={16} />
          <span>SOS</span>
        </button>

        {/* User Profile / Auth Button */}
        <button
          onClick={onOpenProfile}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--border-glow)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title={user ? `${user.name} (Settings)` : 'Sign in / Profile'}
        >
          {user && user.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={18} color="var(--primary-lavender)" />
          )}
        </button>
      </div>
    </header>
  );
}
