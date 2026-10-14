import React from 'react';
import { Home, Navigation, Activity, Radio, Menu } from 'lucide-react';

export function BottomNav({ currentTab, onSelectTab, onTriggerSos, onOpenMoreMenu }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journey', label: 'Journey', icon: Navigation },
    { id: 'sos', label: 'SOS', icon: Radio, isSos: true },
    { id: 'risk', label: 'Risk AI', icon: Activity },
    { id: 'more', label: 'More', icon: Menu, isMore: true },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 6px calc(8px + env(safe-area-inset-bottom, 0px)) 6px',
      zIndex: 50,
      backdropFilter: 'blur(16px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.4)'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        if (tab.isSos) {
          return (
            <button
              key={tab.id}
              onClick={onTriggerSos}
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--emergency-red)',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '-24px',
                boxShadow: 'var(--shadow-emergency)',
                border: '3px solid var(--bg-secondary)',
                fontWeight: 900
              }}
              className="beacon-sos-pulse"
              title="Activate SOS"
            >
              <Radio size={22} />
              <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '1px' }}>SOS</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => tab.isMore ? onOpenMoreMenu() : onSelectTab(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '6px 10px',
              backgroundColor: 'transparent',
              color: isActive ? 'var(--primary-purple-light)' : 'var(--text-subtle)',
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              minWidth: '58px'
            }}
          >
            <Icon size={20} color={isActive ? 'var(--primary-purple-light)' : 'var(--text-subtle)'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
