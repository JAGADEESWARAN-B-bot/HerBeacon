import React from 'react';
import { 
  Home, 
  Navigation, 
  Activity, 
  Users, 
  Clock, 
  MapPin, 
  History, 
  ShieldCheck, 
  Settings,
  Mic,
  EyeOff,
  Radio
} from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab, onTriggerSos, onToggleDiscreet }) {
  const navItems = [
    { id: 'home', label: 'Home Dashboard', icon: Home, badge: null },
    { id: 'journey', label: 'Safe Journey', icon: Navigation, badge: 'Live' },
    { id: 'risk', label: 'AI Risk Monitor', icon: Activity, badge: 'AI' },
    { id: 'contacts', label: 'Trusted Circle & Relay', icon: Users, badge: null },
    { id: 'checkin', label: 'Smart Check-In', icon: Clock, badge: null },
    { id: 'help', label: 'Nearby Help', icon: MapPin, badge: '24/7' },
    { id: 'voice', label: 'Voice Safety Command', icon: Mic, badge: null },
    { id: 'history', label: 'Safety History', icon: History, badge: null },
    { id: 'privacy', label: 'Privacy Center', icon: ShieldCheck, badge: null },
    { id: 'settings', label: 'Profile & Settings', icon: Settings, badge: null },
  ];

  return (
    <aside style={{
      width: '270px',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 16px',
      height: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px',
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ padding: '0 12px 12px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', letterSpacing: '0.08em' }}>
          NAVIGATION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--primary-purple)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13.5px',
                textAlign: 'left',
                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                transition: 'background-color 0.15s, color 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? '#FFFFFF' : 'var(--primary-purple-light)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-surface-elevated)',
                  color: isActive ? '#FFFFFF' : 'var(--primary-lavender)',
                  border: isActive ? 'none' : '1px solid var(--border-subtle)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Action Footer inside Sidebar */}
      <div style={{
        marginTop: '20px',
        padding: '16px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
          <Radio size={16} color="var(--emergency-red)" />
          <span>Instant Emergency SOS</span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-subtle)', lineHeight: 1.4, margin: 0 }}>
          Countdown prevents accidental alerts. Escalates to your trusted circle.
        </p>
        <button
          onClick={onTriggerSos}
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--emergency-red)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-emergency)'
          }}
        >
          <Radio size={16} />
          <span>ACTIVATE SOS</span>
        </button>
      </div>
    </aside>
  );
}
