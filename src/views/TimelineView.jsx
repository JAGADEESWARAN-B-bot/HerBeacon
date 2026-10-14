import React, { useState } from 'react';
import { 
  History, 
  Trash2, 
  Download, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Navigation, 
  Filter,
  Check
} from 'lucide-react';

export function TimelineView({ incidents, onClearHistory }) {
  const [filterType, setFilterType] = useState('all');
  const [exported, setExported] = useState(false);

  const filtered = incidents.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `herbeacon_safety_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const getBadge = (type) => {
    switch (type) {
      case 'sos':
        return { label: 'EMERGENCY SOS', color: 'var(--emergency-red)', bg: 'rgba(239, 68, 68, 0.15)', icon: ShieldAlert };
      case 'journey':
        return { label: 'SAFE JOURNEY', color: 'var(--primary-purple-light)', bg: 'var(--primary-lavender-glow)', icon: Navigation };
      case 'checkin':
        return { label: 'CHECK-IN', color: 'var(--safe-green)', bg: 'var(--safe-green-bg)', icon: Clock };
      default:
        return { label: 'SYSTEM EVENT', color: 'var(--text-muted)', bg: 'var(--bg-secondary)', icon: CheckCircle2 };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <History size={22} color="var(--primary-purple-light)" />
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
              Private Safety Timeline
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Chronological audit log of journeys, check-ins, and emergency activations. Retained locally for privacy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-lavender)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Download size={14} />
            <span>{exported ? 'Exported!' : 'Export JSON'}</span>
          </button>

          <button
            onClick={onClearHistory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: 'var(--emergency-red)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'all', label: `All Events (${incidents.length})` },
          { id: 'journey', label: 'Journeys' },
          { id: 'checkin', label: 'Check-Ins' },
          { id: 'sos', label: 'SOS Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: filterType === tab.id ? 'var(--primary-purple)' : 'var(--bg-secondary)',
              color: filterType === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              border: '1px solid var(--border-subtle)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'var(--bg-surface)',
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-subtle)' }}>
            <History size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No timeline events found in this category.</p>
          </div>
        ) : (
          filtered.map((item, index) => {
            const badge = getBadge(item.type);
            const Icon = badge.icon;
            const dateObj = new Date(item.timestamp);
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: badge.bg,
                  color: badge.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: badge.bg,
                        color: badge.color
                      }}>
                        {badge.label}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                        {item.title}
                      </h4>
                    </div>

                    <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                      {dateObj.toLocaleDateString()} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
