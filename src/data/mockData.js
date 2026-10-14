// HerBeacon Data Store & Schema Definitions
// Schema compliant: Users, TrustedContacts, Journeys, CheckIns, SafetyAlerts, Incidents, Locations, RiskAssessments

export const DEFAULT_USER = {
  id: "usr_01",
  name: "Elena Vance",
  phone: "+1 (555) 234-5678",
  email: "elena.vance@example.com",
  bloodType: "O+",
  emergencyNotes: "Asthma inhaler in outer bag pocket. Verified emergency contacts only.",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
  homeAddress: "742 Evergreen Terrace, Westside",
  workAddress: "Innovation Tech Hub, Metro Tower 3",
  settings: {
    sosCountdownSeconds: 5,
    autoCallEmergencyServices: true,
    sirenSoundEnabled: true,
    hapticFeedback: true,
    voiceTriggerPhrase: "HerBeacon Help",
    voiceTriggerEnabled: true,
    discreetModeSecretCode: "1234",
    powerSavingThreshold: 20,
    theme: "dark", // dark or light
    language: "en"
  }
};

export const INITIAL_CONTACTS = [
  {
    id: "ct_01",
    name: "Maya Vance",
    relationship: "Mother",
    phone: "+1 (555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    relayOrder: 1,
    permissions: {
      sosAlerts: true,
      liveLocation: true,
      journeyUpdates: true,
      checkInAlerts: true
    },
    status: "Active • Ready"
  },
  {
    id: "ct_02",
    name: "Liam Vance",
    relationship: "Brother",
    phone: "+1 (555) 876-5432",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    relayOrder: 2,
    permissions: {
      sosAlerts: true,
      liveLocation: true,
      journeyUpdates: false,
      checkInAlerts: true
    },
    status: "Active • Ready"
  },
  {
    id: "ct_03",
    name: "Chloe Bennett",
    relationship: "Best Friend",
    phone: "+1 (555) 765-4321",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80",
    relayOrder: 3,
    permissions: {
      sosAlerts: true,
      liveLocation: true,
      journeyUpdates: true,
      checkInAlerts: false
    },
    status: "Active • Ready"
  },
  {
    id: "ct_04",
    name: "Marcus Reed",
    relationship: "Guardian / Colleague",
    phone: "+1 (555) 654-3210",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
    relayOrder: 4,
    permissions: {
      sosAlerts: true,
      liveLocation: false,
      journeyUpdates: false,
      checkInAlerts: false
    },
    status: "Backup Escalation"
  }
];

export const INITIAL_JOURNEYS = [
  {
    id: "jrn_01",
    origin: "Metro Innovation Campus, Bldg 4",
    destination: "Westside Greenway Apartment",
    expectedDurationMinutes: 25,
    startedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: "in_progress", // 'in_progress', 'completed', 'delayed', 'alert'
    checkInIntervalMinutes: 15,
    lastCheckInAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    trustedContactId: "ct_01",
    routeType: "Main Well-Lit Transit Corridor",
    safetyScore: 89,
    notes: "Heading home by transit bus line 42"
  },
  {
    id: "jrn_02",
    origin: "City Central Library",
    destination: "Downtown Cafe",
    expectedDurationMinutes: 18,
    startedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    status: "completed",
    checkInIntervalMinutes: 20,
    trustedContactId: "ct_03",
    routeType: "Pedestrian Shopping Promenade",
    safetyScore: 94,
    notes: "Afternoon walk with colleagues"
  }
];

export const NEARBY_HELP_PLACES = [
  {
    id: "help_01",
    category: "police",
    name: "Central District Women's Safety Helpdesk & Police Station",
    address: "410 Civic Center Blvd",
    distanceKm: 0.6,
    openHours: "Open 24/7",
    phone: "100 / 911",
    verified: true,
    facilities: ["Dedicated Women Helpdesk", "24/7 Patrol Unit", "CCTV Monitored Zone"]
  },
  {
    id: "help_02",
    category: "hospital",
    name: "St. Jude Memorial Hospital (Emergency Trauma Center)",
    address: "880 Health Science Pkwy",
    distanceKm: 1.2,
    openHours: "Open 24/7",
    phone: "102 / 911",
    verified: true,
    facilities: ["24-Hour Emergency Room", "Ambulance Station", "Security Guarded Entrance"]
  },
  {
    id: "help_03",
    category: "transport",
    name: "Grand Central Metro Interchange Safe Haven Booth",
    address: "Concourse Level 2, Gate C",
    distanceKm: 0.8,
    openHours: "Open 24/7",
    phone: "+1 (555) 900-3456",
    verified: true,
    facilities: ["Transit Marshals", "Emergency Call Box", "Well-Lit Waiting Lounge"]
  },
  {
    id: "help_04",
    category: "community",
    name: "CarePlus Women's Crisis & Community Support Shelter",
    address: "124 Rosewood Avenue",
    distanceKm: 1.7,
    openHours: "Open 24/7",
    phone: "1-800-799-7233",
    verified: true,
    facilities: ["Trained Counselors", "Safe Transit Escort", "Emergency Shelter"]
  },
  {
    id: "help_05",
    category: "police",
    name: "North Transit Police Outpost",
    address: "West Greenway Junction",
    distanceKm: 2.1,
    openHours: "Open 24/7",
    phone: "100 / 911",
    verified: true,
    facilities: ["Highway Patrol", "First Aid Unit", "Rapid Response Vehicles"]
  }
];

export const INITIAL_TIMELINE = [
  {
    id: "inc_01",
    type: "journey",
    title: "Safe Journey Started",
    description: "Started journey: Metro Innovation Campus to Westside Greenway.",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: "active"
  },
  {
    id: "inc_02",
    type: "checkin",
    title: "Smart Check-In Confirmed",
    description: "User confirmed 'I am Safe' at Transit Stop 4.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: "safe"
  },
  {
    id: "inc_03",
    type: "discreet",
    title: "Discreet Mode Activated",
    description: "Stealth camouflage mode was tested successfully.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: "info"
  },
  {
    id: "inc_04",
    type: "journey",
    title: "Journey Completed Safely",
    description: "Arrived at Downtown Cafe safely. Trusted circle notified.",
    timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    status: "safe"
  }
];

// Offline Safety Handbook Guide
export const OFFLINE_SAFETY_GUIDE = [
  {
    title: "1. Trust Your Instincts & Establish Distance",
    summary: "If a person or situation feels wrong, do not rationalize it. Immediately change direction toward well-lit public businesses, open shops, or populated transit corridors."
  },
  {
    title: "2. Verbal Deterrence & Audible Alert",
    summary: "Speak firmly and loudly: 'STEP BACK'. Use the HerBeacon alarm or physical whistle. Draw attention from bystanders; perpetrators rely on silence and privacy."
  },
  {
    title: "3. Direct Emergency Hotlines (Works Offline)",
    summary: "Dial 112 (Universal Emergency) or 911. Most mobile phones connect to any available cellular carrier tower for emergency calls even without SIM credit or mobile data."
  },
  {
    title: "4. Physical Stance & Key Defensive Points",
    summary: "Keep your hands free and at chest height. If forced to defend yourself, target vulnerable points: eyes, nose, throat, or groin, then sprint toward illuminated public areas."
  },
  {
    title: "5. Safe Haven Identification",
    summary: "Locate 24-hour pharmacies, petrol stations, hotel lobbies, and hospital emergency entrances where security personnel and cameras are guaranteed."
  }
];
