export type PlayerId = 'usa' | 'eu' | 'russia' | 'china';

export type ZoneId =
  | 'europe'
  | 'central_asia'
  | 'mena'
  | 'africa'
  | 'south_asia'
  | 'east_asia_pacific'
  | 'america';

export interface PlayerConfig {
  id: PlayerId;
  name: string;
  shortName: string;
  flag: string;
  color: string;
  bgGradient: string;
  accentColor: string;
  borderColor: string;
  description: string;
  tankImage: string;
}

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  code: string;
  description: string;
  interestedPlayers: PlayerId[];
  color: string;
  borderColor: string;
  bgGradient: string;
  influenceVpTable: number[]; // e.g. [9, 6, 3, 1]
}

export interface RegionDominance {
  leaders: PlayerId[];
  maxForce: number; // max tank count
  isTie: boolean;
  isFriendlyTie: boolean;
  statusText: string;
}

export interface PressureFromOpponent {
  opponentId: PlayerId;
  opponentTanks: number;
  opponentThreat: number;
  playerTanks: number;
  playerThreat: number;
  playerDefense: number;
  difference: number;
  isNatoExempt: boolean;
  isBoundlessExempt: boolean;
  isNewStartTreaty: boolean;
  vpMultiplier: number; // 1 or 2
  pressure: number; // Negative integer or 0
  vpPenalty: number; // Negative integer or 0
}

export interface ZonePlayerPressure {
  playerId: PlayerId;
  hasInterest: boolean;
  tanks: number;
  influence: number;
  totalForce: number; // tanks + influence
  threat: number;
  defense: number;
  totalPressure: number; // Negative integer or 0
  totalVpPenalty: number; // Negative integer or 0
  breakdown: PressureFromOpponent[];
}

export interface ZonePlayerInfluenceRank {
  playerId: PlayerId;
  rank: number; // 1-indexed primary rank position
  bonusRank: number; // effective rank after tie lower bonus allocation
  influence: number;
  tanks: number;
  isTie: boolean;
  vpEarned: number;
}

export interface ZoneCalculation {
  zone: ZoneConfig;
  playerPressures: Record<PlayerId, ZonePlayerPressure>;
  blackInfluence: number;
  dominance: RegionDominance;
  influenceRanks: ZonePlayerInfluenceRank[];
  playerInfluenceVp: Record<PlayerId, number>;
  isScoringActive: boolean;
}

export interface PlayerSummary {
  player: PlayerConfig;
  totalTanks: number;
  totalInfluence: number;
  totalForce: number;
  totalPressure: number;
  totalVpPenalty: number;
  totalInfluenceVp: number;
  netVp: number;
  zonesOfInterestsCount: number;
  pressuredZonesCount: number;
}
