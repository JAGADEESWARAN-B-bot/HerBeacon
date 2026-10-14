import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User, Phone, Check, AlertCircle } from 'lucide-react';

export function AuthModal({ isOpen, onClose, currentUser, onLogin, onRegister, onLogout }) {
  const [tab, setTab] = useState('login'); // 'login', 'register', 'forgot'
  const [email, setEmail] = useState('elena.vance@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [name, setName] = useState('Elena Vance');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (tab === 'login') {
      if (!email || !password) {
        setError('Please fill in both email and password.');
        return;
      }
      onLogin({
        id: 'usr_01',
        name: name || 'Elena Vance',
        email,
        phone: phone || '+1 (555) 234-5678'
      });
      setSuccessMsg('Successfully logged into HerBeacon!');
      setTimeout(() => onClose(), 800);
    } else if (tab === 'register') {
      if (!name || !email || !password || !phone) {
        setError('Please complete all registration fields.');
        return;
      }
      onRegister({
        id: `usr_${Date.now()}`,
        name,
        email,
        phone
      });
      setSuccessMsg('HerBeacon account created successfully!');
      setTimeout(() => onClose(), 800);
    } else if (tab === 'forgot') {
      if (!email) {
        setError('Please provide your registered email address.');
        return;
      }
      setSuccessMsg('A password reset link has been dispatched to your email.');
      setTimeout(() => setTab('login'), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(10, 4, 20, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        position: 'relative'
      }} className="animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            backgroundColor: 'transparent',
            color: 'var(--text-muted)'
          }}
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Shield size={22} color="#EDE9FE" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px 0' }}>
            {currentUser ? 'Your HerBeacon Profile' : (tab === 'login' ? 'Welcome to HerBeacon' : tab === 'register' ? 'Join HerBeacon' : 'Reset Password')}
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-subtle)', margin: 0 }}>
            {currentUser ? 'Personal safety credentials and account status' : 'Your safety, encrypted and securely guarded.'}
          </p>
        </div>

        {/* Logged in state view */}
        {currentUser ? (
          <div>
            <div style={{
              padding: '16px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"}
                  alt={currentUser.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{currentUser.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{currentUser.email}</p>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-subtle)' }}>
                Phone: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{currentUser.phone}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--emergency-red)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '14px'
              }}
            >
              Sign Out from Device
            </button>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: 'var(--bg-secondary)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setTab('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: tab === 'login' ? 'var(--primary-purple)' : 'transparent',
                  color: tab === 'login' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: tab === 'register' ? 'var(--primary-purple)' : 'transparent',
                  color: tab === 'register' ? '#FFFFFF' : 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--emergency-red)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'var(--safe-green-bg)',
                color: 'var(--safe-green)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Check size={14} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tab === 'register' && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    placeholder="Elena Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="elena.vance@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {tab === 'register' && (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)', display: 'block', marginBottom: '4px' }}>
                    Phone Number (for SMS Relay)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              )}

              {tab !== 'forgot' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-subtle)' }}>
                      Password
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => setTab('forgot')}
                        style={{ fontSize: '11px', color: 'var(--primary-purple-light)', background: 'transparent' }}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    placeholder="Enter secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                style={{
                  marginTop: '8px',
                  padding: '13px',
                  backgroundColor: 'var(--primary-purple)',
                  color: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: 'var(--shadow-glow)'
                }}
              >
                {tab === 'login' ? 'Sign In to HerBeacon' : tab === 'register' ? 'Create HerBeacon Account' : 'Send Recovery Instructions'}
              </button>
            </form>

            <div style={{
              marginTop: '16px',
              padding: '10px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              color: 'var(--text-subtle)',
              textAlign: 'center'
            }}>
              <span>🛡️ Demo Mode: Ready with pre-filled verified sample user.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
