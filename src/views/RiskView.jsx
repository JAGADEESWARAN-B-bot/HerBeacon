import React, { useState } from 'react';
import { 
  Activity, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Battery, 
  Clock, 
  Wifi, 
  MapPin, 
  Info,
  Sliders
} from 'lucide-react';

export function RiskView({ batteryLevel, isOnline, activeJourney }) {
  // Configurable signal simulation states
  const [isDelayed, setIsDelayed] = useState(false);
  const [isLateNight, setIsLateNight] = useState(false);
  const [hasDeviation, setHasDeviation] = useState(false);
  const [simulatedBatteryLow, setSimulatedBatteryLow] = useState(batteryLevel < 20);

  // Compute explainable risk level
  const computeRisk = () => {
    let score = 10;
    const reasons = [];
    const recommendations = [];

    if (!isOnline) {
      score += 25;
      reasons.push('Mobile network disconnected: Offline safety mode active.');
      recommendations.push('Keep emergency contacts accessible offline and follow illuminated transit lines.');
    }

    if (simulatedBatteryLow) {
      score += 20;
      reasons.push('Device battery is critically low (<20%).');
      recommendations.push('Enable Battery Saver mode and send a quick check-in to your primary trusted contact.');
    }

    if (isDelayed) {
      score += 35;
      reasons.push('Journey duration has exceeded the estimated arrival window by more than 10 minutes.');
      recommendations.push('Confirm your safety or notify your trusted circle to prevent automated escalation.');
    }

    if (isLateNight) {
      score += 20;
      reasons.push('Travel window is during late-night hours (after 10:00 PM).');
      recommendations.push('Prefer well-populated transit corridors and keep discreet mode within reach.');
    }

    if (hasDeviation) {
      score += 40;
      reasons.push('Route trajectory deviates from the planned travel path.');
      recommendations.push('Verify your navigation directions and share your live location with your guardian.');
    }

    if (score < 30) {
      return {
        level: 'LOW',
        badgeColor: 'var(--safe-green)',
        badgeBg: 'var(--safe-green-bg)',
        icon: CheckCircle,
        title: 'Safety Recommendation: Safe & On Track',
        summary: 'Non-sensitive signals indicate a normal, uninterrupted journey.',
        reasons: reasons.length ? reasons : ['All telemetry signals normal', 'Verified well-lit corridor', 'Battery is healthy'],
        recommendations: recommendations.length ? recommendations : ['Continue along your designated route', 'Next check-in scheduled automatically']
      };
    } else if (score < 65) {
      return {
        level: 'MODERATE',
        badgeColor: 'var(--caution-yellow)',
        badgeBg: 'var(--caution-yellow-bg)',
        icon: AlertTriangle,
        title: 'Safety Recommendation: Heightened Caution Advised',
        summary: 'One or more secondary environmental factors warrant extra attention.',
        reasons: reasons,
        recommendations: recommendations
      };
    } else {
      return {
        level: 'HIGH',
        badgeColor: 'var(--emergency-red)',
        badgeBg: 'rgba(239, 68, 68, 0.15)',
        icon: ShieldAlert,
        title: 'Safety Recommendation: Immediate Check-In Recommended',
        summary: 'Multiple safety signals triggered simultaneously (delay / deviation).',
        reasons: reasons,
        recommendations: recommendations
      };
    }
  };

  const risk = computeRisk();
  const IconComponent = risk.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Sparkles size={22} color="var(--primary-purple-light)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            AI Risk Monitor
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Transparent, explainable safety guidance derived from non-sensitive travel signals. Never uses personal or biased demographics.
        </p>
      </div>

      {/* Main AI Risk Level Card */}
      <div style={{
        padding: '24px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${risk.badgeColor}`,
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: risk.badgeBg,
              color: risk.badgeColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconComponent size={26} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: risk.badgeColor, letterSpacing: '0.05em' }}>
                SAFETY LEVEL
              </span>
              <h3 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                {risk.level === 'LOW' && '🟢 LOW RISK'}
                {risk.level === 'MODERATE' && '🟡 MODERATE RISK'}
                {risk.level === 'HIGH' && '🔴 HIGH RISK'}
              </h3>
            </div>
          </div>

          <div style={{
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}>
            Explainable AI • Non-prescriptive
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '18px'
        }}>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
            {risk.title}
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            {risk.summary}
          </p>
        </div>

        {/* Explainability Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Signal Reasons */}
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--primary-purple-light)', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              WHY THIS LEVEL? (EVALUATED SIGNALS)
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {risk.reasons.map((reason, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: risk.badgeColor, fontWeight: 700 }}>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--safe-green)', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
              RECOMMENDED ACTIONS
            </span>
            <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {risk.recommendations.map((rec, i) => (
                <li key={i} style={{ fontSize: '12px', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: 'var(--safe-green)', fontWeight: 700 }}>✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Signal Sensitivity Simulator (Interactive testing for presentation) */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sliders size={18} color="var(--primary-purple-light)" />
          <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>
            Interactive AI Signal Simulator
          </h3>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-subtle)', marginBottom: '16px' }}>
          Toggle environmental signals below to observe how HerBeacon dynamically evaluates risk in real time:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          <button
            onClick={() => setIsDelayed(!isDelayed)}
            style={{
              padding: '12px',
              backgroundColor: isDelayed ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
              border: `1px solid ${isDelayed ? 'var(--caution-yellow)' : 'var(--border-subtle)'}`,
              color: isDelayed ? 'var(--caution-yellow)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            ⏱️ Unusual Journey Delay: {isDelayed ? 'Triggered (+15m)' : 'Normal'}
          </button>

          <button
            onClick={() => setHasDeviation(!hasDeviation)}
            style={{
              padding: '12px',
              backgroundColor: hasDeviation ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
              border: `1px solid ${hasDeviation ? 'var(--emergency-red)' : 'var(--border-subtle)'}`,
              color: hasDeviation ? 'var(--emergency-red)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            🗺️ Route Trajectory: {hasDeviation ? 'Deviation Detected' : 'On Track'}
          </button>

          <button
            onClick={() => setIsLateNight(!isLateNight)}
            style={{
              padding: '12px',
              backgroundColor: isLateNight ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
              border: `1px solid ${isLateNight ? 'var(--primary-purple-light)' : 'var(--border-subtle)'}`,
              color: isLateNight ? 'var(--primary-lavender)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            🌙 Travel Time: {isLateNight ? 'Late Night (11:45 PM)' : 'Daylight (5:30 PM)'}
          </button>

          <button
            onClick={() => setSimulatedBatteryLow(!simulatedBatteryLow)}
            style={{
              padding: '12px',
              backgroundColor: simulatedBatteryLow ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
              border: `1px solid ${simulatedBatteryLow ? 'var(--emergency-red)' : 'var(--border-subtle)'}`,
              color: simulatedBatteryLow ? 'var(--emergency-red)' : 'var(--text-muted)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'left'
            }}
          >
            🔋 Device Battery: {simulatedBatteryLow ? 'Critical (14%)' : 'Healthy (78%)'}
          </button>
        </div>
      </div>
    </div>
  );
}
