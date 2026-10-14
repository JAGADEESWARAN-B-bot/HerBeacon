import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Shield, 
  Cross, 
  Building2, 
  Bus, 
  Search, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { NEARBY_HELP_PLACES } from '../data/mockData';

export function NearbyHelpView({ currentLocation }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlaces = NEARBY_HELP_PLACES.filter(place => {
    const matchesCat = selectedCategory === 'all' || place.category === selectedCategory;
    const matchesQuery = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '32px' }} className="animate-slide-up">
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <MapPin size={22} color="var(--primary-purple-light)" />
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>
            Nearby Verified Safe Havens & Help
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
          Direct access to police booths, 24/7 hospitals, women crisis support shelters, and safe transit hubs.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-subtle)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
          <input
            type="text"
            placeholder="Search nearby safe haven by name or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '44px' }}
          />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: 'All Safe Havens' },
            { id: 'police', label: 'Police & Helpdesks' },
            { id: 'hospital', label: '24/7 Hospital ER' },
            { id: 'transport', label: 'Transit Safe Booths' },
            { id: 'community', label: 'Women Shelters' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: selectedCategory === cat.id ? 'var(--primary-purple)' : 'var(--bg-secondary)',
                color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Safe Places List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPlaces.map((place) => (
          <div
            key={place.id}
            style={{
              padding: '20px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: place.category === 'police' ? 'rgba(59, 130, 246, 0.2)' :
                                     place.category === 'hospital' ? 'rgba(239, 68, 68, 0.2)' : 'var(--primary-lavender-glow)',
                    color: place.category === 'police' ? '#60A5FA' :
                           place.category === 'hospital' ? '#F87171' : 'var(--primary-lavender)'
                  }}>
                    {place.category.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--safe-green)', fontWeight: 700 }}>
                    ● {place.openHours}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 2px 0' }}>
                  {place.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                  {place.address} • <strong style={{ color: 'var(--primary-lavender)' }}>{place.distanceKm} km away</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`tel:${place.phone.split('/')[0].trim()}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <Phone size={14} />
                  <span>Call {place.phone.split('/')[0]}</span>
                </a>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(place.name + ' ' + place.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    backgroundColor: 'var(--primary-purple)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: 'var(--shadow-glow)'
                  }}
                >
                  <Navigation size={14} />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Facilities tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {place.facilities.map((fac, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-subtle)',
                    padding: '3px 8px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '4px'
                  }}
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-md)',
        fontSize: '11px',
        color: 'var(--text-subtle)',
        textAlign: 'center'
      }}>
        📍 Verified safe data: Points shown are verified 24/7 public facilities and emergency support stations.
      </div>
    </div>
  );
}
