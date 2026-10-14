import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, ShieldCheck, Check, AlertCircle, Play } from 'lucide-react';

export function VoiceCommandView({ onTriggerSos, user }) {
  const [isListening, setIsListening] = useState(false);
  const [triggerPhrase, setTriggerPhrase] = useState(user?.settings?.voiceTriggerPhrase || 'HerBeacon Help');
  const [detectedText, setDetectedText] = useState('');
  const [statusMessage, setStatusMessage] = useState('Voice command standby. Tap below to enable listening.');
  const [recognitionSupported, setRecognitionSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback
      setIsListening(true);
      setStatusMessage('Listening simulated. Say "' + triggerPhrase + '" or tap Simulate trigger.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage(`Listening actively for wake phrase: "${triggerPhrase}"...`);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
          .toLowerCase();

        setDetectedText(transcript);

        if (transcript.includes(triggerPhrase.toLowerCase()) || transcript.includes('help')) {
          setStatusMessage('Wake phrase verified! Triggering SOS workflow with confirmation...');
          recognition.stop();
          setIsListening(false);
          setTimeout(() => {
            onTriggerSos();
          }, 600);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setStatusMessage(`Microphone note: ${event.error}. You can use the instant simulation below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setStatusMessage('Microphone access unavailable. Use the instant simulation trigger.');
    }
  };

  const simulateWakeWord = () => {
    setDetectedText(triggerPhrase);
    setStatusMessage(`Wake phrase "${triggerPhrase}" detected! Opening safety workflow...`);
    setTimeout(() => {
      onTriggerSos();
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Mic size={22} color="var(--primary-purple-light)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Voice Safety Command
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Hands-free emergency activation. Configure your custom secret wake phrase to trigger assistance discreetly.
        </p>
      </div>

      {/* Main Mic Listening Card */}
      <div style={{
        padding: '32px 24px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        {/* Animated Mic Button */}
        <button
          onClick={startListening}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: isListening ? 'var(--emergency-red)' : 'var(--primary-purple)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening ? 'var(--shadow-emergency)' : 'var(--shadow-glow)',
            cursor: 'pointer'
          }}
          className={isListening ? 'beacon-sos-pulse' : ''}
        >
          {isListening ? <Mic size={44} /> : <MicOff size={44} />}
        </button>

        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: isListening ? 'var(--emergency-red)' : 'var(--primary-purple-light)', letterSpacing: '0.04em' }}>
            {isListening ? 'ACTIVE LISTENING MODE' : 'STANDBY'}
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '4px 0' }}>
            Wake Phrase: "{triggerPhrase}"
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {statusMessage}
          </p>
        </div>

        {detectedText && (
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            color: 'var(--primary-lavender)'
          }}>
            Heard: "<em>{detectedText}</em>"
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={startListening}
            style={{
              padding: '12px 20px',
              backgroundColor: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--primary-purple)',
              color: isListening ? 'var(--emergency-red)' : '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              fontSize: '14px',
              border: isListening ? '1px solid var(--emergency-red)' : 'none'
            }}
          >
            {isListening ? 'Stop Listening' : 'Enable Voice Command Listening'}
          </button>

          <button
            onClick={simulateWakeWord}
            style={{
              padding: '12px 20px',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--primary-lavender)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Play size={14} />
            <span>Simulate Voice Detection</span>
          </button>
        </div>
      </div>

      {/* Phrase Customization */}
      <div style={{
        padding: '20px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>
          Configure Custom Wake Phrase
        </h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={triggerPhrase}
            onChange={(e) => setTriggerPhrase(e.target.value)}
            placeholder="e.g. HerBeacon Help, Safety Guardian"
          />
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '8px', margin: 0 }}>
          💡 Tip: Pick a distinctive 2-3 word phrase that you can easily say aloud in an emergency without raising suspicion.
        </p>
      </div>
    </div>
  );
}
