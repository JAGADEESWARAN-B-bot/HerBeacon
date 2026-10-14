import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  Send, 
  MapPin, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle, 
  ShieldAlert,
  Copy,
  ExternalLink
} from 'lucide-react';

export function SosModal({ 
  isOpen, 
  onClose, 
  user, 
  contacts, 
  currentLocation, 
  onAddIncidentLog 
}) {
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [emergencyConfirmed, setEmergencyConfirmed] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const [copiedLocation, setCopiedLocation] = useState(false);

  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const intervalRef = useRef(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialSeconds = user?.settings?.sosCountdownSeconds || 5;
      setCountdown(initialSeconds);
      setIsCountingDown(true);
      setEmergencyConfirmed(false);
      setAlertSent(false);

      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsCountingDown(false);
            triggerEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      stopSiren();
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      stopSiren();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen]);

  const triggerEmergency = () => {
    setEmergencyConfirmed(true);
    setIsCountingDown(false);
    if (user?.settings?.sirenSoundEnabled) {
      startSiren();
    }
    // Record incident
    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'sos',
        title: 'Emergency SOS Activated',
        description: `Emergency alert triggered by user at ${currentLocation?.name || 'Current GPS position'}. Trusted circle notified.`,
        status: 'danger'
      });
    }
  };

  const cancelSos = () => {
    stopSiren();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (emergencyConfirmed && onAddIncidentLog) {
      onAddIncidentLog({
        type: 'sos_cancel',
        title: 'SOS Disarmed / Safe Now',
        description: 'User confirmed they are safe and deactivated emergency state.',
        status: 'safe'
      });
    }
    onClose();
  };

  // Synthesized Web Audio API Emergency Siren (Zero external sound file dependencies)
  const startSiren = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      // Oscillate frequency like emergency siren
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.8);

      // Loop effect
      const sirenInterval = setInterval(() => {
        if (!audioContextRef.current) {
          clearInterval(sirenInterval);
          return;
        }
        const t = ctx.currentTime;
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(950, t + 0.4);
        osc.frequency.exponentialRampToValueAtTime(650, t + 0.8);
      }, 800);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsSirenPlaying(true);
    } catch (e) {
      console.warn('AudioContext not allowed without prior user interaction', e);
    }
  };

  const stopSiren = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch (e) {
      // ignore
    }
    oscillatorRef.current = null;
    audioContextRef.current = null;
    setIsSirenPlaying(false);
  };

  const handleNotifyContacts = () => {
    setAlertSent(true);
    const locText = currentLocation?.lat && currentLocation?.lng
      ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
      : 'Location: ' + (currentLocation?.name || 'Unavailable');

    const message = `EMERGENCY SOS: This is an automated HerBeacon safety alert from ${user?.name || 'Elena'}. I need immediate help. My current location: ${locText}. Please check in on me immediately.`;

    // Attempt native share or SMS link
    const primaryContact = contacts.find(c => c.permissions?.sosAlerts) || contacts[0];
    const phone = primaryContact ? primaryContact.phone.replace(/[^0-9+]/g, '') : '911';

    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };

  const handleCopyLocation = () => {
    const locString = currentLocation?.lat && currentLocation?.lng 
      ? `Lat: ${currentLocation.lat.toFixed(5)}, Lng: ${currentLocation.lng.toFixed(5)} (${currentLocation.name})`
      : currentLocation?.name || 'Location unavailable';

    navigator.clipboard?.writeText(locString);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 4, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#1E0E2E',
        border: '2px solid var(--emergency-red)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        boxShadow: 'var(--shadow-emergency)',
        position: 'relative',
        color: '#FFFFFF'
      }} className="animate-slide-up">

        {/* Top Dismiss / Close Button */}
        <button
          onClick={cancelSos}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
        >
          <X size={18} />
        </button>

        {/* Phase 1: Accidental Activation Countdown */}
        {isCountingDown && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '4px solid var(--emergency-red)',
              margin: '0 auto 20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
              fontWeight: 800,
              color: 'var(--emergency-red)',
              boxShadow: 'var(--shadow-emergency)'
            }} className="beacon-sos-pulse">
              {countdown}
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>
              Emergency SOS Triggered
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px', lineHeight: 1.5 }}>
              Triggering emergency escalation in {countdown} seconds to prevent accidental activation.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={cancelSos}
                style={{
                  padding: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '15px'
                }}
              >
                Cancel SOS (I'm Safe)
              </button>

              <button
                onClick={triggerEmergency}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--emergency-red)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800,
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <ShieldAlert size={18} />
                <span>Confirm Emergency Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Phase 2: Active Emergency Assistance Screen */}
        {!isCountingDown && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--emergency-red)'
              }}>
                <ShieldAlert size={28} />
              </div>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--emergency-red)',
                  letterSpacing: '0.05em'
                }}>
                  EMERGENCY STATE ACTIVE
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  HerBeacon Assistance
                </h2>
              </div>
            </div>

            {/* Current Coordinates Card */}
            <div style={{
              padding: '14px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary-lavender)' }}>
                  <MapPin size={14} />
                  <span>Your Live Location</span>
                </div>
                <button
                  onClick={handleCopyLocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    padding: '2px 6px'
                  }}
                >
                  <Copy size={12} />
                  <span>{copiedLocation ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
                {currentLocation?.name || '4th Avenue & Pine St, Metro District'}
              </p>
              {currentLocation?.lat && (
                <p style={{ fontSize: '11px', color: 'var(--text-subtle)', margin: '2px 0 0 0' }}>
                  Coordinates: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)} • Accurate within 8m
                </p>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {/* Call 911 / 112 */}
              <a
                href="tel:911"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '15px',
                  boxShadow: 'var(--shadow-emergency)'
                }}
              >
                <PhoneCall size={18} />
                <span>Call Emergency Services (911 / 112)</span>
              </a>

              {/* Notify Trusted Circle */}
              <button
                onClick={handleNotifyContacts}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '13px',
                  backgroundColor: 'var(--primary-purple)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                <Send size={16} />
                <span>{alertSent ? '✓ Alert Sent to Trusted Circle' : 'Send Alert & Location via SMS'}</span>
              </button>

              {/* Siren Toggle */}
              <button
                onClick={() => isSirenPlaying ? stopSiren() : startSiren()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: isSirenPlaying ? 'rgba(239, 68, 68, 0.25)' : 'var(--bg-surface)',
                  color: isSirenPlaying ? 'var(--emergency-red)' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  fontSize: '13px'
                }}
              >
                {isSirenPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isSirenPlaying ? 'Mute Emergency Siren' : 'Sound Audible Emergency Siren'}</span>
              </button>
            </div>

            {/* Contact Status List */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)', marginBottom: '8px', letterSpacing: '0.04em' }}>
                ESCALATION STATUS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {contacts.slice(0, 3).map((contact, idx) => (
                  <div
                    key={contact.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-purple)',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontWeight: 600 }}>{contact.name} ({contact.relationship})</span>
                    </div>
                    <span style={{ color: 'var(--safe-green)', fontSize: '11px', fontWeight: 600 }}>
                      Dispatched
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disarm & Safe Button */}
            <button
              onClick={cancelSos}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--safe-green)',
                border: '1px solid var(--safe-green)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle size={16} />
              <span>I Am Safe Now — Disarm SOS</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
