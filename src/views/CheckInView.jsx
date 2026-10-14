import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  RefreshCw, 
  Plus, 
  Sliders,
  Check
} from 'lucide-react';

export function CheckInView({ onTriggerSos, onAddIncidentLog }) {
  const [intervalMinutes, setIntervalMinutes] = useState(30);
  const [timerSecondsRemaining, setTimerSecondsRemaining] = useState(30 * 60);
  const [isPromptActive, setIsPromptActive] = useState(false);
  const [lastCheckInTime, setLastCheckInTime] = useState(new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [checkInCount, setCheckInCount] = useState(4);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSecondsRemaining(prev => {
        if (prev <= 1) {
          setIsPromptActive(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalMinutes]);

  const handleImSafe = () => {
    setIsPromptActive(false);
    setTimerSecondsRemaining(intervalMinutes * 60);
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastCheckInTime(nowStr);
    setCheckInCount(prev => prev + 1);

    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'checkin',
        title: 'Smart Check-In Completed',
        description: `User responded 'I am Safe' at ${nowStr}. Next check-in reset.`,
        status: 'safe'
      });
    }
  };

  const handleExtendTime = () => {
    setIsPromptActive(false);
    setTimerSecondsRemaining(15 * 60); // +15 mins
    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'checkin',
        title: 'Check-In Window Extended',
        description: 'User requested +15 minutes extension.',
        status: 'info'
      });
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Clock size={22} color="var(--primary-purple-light)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Smart Safety Check-In
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Scheduled micro-verifications. If you don't respond, HerBeacon automatically notifies your escalation relay.
        </p>
      </div>

      {/* Main Check-In Card */}
      <div style={{
        padding: '28px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px'
      }}>
        {/* Animated Countdown Dial */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          border: '4px solid var(--primary-purple)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)', fontWeight: 600 }}>NEXT CHECK-IN</span>
          <span style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.02em' }}>
            {formatTime(timerSecondsRemaining)}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--safe-green)', fontWeight: 700 }}>ACTIVE</span>
        </div>

        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
            Check-In Interval: Every {intervalMinutes} Minutes
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
            Last verified safe at {lastCheckInTime} • Total verifications today: {checkInCount}
          </p>
        </div>

        {/* Quick Check-In Button right now */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleImSafe}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--safe-green)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Check size={18} />
            <span>Confirm "I Am Safe" Now</span>
          </button>

          <button
            onClick={() => setIsPromptActive(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-lavender)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '14px'
            }}
          >
            Simulate "Are You Safe?" Prompt
          </button>
        </div>
      </div>

      {/* Interval Selector Settings */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>
          Adjust Check-In Frequency
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {[15, 30, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setIntervalMinutes(mins);
                setTimerSecondsRemaining(mins * 60);
              }}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: intervalMinutes === mins ? 'var(--primary-purple)' : 'var(--bg-surface)',
                color: intervalMinutes === mins ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '13px',
                border: '1px solid var(--border-subtle)'
              }}
            >
              Every {mins} Mins {mins === 30 && '(Standard)'}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Prompt Modal */}
      {isPromptActive && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 4, 20, 0.88)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#1E1235',
            border: '2px solid var(--primary-purple-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            textAlign: 'center',
            color: '#FFFFFF'
          }} className="animate-slide-up">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-lavender-glow)',
              color: 'var(--primary-lavender)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Clock size={32} />
            </div>

            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
              SCHEDULED SAFETY CHECK
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 8px 0' }}>
              Are you safe?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: 1.5 }}>
              Tap "I'm Safe" to reset your safety timer. If you do not respond within 3 minutes, your trusted relay will be notified.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleImSafe}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--safe-green)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '15px'
                }}
              >
                I'm Safe (Confirm Now)
              </button>

              <button
                onClick={handleExtendTime}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--primary-lavender)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              >
                Extend Time (+15 Mins)
              </button>

              <button
                onClick={() => {
                  setIsPromptActive(false);
                  onTriggerSos();
                }}
                style={{
                  padding: '12px',
                  backgroundColor: 'var(--emergency-red)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px'
                }}
              >
                Need Help (Trigger SOS)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
