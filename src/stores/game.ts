import { defineStore, storeToRefs } from 'pinia';
import { useStorage } from '@vueuse/core';
import { computed } from 'vue';
import type {
  PlayerId,
  ZoneId,
  ZoneCalculation,
  ZonePlayerPressure,
  PressureFromOpponent,
  PlayerSummary,
  RegionDominance,
  ZonePlayerInfluenceRank
} from '@/types/game';
import { PLAYERS, ZONES, PRESETS } from '@/data/gameData';

const ALL_PLAYERS: PlayerId[] = ['usa', 'eu', 'russia', 'china'];

const createInitialTanksMap = (): Record<ZoneId, Record<PlayerId, number>> => {
  const result: any = {};
  for (const zone of ZONES) {
    result[zone.id] = { usa: 0, eu: 0, russia: 0, china: 0 };
  }
  return result;
};

// Default initial influence per region as specified by user
const createInitialInfluenceMap = (): Record<ZoneId, Record<PlayerId | 'black', number>> => {
  return {
    europe: { usa: 1, eu: 1, russia: 1, china: 0, black: 0 },
    central_asia: { usa: 0, eu: 0, russia: 1, china: 0, black: 0 },
    mena: { usa: 1, eu: 1, russia: 0, china: 0, black: 1 },
    africa: { usa: 0, eu: 1, russia: 0, china: 0, black: 0 },
    south_asia: { usa: 0, eu: 0, russia: 0, china: 1, black: 1 },
    east_asia_pacific: { usa: 1, eu: 0, russia: 0, china: 1, black: 0 },
    america: { usa: 1, eu: 0, russia: 0, china: 0, black: 0 }
  };
};

const createInitialDefenseMap = (): Record<ZoneId, Record<PlayerId, number>> => {
  const result: any = {};
  for (const zone of ZONES) {
    result[zone.id] = { usa: 0, eu: 0, russia: 0, china: 0 };
  }
  return result;
};

const createInitialZoneScoringMap = (): Record<ZoneId, boolean> => {
  return {
    europe: false,
    central_asia: false,
    mena: false,
    africa: false,
    south_asia: false,
    east_asia_pacific: false,
    america: false
  };
};

export const useGameStore = defineStore('game', () => {
  // Persisted state in localStorage via VueUse
  const tanks = useStorage<Record<ZoneId, Record<PlayerId, number>>>(
    'world-order-tanks',
    createInitialTanksMap()
  );

  const influence = useStorage<Record<ZoneId, Record<PlayerId | 'black', number>>>(
    'world-order-influence',
    createInitialInfluenceMap()
  );

  const defense = useStorage<Record<ZoneId, Record<PlayerId, number>>>(
    'world-order-defense',
    createInitialDefenseMap()
  );

  const zoneScoringActive = useStorage<Record<ZoneId, boolean>>(
    'world-order-zone-scoring-active',
    createInitialZoneScoringMap()
  );

  const militaryFocusActive = useStorage<Record<PlayerId, boolean>>(
    'world-order-military-focus',
    { usa: false, eu: false, russia: false, china: false }
  );

  const boundlessFriendshipActive = useStorage<boolean>('world-order-boundless-friendship', true);
  const newStartTreatyActive = useStorage<boolean>('world-order-new-start-treaty', true);
  const showFormulas = useStorage<boolean>('world-order-show-formulas', true);

  // Helper getters
  const getTankCount = (zoneId: ZoneId, playerId: PlayerId): number => {
    return tanks.value[zoneId]?.[playerId] ?? 0;
  };

  const getInfluenceCount = (zoneId: ZoneId, playerId: PlayerId | 'black'): number => {
    return influence.value[zoneId]?.[playerId] ?? 0;
  };

  const isZoneScoringActive = (zoneId: ZoneId): boolean => {
    return zoneScoringActive.value[zoneId] ?? false;
  };

  const isMilitaryFocusActive = (playerId: PlayerId): boolean => {
    return militaryFocusActive.value?.[playerId] ?? false;
  };

  const getDefenseCount = (zoneId: ZoneId, playerId: PlayerId): number => {
    return defense.value[zoneId]?.[playerId] ?? 0;
  };

  const getTotalForce = (zoneId: ZoneId, playerId: PlayerId): number => {
    return getTankCount(zoneId, playerId) + getInfluenceCount(zoneId, playerId);
  };

  const setTankCount = (zoneId: ZoneId, playerId: PlayerId, count: number) => {
    const val = Math.max(0, Math.floor(isNaN(count) ? 0 : count));
    if (!tanks.value[zoneId]) {
      tanks.value[zoneId] = { usa: 0, eu: 0, russia: 0, china: 0 };
    }
    tanks.value[zoneId][playerId] = val;
  };

  const setInfluenceCount = (zoneId: ZoneId, playerId: PlayerId | 'black', count: number) => {
    const val = Math.max(0, Math.floor(isNaN(count) ? 0 : count));
    if (!influence.value[zoneId]) {
      influence.value[zoneId] = createInitialInfluenceMap()[zoneId];
    }
    influence.value[zoneId][playerId] = val;
  };

  const setDefenseCount = (zoneId: ZoneId, playerId: PlayerId, count: number) => {
    const val = Math.max(0, Math.floor(isNaN(count) ? 0 : count));
    if (!defense.value[zoneId]) {
      defense.value[zoneId] = createInitialDefenseMap()[zoneId];
    }
    defense.value[zoneId][playerId] = val;
  };

  const setZoneScoringActive = (zoneId: ZoneId, active: boolean) => {
    if (!zoneScoringActive.value) {
      zoneScoringActive.value = createInitialZoneScoringMap();
    }
    zoneScoringActive.value[zoneId] = active;
  };

  const toggleZoneScoringActive = (zoneId: ZoneId) => {
    setZoneScoringActive(zoneId, !isZoneScoringActive(zoneId));
  };

  const setMilitaryFocusActive = (playerId: PlayerId, active: boolean) => {
    if (!militaryFocusActive.value) {
      militaryFocusActive.value = { usa: false, eu: false, russia: false, china: false };
    }
    militaryFocusActive.value[playerId] = active;
  };

  const toggleMilitaryFocus = (playerId: PlayerId) => {
    setMilitaryFocusActive(playerId, !isMilitaryFocusActive(playerId));
  };

  // Reset board to initial default state
  const resetBoard = () => {
    tanks.value = createInitialTanksMap();
    influence.value = createInitialInfluenceMap();
    defense.value = createInitialDefenseMap();
    zoneScoringActive.value = createInitialZoneScoringMap();
    militaryFocusActive.value = { usa: false, eu: false, russia: false, china: false };
  };

  // Load preset
  const loadPreset = (presetKey: string) => {
    if (PRESETS[presetKey]) {
      tanks.value = JSON.parse(JSON.stringify(PRESETS[presetKey].tanks));
      influence.value = createInitialInfluenceMap();
      defense.value = createInitialDefenseMap();
      zoneScoringActive.value = createInitialZoneScoringMap();
      militaryFocusActive.value = { usa: false, eu: false, russia: false, china: false };
    }
  };

  // Helper to check if two players are friendly/allies
  const areFriendly = (a: PlayerId, b: PlayerId): boolean => {
    if (a === b) return true;
    const isNato = (a === 'usa' && b === 'eu') || (a === 'eu' && b === 'usa');
    const isBoundless =
      boundlessFriendshipActive.value &&
      ((a === 'russia' && b === 'china') || (a === 'china' && b === 'russia'));
    return isNato || isBoundless;
  };

  // Computed calculations per zone
  const zoneCalculations = computed<Record<ZoneId, ZoneCalculation>>(() => {
    const res: any = {};

    for (const zone of ZONES) {
      const isScoringActive = isZoneScoringActive(zone.id);

      const playerPressures: Record<PlayerId, ZonePlayerPressure> = {
        usa: { playerId: 'usa', hasInterest: false, tanks: 0, influence: 0, totalForce: 0, threat: 0, defense: 0, totalPressure: 0, totalVpPenalty: 0, breakdown: [] },
        eu: { playerId: 'eu', hasInterest: false, tanks: 0, influence: 0, totalForce: 0, threat: 0, defense: 0, totalPressure: 0, totalVpPenalty: 0, breakdown: [] },
        russia: { playerId: 'russia', hasInterest: false, tanks: 0, influence: 0, totalForce: 0, threat: 0, defense: 0, totalPressure: 0, totalVpPenalty: 0, breakdown: [] },
        china: { playerId: 'china', hasInterest: false, tanks: 0, influence: 0, totalForce: 0, threat: 0, defense: 0, totalPressure: 0, totalVpPenalty: 0, breakdown: [] }
      };

      const blackInf = getInfluenceCount(zone.id, 'black');

      // Fill basic info & Threat / Defense calculations
      for (const pid of ALL_PLAYERS) {
        const t = getTankCount(zone.id, pid);
        const inf = getInfluenceCount(zone.id, pid);
        const hasInterest = zone.interestedPlayers.includes(pid);
        const hasMF = isMilitaryFocusActive(pid);

        // Attacker Threat = 0 if 0 tanks, otherwise Tanks + (Military Focus ? 1 : 0)
        const threat = t >= 1 ? t + (hasMF ? 1 : 0) : 0;

        // Defender Total Defense = Tanks + Defense Input + (Military Focus ? 1 : 0) (for ZOI player)
        const totalDefense = hasInterest
          ? t + getDefenseCount(zone.id, pid) + (hasMF ? 1 : 0)
          : 0;

        playerPressures[pid].hasInterest = hasInterest;
        playerPressures[pid].tanks = t;
        playerPressures[pid].influence = inf;
        playerPressures[pid].totalForce = t + inf;
        playerPressures[pid].threat = threat;
        playerPressures[pid].defense = totalDefense;
      }

      // Calculate pressure for players who have Zone of Interest in this zone
      for (const pid of zone.interestedPlayers) {
        const playerTanks = playerPressures[pid].tanks;
        const playerThreat = playerPressures[pid].threat;
        const playerDefense = playerPressures[pid].defense;

        let totalPressure = 0;
        let totalVpPenalty = 0;
        const breakdown: PressureFromOpponent[] = [];

        // Opposing Players (USA, EU, Russia, China)
        for (const oppId of ALL_PLAYERS) {
          if (oppId === pid) continue;

          const oppTanks = playerPressures[oppId].tanks;
          const oppThreat = playerPressures[oppId].threat;

          // NATO check (USA & EU)
          const isNato = (pid === 'usa' && oppId === 'eu') || (pid === 'eu' && oppId === 'usa');

          // Russia-China Boundless Friendship check
          const isBoundless =
            boundlessFriendshipActive.value &&
            ((pid === 'russia' && oppId === 'china') || (pid === 'china' && oppId === 'russia'));

          // New START Treaty check (USA & Russia)
          const isNewStart =
            newStartTreatyActive.value &&
            ((pid === 'usa' && oppId === 'russia') || (pid === 'russia' && oppId === 'usa'));

          const vpMultiplier = isNewStart ? 1 : 2;

          let diff = 0;
          let pressure = 0;
          let vpPenalty = 0;

          // THREAT Resolution:
          // Lose VPs for every opponent who has more THREAT than player has Defense (oppThreat > playerDefense)
          if (!isNato && !isBoundless && oppThreat > playerDefense) {
            diff = oppThreat - playerDefense;
            pressure = -diff;
            vpPenalty = pressure * vpMultiplier;
          }

          if (oppTanks > 0 || oppThreat > 0 || isNato || isBoundless) {
            breakdown.push({
              opponentId: oppId,
              opponentTanks: oppTanks,
              opponentThreat: oppThreat,
              playerTanks,
              playerThreat,
              playerDefense,
              difference: diff,
              isNatoExempt: isNato,
              isBoundlessExempt: isBoundless,
              isNewStartTreaty: isNewStart,
              vpMultiplier,
              pressure,
              vpPenalty
            });
          }

          totalPressure += pressure;
          totalVpPenalty += vpPenalty;
        }

        playerPressures[pid].totalPressure = totalPressure;
        playerPressures[pid].totalVpPenalty = totalVpPenalty;
        playerPressures[pid].breakdown = breakdown;
      }

      // Calculate Region Dominance / Lead strictly by TANKS
      let maxTanks = 0;
      for (const pid of ALL_PLAYERS) {
        const t = getTankCount(zone.id, pid);
        if (t > maxTanks) {
          maxTanks = t;
        }
      }

      let leaders: PlayerId[] = [];
      if (maxTanks > 0) {
        leaders = ALL_PLAYERS.filter((pid) => getTankCount(zone.id, pid) === maxTanks);
      }

      const isTie = leaders.length > 1;
      let isFriendlyTie = false;

      if (isTie) {
        isFriendlyTie = true;
        for (let i = 0; i < leaders.length; i++) {
          for (let j = i + 1; j < leaders.length; j++) {
            if (!areFriendly(leaders[i], leaders[j])) {
              isFriendlyTie = false;
              break;
            }
          }
          if (!isFriendlyTie) break;
        }
      }

      let statusText = 'Uncontrolled';
      if (maxTanks > 0) {
        if (!isTie) {
          statusText = PLAYERS[leaders[0]].shortName;
        } else {
          statusText = leaders.map((l) => PLAYERS[l].shortName).join(' & ');
        }
      }

      const dominance: RegionDominance = {
        leaders,
        maxForce: maxTanks,
        isTie,
        isFriendlyTie,
        statusText
      };

      // Calculate Influence VP Rankings for this zone
      const playerInfluenceVp: Record<PlayerId, number> = { usa: 0, eu: 0, russia: 0, china: 0 };
      const influenceRanks: ZonePlayerInfluenceRank[] = [];

      if (isScoringActive) {
        interface RankedEntity {
          id: PlayerId | 'black';
          influence: number;
          tanks: number;
        }

        const allEntities: RankedEntity[] = ALL_PLAYERS.map((pid) => ({
          id: pid,
          influence: getInfluenceCount(zone.id, pid),
          tanks: getTankCount(zone.id, pid)
        }));

        if (blackInf > 0) {
          allEntities.push({ id: 'black', influence: blackInf, tanks: 0 });
        }

        // RULE: Only entities with MINIMUM 1 INFLUENCE qualify for VP bonus
        const qualifying = allEntities.filter((e) => e.influence >= 1);

        // Sort qualifying entities primarily by Influence desc, secondarily by Tanks desc
        qualifying.sort((a, b) => {
          if (b.influence !== a.influence) {
            return b.influence - a.influence;
          }
          return b.tanks - a.tanks;
        });

        // Group tied qualifying entities
        const groups: RankedEntity[][] = [];
        let currentGroup: RankedEntity[] = [];

        for (let i = 0; i < qualifying.length; i++) {
          if (currentGroup.length === 0) {
            currentGroup.push(qualifying[i]);
          } else {
            const prev = currentGroup[0];
            const curr = qualifying[i];
            if (curr.influence === prev.influence && curr.tanks === prev.tanks) {
              currentGroup.push(curr);
            } else {
              groups.push(currentGroup);
              currentGroup = [curr];
            }
          }
        }
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
        }

        // Allocate VP
        const table = zone.influenceVpTable;
        let currentRankPos = 1;

        for (const group of groups) {
          const k = group.length;
          const bonusRank = currentRankPos + k - 1;
          const tableVp = (bonusRank >= 1 && bonusRank <= table.length) ? table[bonusRank - 1] : 0;

          for (const ent of group) {
            if (ent.id !== 'black') {
              playerInfluenceVp[ent.id as PlayerId] = tableVp;
              influenceRanks.push({
                playerId: ent.id as PlayerId,
                rank: currentRankPos,
                bonusRank,
                influence: ent.influence,
                tanks: ent.tanks,
                isTie: k > 1,
                vpEarned: tableVp
              });
            }
          }

          currentRankPos += k;
        }

        // Add 0-influence players to ranks list with 0 VP
        for (const pid of ALL_PLAYERS) {
          if (getInfluenceCount(zone.id, pid) === 0) {
            influenceRanks.push({
              playerId: pid,
              rank: 0,
              bonusRank: 0,
              influence: 0,
              tanks: getTankCount(zone.id, pid),
              isTie: false,
              vpEarned: 0
            });
          }
        }
      } else {
        // Scoring is OFF for this zone
        for (const pid of ALL_PLAYERS) {
          playerInfluenceVp[pid] = 0;
          influenceRanks.push({
            playerId: pid,
            rank: 0,
            bonusRank: 0,
            influence: getInfluenceCount(zone.id, pid),
            tanks: getTankCount(zone.id, pid),
            isTie: false,
            vpEarned: 0
          });
        }
      }

      res[zone.id] = {
        zone,
        playerPressures,
        blackInfluence: blackInf,
        dominance,
        influenceRanks,
        playerInfluenceVp,
        isScoringActive
      };
    }

    return res;
  });

  // Computed summary for all 4 players
  const playerSummaries = computed<Record<PlayerId, PlayerSummary>>(() => {
    const res: any = {};

    for (const pid of ALL_PLAYERS) {
      let totalTanks = 0;
      let totalInfluence = 0;
      let totalForce = 0;
      let totalPressure = 0;
      let totalVpPenalty = 0;
      let totalInfluenceVp = 0;
      let zonesOfInterestsCount = 0;
      let pressuredZonesCount = 0;

      for (const zone of ZONES) {
        const pTanks = getTankCount(zone.id, pid);
        const pInf = getInfluenceCount(zone.id, pid);
        totalTanks += pTanks;
        totalInfluence += pInf;
        totalForce += pTanks + pInf;

        const calc = zoneCalculations.value[zone.id];
        if (calc) {
          if (calc.isScoringActive) {
            // Scoring Phase Total = Majority Bonus VP + 1 VP per Influence in scoring-active zones
            totalInfluenceVp += (calc.playerInfluenceVp[pid] ?? 0) + pInf;
          }
          if (zone.interestedPlayers.includes(pid)) {
            zonesOfInterestsCount++;
            const pCalc = calc.playerPressures[pid];
            if (pCalc) {
              totalPressure += pCalc.totalPressure;
              totalVpPenalty += pCalc.totalVpPenalty;
              if (pCalc.totalPressure < 0) {
                pressuredZonesCount++;
              }
            }
          }
        }
      }

      const netVp = totalInfluenceVp + totalVpPenalty;

      res[pid] = {
        player: PLAYERS[pid],
        totalTanks,
        totalInfluence,
        totalForce,
        totalPressure,
        totalVpPenalty,
        totalInfluenceVp,
        netVp,
        zonesOfInterestsCount,
        pressuredZonesCount
      };
    }

    return res;
  });

  return {
    tanks,
    influence,
    defense,
    zoneScoringActive,
    militaryFocusActive,
    boundlessFriendshipActive,
    newStartTreatyActive,
    showFormulas,
    getTankCount,
    getInfluenceCount,
    getDefenseCount,
    setDefenseCount,
    isZoneScoringActive,
    setZoneScoringActive,
    toggleZoneScoringActive,
    isMilitaryFocusActive,
    setMilitaryFocusActive,
    toggleMilitaryFocus,
    getTotalForce,
    setTankCount,
    setInfluenceCount,
    resetBoard,
    loadPreset,
    zoneCalculations,
    playerSummaries
  };
});

export function getGameStore() {
  const store = useGameStore();
  return {
    store,
    ...storeToRefs(store)
  };
}
