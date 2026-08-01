import type { PlayerConfig, ZoneConfig, PlayerId, ZoneId } from '@/types/game';

export const PLAYERS: Record<PlayerId, PlayerConfig> = {
  usa: {
    id: 'usa',
    name: 'United States of America',
    shortName: 'USA',
    flag: '',
    color: '#60a5fa',
    bgGradient: '#1d4ed8',
    accentColor: '#93c5fd',
    borderColor: '#3b82f6',
    description: 'NATO Leader. Broad global interest in West, Pacific & Middle East.',
    tankImage: '/images/tank-us.png'
  },
  eu: {
    id: 'eu',
    name: 'European Union',
    shortName: 'EU',
    flag: '',
    color: '#facc15',
    bgGradient: '#ca8a04',
    accentColor: '#fef08a',
    borderColor: '#eab308',
    description: 'NATO Partner. Key interests in Europe, MENA & Africa.',
    tankImage: '/images/tank-eu.png'
  },
  russia: {
    id: 'russia',
    name: 'Russian Federation',
    shortName: 'Russia',
    flag: '',
    color: '#e2e8f0',
    bgGradient: '#475569',
    accentColor: '#f8fafc',
    borderColor: '#94a3b8',
    description: 'Eurasian Power. Primary focus in Europe, Central Asia & MENA.',
    tankImage: '/images/tank-ru.png'
  },
  china: {
    id: 'china',
    name: 'People\'s Republic of China',
    shortName: 'China',
    flag: '',
    color: '#f87171',
    bgGradient: '#b91c1c',
    accentColor: '#fca5a5',
    borderColor: '#ef4444',
    description: 'Asian Hegemon. Strategic interest in East Asia, South & Central Asia.',
    tankImage: '/images/tank-cn.png'
  }
};

export const ZONES: ZoneConfig[] = [
  {
    id: 'europe',
    name: 'Europe',
    code: 'EUR',
    description: 'Highly contested theater between NATO and Russia.',
    interestedPlayers: ['usa', 'eu', 'russia'],
    color: '#2dd4bf',
    borderColor: '#25909a',
    bgGradient: '#1e6f77',
    influenceVpTable: [9, 6, 3, 1]
  },
  {
    id: 'mena',
    name: 'Middle East North Africa',
    code: 'MENA',
    description: 'Critical energy and maritime zone contested by USA, EU, and Russia.',
    interestedPlayers: ['usa', 'eu', 'russia'],
    color: '#bef264',
    borderColor: '#71781b',
    bgGradient: '#8c9327',
    influenceVpTable: [10, 7, 4, 2]
  },
  {
    id: 'africa',
    name: 'Africa',
    code: 'AFR',
    description: 'Exclusive Zone of Interest for European Union economic ties.',
    interestedPlayers: ['eu'],
    color: '#fcd34d',
    borderColor: '#a16f3d',
    bgGradient: '#ca945d',
    influenceVpTable: [7, 4, 2, 0]
  },
  {
    id: 'central_asia',
    name: 'Central Asia',
    code: 'CAS',
    description: 'Shared strategic sphere of influence between Russia and China.',
    interestedPlayers: ['russia', 'china'],
    color: '#fef08a',
    borderColor: '#a35c00',
    bgGradient: '#d98000',
    influenceVpTable: [8, 4, 2, 0]
  },
  {
    id: 'south_asia',
    name: 'South Asia',
    code: 'SAS',
    description: 'Exclusive Zone of Interest for China regional projection.',
    interestedPlayers: ['china'],
    color: '#f0abfc',
    borderColor: '#6b145d',
    bgGradient: '#932281',
    influenceVpTable: [8, 5, 2, 0]
  },
  {
    id: 'east_asia_pacific',
    name: 'East Asia Pacific',
    code: 'EAP',
    description: 'Major Indo-Pacific naval and economic arena contested by USA and China.',
    interestedPlayers: ['usa', 'china'],
    color: '#7dd3fc',
    borderColor: '#0284c7',
    bgGradient: '#00a2e2',
    influenceVpTable: [9, 6, 2, 0]
  },
  {
    id: 'america',
    name: 'Americas',
    code: 'AME',
    description: 'Homeland Zone of Interest for United States hemisphere control.',
    interestedPlayers: ['usa'],
    color: '#fdba74',
    borderColor: '#9a3a19',
    bgGradient: '#c4552b',
    influenceVpTable: [7, 4, 2, 0]
  }
];

export const PRESETS: Record<string, { label: string; tanks: Record<ZoneId, Record<PlayerId, number>> }> = {
  default: {
    label: 'Clear Board',
    tanks: {
      europe: { usa: 0, eu: 0, russia: 0, china: 0 },
      central_asia: { usa: 0, eu: 0, russia: 0, china: 0 },
      mena: { usa: 0, eu: 0, russia: 0, china: 0 },
      africa: { usa: 0, eu: 0, russia: 0, china: 0 },
      south_asia: { usa: 0, eu: 0, russia: 0, china: 0 },
      east_asia_pacific: { usa: 0, eu: 0, russia: 0, china: 0 },
      america: { usa: 0, eu: 0, russia: 0, china: 0 }
    }
  }
};
