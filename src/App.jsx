import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { SosModal } from './components/SosModal';
import { DiscreetView } from './components/DiscreetView';
import { AuthModal } from './components/AuthModal';

import { HomeView } from './views/HomeView';
import { JourneyView } from './views/JourneyView';
import { RiskView } from './views/RiskView';
import { ContactsView } from './views/ContactsView';
import { CheckInView } from './views/CheckInView';
import { NearbyHelpView } from './views/NearbyHelpView';
import { VoiceCommandView } from './views/VoiceCommandView';
import { TimelineView } from './views/TimelineView';
import { PrivacyView } from './views/PrivacyView';
import { ProfileSettingsView } from './views/ProfileSettingsView';

import { 
  DEFAULT_USER, 
  INITIAL_CONTACTS, 
  INITIAL_JOURNEYS, 
  INITIAL_TIMELINE,
  OFFLINE_SAFETY_GUIDE 
} from './data/mockData';

import { X, Shield, ChevronRight, WifiOff, AlertTriangle } from 'lucide-react';

export default function App() {
  // 1. Persistent State Initialization with LocalStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('herbeacon_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('herbeacon_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [activeJourney, setActiveJourney] = useState(() => {
    const saved = localStorage.getItem('herbeacon_active_journey');
    return saved ? JSON.parse(saved) : INITIAL_JOURNEYS[0];
  });

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('herbeacon_incidents');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('herbeacon_theme') || 'dark';
  });

  // 2. Navigation & UI View State
  const [currentTab, setCurrentTab] = useState(() => {
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    const validTabs = ['home', 'journey', 'risk', 'contacts', 'checkin', 'help', 'voice', 'history', 'privacy', 'settings'];
    return validTabs.includes(path) ? path : 'home';
  });

  const [safetyStatus, setSafetyStatus] = useState('safe'); // 'safe', 'caution', 'emergency'
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isDiscreetMode, setIsDiscreetMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // 3. Real Browser Telemetry State (Battery, Network, Location)
  const [batteryLevel, setBatteryLevel] = useState(78);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine ?? true);
  const [currentLocation, setCurrentLocation] = useState({
    name: '4th Ave & Pine St, Metro District',
    lat: 37.7749,
    lng: -122.4194
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('herbeacon_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('herbeacon_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('herbeacon_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    if (activeJourney) {
      localStorage.setItem('herbeacon_active_journey', JSON.stringify(activeJourney));
    } else {
      localStorage.removeItem('herbeacon_active_journey');
    }
  }, [activeJourney]);

  useEffect(() => {
    localStorage.setItem('herbeacon_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Handle URL change for SPA routing
  const navigateTab = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetUrl = tabId === 'home' ? '/' : `/${tabId}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState(null, '', targetUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      const validTabs = ['home', 'journey', 'risk', 'contacts', 'checkin', 'help', 'voice', 'history', 'privacy', 'settings'];
      setCurrentTab(validTabs.includes(path) ? path : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 4. Battery API Hook
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      }).catch(() => {
        // Fallback default
      });
    }
  }, []);

  // 5. Online / Offline Hook
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 6. Geolocation Hook
  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            name: `Live GPS (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          // Graceful fallback coordinates
          setCurrentLocation({
            name: '4th Ave & Pine St, Metro District',
            lat: 37.7749,
            lng: -122.4194
          });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  // Incident Logger Helper
  const addIncidentLog = (logItem) => {
    const newLog = {
      id: `inc_${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...logItem
    };
    setIncidents(prev => [newLog, ...prev]);
  };

  const handleTriggerSos = () => {
    setIsSosOpen(true);
    setSafetyStatus('emergency');
  };

  const handleCloseSos = () => {
    setIsSosOpen(false);
    setSafetyStatus('safe');
  };

  const handleSilentAlert = () => {
    addIncidentLog({
      type: 'sos',
      title: 'Discreet Silent SOS Dispatched',
      description: 'Triggered from stealth notes screen. Location shared secretly with Circle #1.',
      status: 'danger'
    });
  };

  const clearAllData = () => {
    localStorage.clear();
    setIncidents([]);
    setActiveJourney(null);
  };

  // If user activated Discreet Camouflage mode, show stealth view immediately
  if (isDiscreetMode) {
    return (
      <DiscreetView
        onExit={() => setIsDiscreetMode(false)}
        onSilentAlert={handleSilentAlert}
        user={user}
        currentLocation={currentLocation}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Offline Mode Alert Bar (if disconnected) */}
      {!isOnline && (
        <div style={{
          backgroundColor: '#B45309',
          color: '#FFFFFF',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          zIndex: 60
        }}>
          <WifiOff size={15} />
          <span>Offline Safety Mode Active: Local emergency contacts & offline safety manual available. Live GPS sharing will sync when restored.</span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        user={user}
        batteryLevel={batteryLevel}
        isCharging={isCharging}
        isOnline={isOnline}
        onTriggerSos={handleTriggerSos}
        onToggleDiscreet={() => setIsDiscreetMode(true)}
        onOpenProfile={() => setIsAuthOpen(true)}
        currentLocationName={currentLocation.name}
        safetyStatus={safetyStatus}
      />

      {/* Body Layout: Sidebar + Main Content */}
      <div style={{ display: 'flex', flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {/* Desktop Sidebar (hidden on mobile via CSS) */}
        <div style={{ display: 'none' }} className="desktop-sidebar-wrapper">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={navigateTab}
            onTriggerSos={handleTriggerSos}
            onToggleDiscreet={() => setIsDiscreetMode(true)}
          />
        </div>

        {/* Content View Container */}
        <main style={{
          flex: 1,
          padding: '24px 20px',
          maxWidth: '1050px',
          margin: '0 auto',
          width: '100%',
          marginBottom: '64px' // Space for mobile bottom nav
        }}>
          {currentTab === 'home' && (
            <HomeView
              user={user}
              safetyStatus={safetyStatus}
              currentLocation={currentLocation}
              activeJourney={activeJourney}
              trustedContacts={contacts}
              batteryLevel={batteryLevel}
              isOnline={isOnline}
              recentIncidents={incidents}
              onTriggerSos={handleTriggerSos}
              onNavigateTab={navigateTab}
              onToggleDiscreet={() => setIsDiscreetMode(true)}
              onRefreshLocation={requestLocation}
            />
          )}

          {currentTab === 'journey' && (
            <JourneyView
              activeJourney={activeJourney}
              onStartJourney={(jrn) => setActiveJourney(jrn)}
              onEndJourney={() => setActiveJourney(null)}
              contacts={contacts}
              currentLocation={currentLocation}
              onTriggerSos={handleTriggerSos}
              onAddIncidentLog={addIncidentLog}
            />
          )}

          {currentTab === 'risk' && (
            <RiskView
              batteryLevel={batteryLevel}
              isOnline={isOnline}
              activeJourney={activeJourney}
            />
          )}

          {currentTab === 'contacts' && (
            <ContactsView
              contacts={contacts}
              onUpdateContacts={(newContacts) => setContacts(newContacts)}
              onAddIncidentLog={addIncidentLog}
            />
          )}

          {currentTab === 'checkin' && (
            <CheckInView
              onTriggerSos={handleTriggerSos}
              onAddIncidentLog={addIncidentLog}
            />
          )}

          {currentTab === 'help' && (
            <NearbyHelpView
              currentLocation={currentLocation}
            />
          )}

          {currentTab === 'voice' && (
            <VoiceCommandView
              onTriggerSos={handleTriggerSos}
              user={user}
            />
          )}

          {currentTab === 'history' && (
            <TimelineView
              incidents={incidents}
              onClearHistory={() => setIncidents([])}
            />
          )}

          {currentTab === 'privacy' && (
            <PrivacyView
              onClearAllData={clearAllData}
            />
          )}

          {currentTab === 'settings' && (
            <ProfileSettingsView
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onLogout={() => setIsAuthOpen(true)}
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={navigateTab}
        onTriggerSos={handleTriggerSos}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
      />

      {/* Mobile "More" Drawer Modal */}
      {isMoreMenuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 4, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 90
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            backgroundColor: 'var(--bg-surface)',
            borderTopLeftRadius: 'var(--radius-lg)',
            borderTopRightRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            padding: '24px 20px 36px 20px'
          }} className="animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
                ALL HERBEACON MODULES
              </span>
              <button onClick={() => setIsMoreMenuOpen(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {[
                { id: 'contacts', label: 'Trusted Circle & Relay', icon: '👥' },
                { id: 'checkin', label: 'Smart Check-In', icon: '⏱️' },
                { id: 'help', label: 'Nearby Help (24/7)', icon: '📍' },
                { id: 'voice', label: 'Voice Command', icon: '🎙️' },
                { id: 'history', label: 'Safety History', icon: '📜' },
                { id: 'privacy', label: 'Privacy Center', icon: '🛡️' },
                { id: 'settings', label: 'Profile & Settings', icon: '⚙️' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTab(item.id);
                    setIsMoreMenuOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    color: 'var(--text-main)',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={handleCloseSos}
        user={user}
        contacts={contacts}
        currentLocation={currentLocation}
        onAddIncidentLog={addIncidentLog}
      />

      {/* Authentication / Profile Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={user}
        onLogin={(loggedUser) => setUser(loggedUser)}
        onRegister={(registeredUser) => setUser(registeredUser)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('herbeacon_user');
        }}
      />

      {/* Responsive media styling for desktop sidebar */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-sidebar-wrapper {
            display: block !important;
          }
          main {
            margin-bottom: 24px !important;
          }
          nav {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
