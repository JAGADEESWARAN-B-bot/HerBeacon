import React from 'react';
import { 
  ShieldCheck, 
  Navigation, 
  Clock, 
  Radio, 
  Users, 
  MapPin, 
  Activity, 
  AlertTriangle, 
  EyeOff, 
  Mic, 
  ChevronRight, 
  Battery, 
  Wifi, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export function HomeView({
  user,
  safetyStatus,
  currentLocation,
  activeJourney,
  trustedContacts,
  batteryLevel,
  isOnline,
  recentIncidents,
  onTriggerSos,
  onNavigateTab,
  onToggleDiscreet,
  onRefreshLocation
}) {
  const getStatusDisplay = () => {
    if (safetyStatus === 'emergency') {
      return {
        label: 'EMERGENCY IN PROGRESS',
        description: 'SOS alert active. Escalation dispatched to trusted contacts.',
        color: 'var(--emergency-red)',
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'var(--emergency-red)'
      };
    }
    if (safetyStatus === 'caution') {
      return {
        label: 'CAUTION RECOMMENDED',
        description: 'Unusual journey delay or late-night route detected. Stay alert.',
        color: 'var(--caution-yellow)',
        bg: 'var(--caution-yellow-bg)',
        border: 'var(--caution-yellow)'
      };
    }
    return {
      label: 'YOU ARE CURRENTLY SAFE',
      description: 'AI Risk Monitor: No deviations or hazards detected. Circle connected.',
      color: 'var(--safe-green)',
      bg: 'var(--safe-green-bg)',
      border: 'rgba(16, 185, 129, 0.4)'
    };
  };

  const statusInfo = getStatusDisplay();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      
      {/* 1. Header Welcome & Personalized Greeting */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        padding: '6px 0'
      }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
            YOUR PERSONAL SAFETY COMPANION
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0 0' }}>
            Hello, {user?.name?.split(' ')[0] || 'Elena'} 👋
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            HerBeacon is actively monitoring your safety environment.
          </p>
        </div>

        {/* Live Device Snapshot Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 14px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isOnline ? 'var(--safe-green)' : 'var(--caution-yellow)' }} />
            <span style={{ fontWeight: 600 }}>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>
          <span style={{ color: 'var(--border-subtle)' }}>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Battery size={14} color={batteryLevel < 20 ? 'var(--emergency-red)' : 'var(--text-muted)'} />
            <span style={{ fontWeight: 600 }}>{batteryLevel}% Battery</span>
          </div>
        </div>
      </div>

      {/* 2. Main Safety Status Hero Banner */}
      <div style={{
        padding: '24px',
        backgroundColor: statusInfo.bg,
        borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${statusInfo.border}`,
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-primary)',
            border: `2px solid ${statusInfo.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 16px ${statusInfo.color}40`
          }}>
            <ShieldCheck size={32} color={statusInfo.color} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: statusInfo.color, letterSpacing: '0.06em' }}>
              CURRENT STATUS
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '2px 0 4px 0' }}>
              {statusInfo.label}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              {statusInfo.description}
            </p>
          </div>
        </div>

        {/* Location snippet & refresh button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px'
        }}>
          <MapPin size={14} color="var(--primary-purple-light)" />
          <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {currentLocation?.name || '4th Ave & Pine St'}
          </span>
          <button
            onClick={onRefreshLocation}
            style={{
              padding: '2px 8px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-lavender)',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            Update
          </button>
        </div>
      </div>

      {/* 3. Big Prominent SOS Trigger Card */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(239, 68, 68, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--emergency-red)'
          }}>
            <Radio size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0' }}>
              Need Urgent Help?
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              One tap alerts your trusted circle with live GPS and provides emergency calling options.
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSos}
          style={{
            padding: '12px 28px',
            backgroundColor: '#DC2626',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-emergency)'
          }}
          className="beacon-sos-pulse"
        >
          <Radio size={18} />
          <span>PRESS FOR SOS</span>
        </button>
      </div>

      {/* 4. Active Safe Journey Widget (if journey active) */}
      {activeJourney && (
        <div style={{
          padding: '20px 24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--primary-purple)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700
              }}>
                ACTIVE JOURNEY
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>
                {activeJourney.origin} → {activeJourney.destination}
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('journey')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--primary-purple-light)',
                fontSize: '12px',
                fontWeight: 600,
                backgroundColor: 'transparent'
              }}
            >
              <span>Track Live</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '10px'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
              borderRadius: '4px'
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>ETA: ~12 mins remaining</span>
            <span>Safety Score: <strong style={{ color: 'var(--safe-green)' }}>{activeJourney.safetyScore}/100</strong></span>
            <span>Check-in: Scheduled in 5m</span>
          </div>
        </div>
      )}

      {/* 5. Four Quick Action Modules */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '10px', letterSpacing: '0.04em' }}>
          SAFETY TOOLS & ACTIONS
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}>
          {/* Start Journey */}
          <div
            onClick={() => onNavigateTab('journey')}
            style={{
              padding: '18px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary-lavender-glow)',
              color: 'var(--primary-purple-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Navigation size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                Safe Journey
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Set destination & ETA. Automatically alerts contacts if delayed.
              </p>
            </div>
          </div>

          {/* Smart Check-In */}
          <div
            onClick={() => onNavigateTab('checkin')}
            style={{
              padding: '18px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--safe-green-bg)',
              color: 'var(--safe-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                Smart Check-In
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Schedule automated "Are you safe?" prompts with escalation.
              </p>
            </div>
          </div>

          {/* AI Risk Monitor */}
          <div
            onClick={() => onNavigateTab('risk')}
            style={{
              padding: '18px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(167, 139, 250, 0.15)',
              color: 'var(--primary-purple-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Activity size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                AI Risk Monitor
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Transparent risk predictions & actionable journey guidance.
              </p>
            </div>
          </div>

          {/* Discreet Camouflage Mode */}
          <div
            onClick={onToggleDiscreet}
            style={{
              padding: '18px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <EyeOff size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', margin: '0 0 2px 0' }}>
                Discreet Mode
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Stealth notes camouflage with secret double-tap silent trigger.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. AI Safety Recommendation Banner */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-lavender-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary-purple-light)'
        }}>
          <Sparkles size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
            AI SAFETY RECOMMENDATION
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '2px 0 0 0', fontWeight: 500 }}>
            "You are traveling along a verified, well-lit public transit line. Battery is 78%. No route anomalies detected."
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('risk')}
          style={{
            fontSize: '12px',
            color: 'var(--primary-lavender)',
            background: 'transparent',
            fontWeight: 600
          }}
        >
          View Analysis →
        </button>
      </div>

      {/* 7. Trusted Circle Overview & Recent Activity Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px'
      }}>
        {/* Trusted Circle Card */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--primary-purple-light)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Trusted Circle</h3>
            </div>
            <button
              onClick={() => onNavigateTab('contacts')}
              style={{ fontSize: '12px', color: 'var(--primary-purple-light)', background: 'transparent', fontWeight: 600 }}
            >
              Manage ({trustedContacts.length})
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trustedContacts.slice(0, 3).map((contact, index) => (
              <div
                key={contact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{contact.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>{contact.relationship}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--safe-green-bg)',
                  color: 'var(--safe-green)'
                }}>
                  Relay #{contact.relayOrder}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Safety Activity */}
        <div style={{
          padding: '20px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Safety Timeline</h3>
            <button
              onClick={() => onNavigateTab('history')}
              style={{ fontSize: '12px', color: 'var(--primary-purple-light)', background: 'transparent', fontWeight: 600 }}
            >
              Full Log
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentIncidents.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-subtle)'
                }}
              >
                <CheckCircle2 size={16} color="var(--safe-green)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
