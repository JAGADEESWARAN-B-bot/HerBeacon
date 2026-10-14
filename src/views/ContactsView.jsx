import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ArrowUp, 
  ArrowDown, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Radio, 
  Trash2, 
  Phone, 
  Check, 
  X,
  ListOrdered
} from 'lucide-react';

export function ContactsView({ contacts, onUpdateContacts, onAddIncidentLog }) {
  const [activeTab, setActiveTab] = useState('circle'); // 'circle' or 'relay'
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [sosAlerts, setSosAlerts] = useState(true);
  const [liveLocation, setLiveLocation] = useState(true);
  const [journeyUpdates, setJourneyUpdates] = useState(true);
  const [checkInAlerts, setCheckInAlerts] = useState(false);

  // Move contact priority up in relay
  const movePriority = (index, direction) => {
    const newContacts = [...contacts];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newContacts.length) return;

    const temp = newContacts[index];
    newContacts[index] = newContacts[targetIndex];
    newContacts[targetIndex] = temp;

    // Recalculate relayOrder
    const updated = newContacts.map((c, i) => ({ ...c, relayOrder: i + 1 }));
    onUpdateContacts(updated);
  };

  const handleTogglePermission = (contactId, permKey) => {
    const updated = contacts.map(c => {
      if (c.id === contactId) {
        return {
          ...c,
          permissions: {
            ...c.permissions,
            [permKey]: !c.permissions[permKey]
          }
        };
      }
      return c;
    });
    onUpdateContacts(updated);
  };

  const handleDeleteContact = (contactId) => {
    if (contacts.length <= 1) {
      alert('You must retain at least one trusted contact in your circle.');
      return;
    }
    const filtered = contacts.filter(c => c.id !== contactId).map((c, i) => ({ ...c, relayOrder: i + 1 }));
    onUpdateContacts(filtered);
    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'contact',
        title: 'Trusted Contact Removed',
        description: 'Updated trusted circle permissions.',
        status: 'info'
      });
    }
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact = {
      id: `ct_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      relayOrder: contacts.length + 1,
      permissions: {
        sosAlerts,
        liveLocation,
        journeyUpdates,
        checkInAlerts
      },
      status: 'Active • Ready'
    };

    onUpdateContacts([...contacts, newContact]);
    setShowAddModal(false);
    setName('');
    setPhone('');

    if (onAddIncidentLog) {
      onAddIncidentLog({
        type: 'contact',
        title: 'New Trusted Contact Added',
        description: `${newContact.name} (${newContact.relationship}) added to circle.`,
        status: 'safe'
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Users size={22} color="var(--primary-purple-light)" />
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
              Trusted Circle & Safety Relay
            </h2>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Configure verified contacts, granular permission sharing, and sequential alert escalation.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: 'var(--primary-purple)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: 'var(--shadow-glow)'
          }}
        >
          <UserPlus size={16} />
          <span>Add Trusted Contact</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        backgroundColor: 'var(--bg-secondary)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        maxWidth: '360px'
      }}>
        <button
          onClick={() => setActiveTab('circle')}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'circle' ? 'var(--primary-purple)' : 'transparent',
            color: activeTab === 'circle' ? '#FFFFFF' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          Trusted Circle ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab('relay')}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: activeTab === 'relay' ? 'var(--primary-purple)' : 'transparent',
            color: activeTab === 'relay' ? '#FFFFFF' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          Safety Relay Ladder
        </button>
      </div>

      {/* Tab 1: Trusted Circle Cards with Granular Permissions */}
      {activeTab === 'circle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {contacts.map((contact, index) => (
            <div
              key={contact.id}
              style={{
                padding: '20px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px'
              }}
            >
              {/* Top Contact Info */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{contact.name}</h4>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary-lavender-glow)',
                        color: 'var(--primary-lavender)'
                      }}>
                        {contact.relationship}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      <Phone size={12} />
                      <span>{contact.phone}</span>
                      <span>•</span>
                      <span style={{ color: 'var(--safe-green)', fontWeight: 600 }}>Relay #{contact.relayOrder}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <a
                    href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: 'var(--bg-secondary)',
                      color: 'var(--primary-lavender)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Call
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: 'transparent',
                      color: 'var(--text-subtle)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                    title="Remove from circle"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Granular Sharing Permission Toggles */}
              <div style={{
                padding: '12px 16px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>
                  DATA SHARED:
                </span>

                <button
                  onClick={() => handleTogglePermission(contact.id, 'sosAlerts')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: contact.permissions.sosAlerts ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface)',
                    color: contact.permissions.sosAlerts ? 'var(--emergency-red)' : 'var(--text-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  🚨 SOS Alerts: {contact.permissions.sosAlerts ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => handleTogglePermission(contact.id, 'liveLocation')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: contact.permissions.liveLocation ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface)',
                    color: contact.permissions.liveLocation ? 'var(--safe-green)' : 'var(--text-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  📍 Live GPS: {contact.permissions.liveLocation ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => handleTogglePermission(contact.id, 'journeyUpdates')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: contact.permissions.journeyUpdates ? 'var(--primary-lavender-glow)' : 'var(--bg-surface)',
                    color: contact.permissions.journeyUpdates ? 'var(--primary-lavender)' : 'var(--text-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  🧭 Journey Status: {contact.permissions.journeyUpdates ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => handleTogglePermission(contact.id, 'checkInAlerts')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: contact.permissions.checkInAlerts ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-surface)',
                    color: contact.permissions.checkInAlerts ? 'var(--caution-yellow)' : 'var(--text-subtle)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  ⏰ Check-In Alerts: {contact.permissions.checkInAlerts ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Safety Relay Escalation Cascade Ladder */}
      {activeTab === 'relay' && (
        <div style={{
          padding: '24px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>
              Safety Relay Escalation Order
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              If you activate SOS or fail a critical check-in, HerBeacon escalates through your contacts sequentially until an acknowledgment is confirmed.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.map((contact, index) => (
              <div key={contact.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? 'var(--primary-purple)' : 'var(--bg-surface)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      #{index + 1}
                    </div>
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{contact.name}</h5>
                      <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
                        {index === 0 ? 'Immediate SMS & Call dispatch' : `Escalation if #${index} does not acknowledge within 3 minutes`}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => movePriority(index, -1)}
                      disabled={index === 0}
                      style={{
                        padding: '6px',
                        backgroundColor: 'var(--bg-surface)',
                        color: index === 0 ? 'var(--text-subtle)' : 'var(--text-main)',
                        borderRadius: '4px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer'
                      }}
                      title="Move up in priority"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => movePriority(index, 1)}
                      disabled={index === contacts.length - 1}
                      style={{
                        padding: '6px',
                        backgroundColor: 'var(--bg-surface)',
                        color: index === contacts.length - 1 ? 'var(--text-subtle)' : 'var(--text-main)',
                        borderRadius: '4px',
                        cursor: index === contacts.length - 1 ? 'not-allowed' : 'pointer'
                      }}
                      title="Move down in priority"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>

                {index < contacts.length - 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 0' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>↓ If no response after 3 minutes ↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
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
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '26px',
            position: 'relative'
          }} className="animate-slide-up">
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                color: 'var(--text-muted)'
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>
              Add Trusted Contact
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Add a trusted friend, family member, or guardian to your personal safety network.
            </p>

            <form onSubmit={handleAddContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Maya Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                >
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Partner">Partner</option>
                  <option value="Colleague">Colleague</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-subtle)' }}>
                  DEFAULT PERMISSIONS
                </span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={sosAlerts}
                    onChange={(e) => setSosAlerts(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <span>Receive Emergency SOS alerts</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={liveLocation}
                    onChange={(e) => setLiveLocation(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <span>Share live GPS coordinates during emergencies</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-main)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={journeyUpdates}
                    onChange={(e) => setJourneyUpdates(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <span>Notify on journey start and safe arrival</span>
                </label>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '13px',
                  backgroundColor: 'var(--primary-purple)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                Save Contact to Circle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
