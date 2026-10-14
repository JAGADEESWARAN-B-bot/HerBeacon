import React, { useState } from 'react';
import { CheckSquare, Square, Plus, ArrowLeft, Shield, Eye, Lock } from 'lucide-react';

export function DiscreetView({ onExit, onSilentAlert, user, currentLocation }) {
  const [notes, setNotes] = useState([
    { id: 1, text: 'Review quarterly project proposal with Sarah', done: true },
    { id: 2, text: 'Pick up organic almond milk and fresh mint', done: false },
    { id: 3, text: 'Schedule dental checkup for Thursday afternoon', done: false },
    { id: 4, text: 'Return library books before 6 PM', done: false },
  ]);
  const [newNote, setNewNote] = useState('');
  const [silentAlertTriggered, setSilentAlertTriggered] = useState(false);
  const [tapCount, setTapCount] = useState(0);

  const toggleNote = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, done: !n.done } : n));
  };

  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, { id: Date.now(), text: newNote.trim(), done: false }]);
    setNewNote('');
  };

  // Secret trigger: Double tap on the header icon triggers silent alert to trusted contacts
  const handleSecretTrigger = () => {
    setTapCount(prev => {
      const next = prev + 1;
      if (next >= 2) {
        onSilentAlert();
        setSilentAlertTriggered(true);
        setTimeout(() => setSilentAlertTriggered(false), 4000);
        return 0;
      }
      setTimeout(() => setTapCount(0), 1000);
      return next;
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#18181B',
      color: '#E4E4E7',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '24px 20px',
      maxWidth: '640px',
      margin: '0 auto'
    }}>
      {/* Camouflage Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #27272A',
        paddingBottom: '16px',
        marginBottom: '24px'
      }}>
        <div 
          onClick={handleSecretTrigger}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
          title="Daily Planner & Scratchpad"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#27272A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A1A1AA'
          }}>
            <CheckSquare size={18} />
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: 600, color: '#F4F4F5', margin: 0 }}>
              Daily Notes & Tasks
            </h1>
            <p style={{ fontSize: '11px', color: '#71717A', margin: 0 }}>
              Personal workspace • Local scratchpad
            </p>
          </div>
        </div>

        {/* Exit back to HerBeacon */}
        <button
          onClick={onExit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            backgroundColor: '#27272A',
            color: '#A1A1AA',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={14} />
          <span>Exit</span>
        </button>
      </div>

      {/* Secret Silent Alert Status Feedback (Minimal discreet pill) */}
      {silentAlertTriggered && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#22C55E1A',
          color: '#22C55E',
          borderRadius: '6px',
          fontSize: '11px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Lock size={12} />
          <span>Secure silent beacon signal dispatched with live GPS coordinates.</span>
        </div>
      )}

      {/* Add Task Input */}
      <form onSubmit={addNote} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Add a new reminder or note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{
            backgroundColor: '#27272A',
            border: '1px solid #3F3F46',
            color: '#F4F4F5',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '14px',
            flex: 1
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 14px',
            backgroundColor: '#3F3F46',
            color: '#FFFFFF',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Plus size={16} />
        </button>
      </form>

      {/* Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notes.map(note => (
          <div
            key={note.id}
            onClick={() => toggleNote(note.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              backgroundColor: '#27272A',
              borderRadius: '8px',
              cursor: 'pointer',
              border: '1px solid #3F3F46'
            }}
          >
            {note.done ? (
              <CheckSquare size={18} color="#22C55E" />
            ) : (
              <Square size={18} color="#71717A" />
            )}
            <span style={{
              fontSize: '14px',
              color: note.done ? '#71717A' : '#F4F4F5',
              textDecoration: note.done ? 'line-through' : 'none',
              flex: 1
            }}>
              {note.text}
            </span>
          </div>
        ))}
      </div>

      {/* Discreet Security Footer Hint */}
      <div style={{
        marginTop: '40px',
        padding: '16px',
        borderTop: '1px solid #27272A',
        textAlign: 'center',
        fontSize: '11px',
        color: '#52525B'
      }}>
        <span>Double-tap the top header icon anytime to trigger a silent safety beacon to your circle without screen alert.</span>
      </div>
    </div>
  );
}
