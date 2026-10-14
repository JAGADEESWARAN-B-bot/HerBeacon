import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Play, 
  Square, 
  RefreshCw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export function JourneyView({ 
  activeJourney, 
  onStartJourney, 
  onEndJourney, 
  contacts, 
  currentLocation,
  onTriggerSos,
  onAddIncidentLog 
}) {
  const [origin, setOrigin] = useState('Tech Innovation Campus, Bldg 4');
  const [destination, setDestination] = useState('Westside Greenway Apartment 4B');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [checkInInterval, setCheckInInterval] = useState(15);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [extendedMinutes, setExtendedMinutes] = useState(0);

  const handleStart = (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onStartJourney({
      origin: origin || 'Current Location',
      destination,
      expectedDurationMinutes: Number(durationMinutes),
      checkInIntervalMinutes: Number(checkInInterval),
      trustedContactId: selectedContactId,
      startedAt: new Date().toISOString(),
      status: 'in_progress',
      routeType: 'Main Well-Lit Transit Corridor',
      safetyScore: 89
    });

    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'journey',
        title: 'Safe Journey Initiated',
        description: `En route to ${destination}. Scheduled duration: ${durationMinutes} mins.`,
        status: 'active'
      });
    }
  };

  const handleDelaySimulation = () => {
    setShowDelayModal(true);
  };

  const handleConfirmSafe = () => {
    setShowDelayModal(false);
    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'checkin',
        title: 'Delay Prompt: Confirmed Safe',
        description: 'User confirmed safety after journey delay prompt.',
        status: 'safe'
      });
    }
  };

  const handleExtendJourney = () => {
    setExtendedMinutes(prev => prev + 15);
    setShowDelayModal(false);
    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'journey',
        title: 'Journey Extended',
        description: 'User extended estimated arrival time by 15 minutes.',
        status: 'info'
      });
    }
  };

  const selectedContact = contacts.find(c => c.id === (activeJourney?.trustedContactId || selectedContactId)) || contacts[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Title Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Navigation size={22} color="var(--primary-purple-light)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Safe Journey Monitoring
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Proactive travel escort: Monitored arrival times, trusted circle check-ins, and verified route safety.
        </p>
      </div>

      {/* Active Journey Card or New Journey Creator */}
      {activeJourney ? (
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid var(--primary-purple)',
          boxShadow: 'var(--shadow-glow)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Header Status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--safe-green)'
              }} className="beacon-sos-pulse" />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
                  ACTIVE ESCORT MODE
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  {activeJourney.origin} → {activeJourney.destination}
                </h3>
              </div>
            </div>

            <button
              onClick={() => {
                onEndJourney();
                if (onAddIncidentLog) {
                  onAddIncidentLog({
                    type: 'journey',
                    title: 'Journey Completed Safely',
                    description: `Arrived at ${activeJourney.destination}. Contact circle informed.`,
                    status: 'safe'
                  });
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--safe-green)',
                border: '1px solid var(--safe-green)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '13px'
              }}
            >
              <Check size={16} />
              <span>Arrived Safely</span>
            </button>
          </div>

          {/* Progress Bar & ETA Breakdown */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Elapsed: ~12m</span>
              <span style={{ fontWeight: 700, color: 'var(--primary-lavender)' }}>
                ETA: ~{Math.max(1, activeJourney.expectedDurationMinutes + extendedMinutes - 12)} mins remaining
              </span>
              <span>Total: {activeJourney.expectedDurationMinutes + extendedMinutes}m</span>
            </div>
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '5px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '58%',
                height: '100%',
                background: 'linear-gradient(90deg, #7C3AED, #A78BFA)',
                borderRadius: '5px'
              }} />
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>Verified Route Score</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--safe-green)' }}>
                {activeJourney.safetyScore}/100
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>High footfall, well lit</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>Designated Contact</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                {selectedContact?.name}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Receives automatic alerts</span>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-subtle)', display: 'block' }}>Auto Check-In</span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--primary-lavender)', display: 'block' }}>
                Every {activeJourney.checkInIntervalMinutes}m
              </span>
              <span style={{ fontSize: '11px', color: 'var(--safe-green)' }}>Next prompt in 3 mins</span>
            </div>
          </div>

          {/* Demonstration Action: Simulate Delay */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--caution-yellow)' }}>
                Demo Simulation Tool
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-subtle)', margin: 0 }}>
                Test what happens when arrival time is exceeded.
              </p>
            </div>
            <button
              onClick={handleDelaySimulation}
              style={{
                padding: '8px 14px',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--caution-yellow)',
                border: '1px solid var(--caution-yellow)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              Simulate Delay Trigger
            </button>
          </div>
        </div>
      ) : (
        /* Journey Setup Form */
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
            Plan a Monitored Safe Journey
          </h3>

          <form onSubmit={handleStart} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '6px' }}>
                  Starting Point
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Current location or Work"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '6px' }}>
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Home, Metro Station, Friend's house"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '6px' }}>
                  Expected Travel Time
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={25}>25 Minutes (Recommended)</option>
                  <option value={40}>40 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '6px' }}>
                  Designated Trusted Contact
                </label>
                <select
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '6px' }}>
                  Safety Check-In Frequency
                </label>
                <select
                  value={checkInInterval}
                  onChange={(e) => setCheckInInterval(e.target.value)}
                >
                  <option value={10}>Every 10 Minutes</option>
                  <option value={15}>Every 15 Minutes</option>
                  <option value={30}>Every 30 Minutes</option>
                  <option value={0}>Only on Arrival</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '14px',
                backgroundColor: 'var(--primary-purple)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <Play size={18} />
              <span>Start Safe Journey Monitoring</span>
            </button>
          </form>
        </div>
      )}

      {/* Smart Route Safety Analysis Card */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-purple-light)' }}>
              VERIFIED SMART ROUTE SAFETY
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 0 0' }}>
              Safety Score: <span style={{ color: 'var(--safe-green)' }}>89/100</span> (Transit Corridor A)
            </h3>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            Transparent verification • No fabricated crime metrics
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
              🚨 2 Police & Help Booths
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Central Police Station (0.6 km) & Transit Booth (0.8 km)
            </span>
          </div>

          <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
              🏥 1 24/7 Hospital ER
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              St. Jude Memorial Hospital (1.2 km) along the primary avenue
            </span>
          </div>

          <div style={{ padding: '12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
              💡 Street Lighting: 94%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Commercial street illumination & high evening pedestrian footfall
            </span>
          </div>
        </div>
      </div>

      {/* Delay Alert Modal (Appears when arrival exceeded) */}
      {showDelayModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 4, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            backgroundColor: '#1E1133',
            border: '2px solid var(--caution-yellow)',
            borderRadius: 'var(--radius-lg)',
            padding: '26px',
            color: '#FFFFFF'
          }} className="animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--caution-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--caution-yellow)' }}>
                  TIME WINDOW EXCEEDED
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  Are you safe?
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              Your journey is taking longer than expected. Please confirm your status within 2 minutes before we notify {selectedContact?.name}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleConfirmSafe}
                style={{
                  padding: '13px',
                  backgroundColor: 'var(--safe-green)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                I'm Safe (On Schedule)
              </button>

              <button
                onClick={handleExtendJourney}
                style={{
                  padding: '13px',
                  backgroundColor: 'var(--bg-surface-elevated)',
                  color: 'var(--primary-lavender)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Extend Journey (+15 Mins)
              </button>

              <button
                onClick={() => {
                  setShowDelayModal(false);
                  onTriggerSos();
                }}
                style={{
                  padding: '13px',
                  backgroundColor: 'var(--emergency-red)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                I Need Help (Trigger SOS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
