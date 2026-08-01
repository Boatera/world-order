<script setup lang="ts">
import { computed } from 'vue';
import type { ZoneCalculation, PlayerId } from '@/types/game';
import { PLAYERS } from '@/data/gameData';
import { useGameStore } from '@/stores/game';
import NumberInput from './NumberInput.vue';
import TankIcon from './TankIcon.vue';
import InfluenceIcon from './InfluenceIcon.vue';
import DefenseIcon from './DefenseIcon.vue';
import ThreatIcon from './ThreatIcon.vue';

const props = defineProps<{
  calculation: ZoneCalculation;
}>();

const gameStore = useGameStore();

const ALL_PLAYERS: PlayerId[] = ['usa', 'eu', 'russia', 'china'];

const zone = computed(() => props.calculation.zone);

const isExpanded = computed(() => gameStore.isZoneExpanded(zone.value.id));

function toggleExpanded() {
  gameStore.toggleZoneExpanded(zone.value.id);
}

function isInterested(pid: PlayerId): boolean {
  return zone.value.interestedPlayers.includes(pid);
}

function getPlayerPressure(pid: PlayerId) {
  return props.calculation.playerPressures[pid];
}
</script>

<template>
  <div
    class="card zone-card"
    :class="{ collapsed: !isExpanded }"
    :style="{
      borderColor: zone.borderColor,
      background: zone.bgGradient
    }"
  >
    <div class="zone-header" @click="toggleExpanded" style="cursor: pointer;">
      <div class="zone-title">
        <h3>{{ zone.name }}</h3>
      </div>
      <div class="header-right-tags" @click.stop>
        <div class="vp-rewards-row">
          <button
            type="button"
            class="vp-range-pill-btn"
            :class="{ disabled: !gameStore.isZoneScoringActive(zone.id) }"
            :title="gameStore.isZoneScoringActive(zone.id) ? 'Scoring Phase ON - Click to turn OFF' : 'Scoring Phase OFF - Click to turn ON'"
            @click="gameStore.toggleZoneScoringActive(zone.id)"
          >
            {{ zone.influenceVpTable.join(' / ') }}
          </button>

          <button
            type="button"
            class="accordion-toggle-btn"
            :class="{ expanded: isExpanded }"
            @click="toggleExpanded"
            :title="isExpanded ? 'Collapse Zone Details' : 'Expand Zone Details'"
          >
            <span class="chevron" :class="{ rotated: isExpanded }">▼</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Minimalist Summary Grid (Visible when Collapsed) -->
    <div v-if="!isExpanded" class="minimalist-summary-grid">
      <div
        v-for="pid in ALL_PLAYERS"
        :key="'min-sum-' + pid"
        class="min-summary-card"
        :style="{
          background: PLAYERS[pid].bgGradient,
          borderColor: PLAYERS[pid].borderColor
        }"
      >
        <div class="min-header">
          <span class="min-player-name" style="color: #ffffff;">
            {{ PLAYERS[pid].shortName }}
          </span>
          <span v-if="(calculation.playerInfluenceVp[pid] ?? 0) > 0" class="min-vp-badge">
            +{{ calculation.playerInfluenceVp[pid] }} VP
          </span>
        </div>
        <div class="min-stats-row">
          <!-- 1. Influence -->
          <div class="stat-pill inf-pill" title="Influence in this zone">
            <InfluenceIcon :color="PLAYERS[pid].color" :size="13" />
            <span class="stat-val">{{ gameStore.getInfluenceCount(zone.id, pid) }}</span>
          </div>

          <!-- 2. Tank -->
          <div class="stat-pill tank-pill" title="Tanks in this zone">
            <TankIcon :player-id="pid" :color="PLAYERS[pid].color" :width="16" :height="10" />
            <span class="stat-val">{{ gameStore.getTankCount(zone.id, pid) }}</span>
          </div>

          <!-- 3. Threat -->
          <div class="stat-pill thr-pill" title="Total Threat (Tanks + Military Focus / Nuclear)">
            <ThreatIcon :size="13" />
            <span class="stat-val">{{ getPlayerPressure(pid).threat }}</span>
          </div>

          <!-- 4. Defense -->
          <div v-if="isInterested(pid)" class="stat-pill def-pill" title="Total Defense (Defense + Military Focus / Nuclear)">
            <DefenseIcon :size="13" />
            <span class="stat-val">{{ getPlayerPressure(pid).defense }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Controls & Formulas (Visible when Expanded) -->
    <div v-if="isExpanded" class="zone-details-container">
      <!-- Influence Table -->
      <div class="influence-table-section">
        <div class="table-title-row">
          <div class="table-title">Influence</div>
          <div class="neutral-counter-inline" title="Neutral Influence in this zone">
            <span class="neutral-label">Neutral</span>
            <NumberInput
              :model-value="gameStore.getInfluenceCount(zone.id, 'black')"
              @update:model-value="(val) => gameStore.setInfluenceCount(zone.id, 'black', val)"
              color="#94a3b8"
            />
          </div>
        </div>

        <div class="influence-columns-grid">
          <!-- USA, EU, Russia, China -->
          <div
            v-for="pid in ALL_PLAYERS"
            :key="'inf-col-' + pid"
            class="influence-col-item"
            :style="{
              background: PLAYERS[pid].bgGradient,
              borderColor: PLAYERS[pid].borderColor
            }"
          >
            <div class="col-header-name" style="color: #ffffff;">
              {{ PLAYERS[pid].shortName }}
            </div>
            <div class="col-input-cell">
              <NumberInput
                :model-value="gameStore.getInfluenceCount(zone.id, pid)"
                @update:model-value="(val) => gameStore.setInfluenceCount(zone.id, pid, val)"
                :color="PLAYERS[pid].color"
              />
            </div>
            <div class="col-result-cell">
              <span
                class="inf-vp-pill"
                :class="{
                  'has-vp': (calculation.playerInfluenceVp[pid] ?? 0) > 0,
                  'safe': (calculation.playerInfluenceVp[pid] ?? 0) === 0
                }"
              >
                {{ (calculation.playerInfluenceVp[pid] ?? 0) > 0 ? '+' + calculation.playerInfluenceVp[pid] : '0' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Threat & Defense Table -->
      <div class="threat-table-section">
        <div class="table-title">Threat & Defense</div>
        <div class="threat-grid-container">
          <!-- Header Row -->
          <div class="threat-header-row">
            <span class="col-title">Faction</span>
            <span class="col-title center">Tank</span>
            <span class="col-title center">Defense</span>
            <span class="col-title center desktop-only">Threat Total</span>
            <span class="col-title center mobile-only">Thr</span>
            <span class="col-title center desktop-only">Defense Total</span>
            <span class="col-title center mobile-only">Def</span>
            <span class="col-title center desktop-only">Penalty</span>
            <span class="col-title center mobile-only">Pen</span>
          </div>

          <!-- Player Rows -->
          <div
            v-for="pid in ALL_PLAYERS"
            :key="'threat-row-' + pid"
            class="threat-player-row"
            :class="{
              'has-interest': isInterested(pid),
              'no-interest': !isInterested(pid)
            }"
            :style="{
              background: PLAYERS[pid].bgGradient,
              borderColor: PLAYERS[pid].borderColor
            }"
          >
            <div class="player-info-cell">
              <span class="name" style="color: #ffffff;">{{ PLAYERS[pid].shortName }}</span>
            </div>

            <!-- Tank Input -->
            <div class="controls-cell tank-cell">
              <NumberInput
                :model-value="gameStore.getTankCount(zone.id, pid)"
                @update:model-value="(val) => gameStore.setTankCount(zone.id, pid, val)"
                :color="PLAYERS[pid].color"
              />
            </div>

            <!-- Defense Input -->
            <div class="controls-cell defense-cell">
              <template v-if="isInterested(pid)">
                <NumberInput
                  :model-value="gameStore.getDefenseCount(zone.id, pid)"
                  :min="0"
                  @update:model-value="(val) => gameStore.setDefenseCount(zone.id, pid, val)"
                  :color="PLAYERS[pid].color"
                />
              </template>
              <template v-else>
                <span class="no-zoi-dash">—</span>
              </template>
            </div>

            <!-- Threat Total -->
            <div class="badge-cell threat-total-cell">
              <span class="calc-badge">
                {{ getPlayerPressure(pid).threat }}
              </span>
            </div>

            <!-- Defense Total -->
            <div class="badge-cell defense-total-cell">
              <template v-if="isInterested(pid)">
                <span class="calc-badge">
                  {{ getPlayerPressure(pid).defense }}
                </span>
              </template>
              <template v-else>
                <span class="no-zoi-dash">—</span>
              </template>
            </div>

            <!-- Penalty -->
            <div class="pressure-cell penalty-cell">
              <template v-if="isInterested(pid)">
                <span
                  class="pressure-pill"
                  :class="{
                    penalized: getPlayerPressure(pid).totalVpPenalty < 0,
                    safe: getPlayerPressure(pid).totalVpPenalty === 0
                  }"
                >
                  {{ getPlayerPressure(pid).totalVpPenalty }}
                </span>
              </template>
              <template v-else>
                <span class="no-zoi-dash">—</span>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- Influence VP Standings -->
      <div v-if="gameStore.showFormulas" class="formula-breakdown-section influence-vp-section">
        <div class="influence-vp-list">
          <template v-if="calculation.influenceRanks.some(item => item.influence >= 1)">
            <div
              v-for="r in calculation.influenceRanks.filter(item => item.influence >= 1)"
              :key="'inf-rank-' + r.playerId"
              class="inf-rank-item"
            >
              <span class="rank-pos">
                {{ r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : '4th' }}
              </span>
              <span class="player-name" :style="{ color: PLAYERS[r.playerId].color }">
                {{ PLAYERS[r.playerId].shortName }}
              </span>
              <span class="details">
                ({{ r.influence }} Inf, {{ r.tanks }} Tank{{ r.tanks === 1 ? '' : 's' }})
                <small v-if="r.isTie" class="tie-tag"> [Tied ➔ Rank {{ r.bonusRank }} VP]</small>
              </span>
              <span class="vp-badge">+{{ r.vpEarned }} VP</span>
            </div>
          </template>
          <div v-else class="empty-breakdown">
            No influence deployed in this zone (Minimum 1 Influence required for VP bonus).
          </div>
        </div>
      </div>

      <!-- Detailed Formula Breakdown -->
      <div v-if="gameStore.showFormulas" class="formula-breakdown-section">
        <div class="breakdown-list">
          <template v-for="pid in zone.interestedPlayers" :key="'bd-' + pid">
            <div
              v-if="getPlayerPressure(pid).breakdown.length > 0"
              class="player-breakdown-item"
            >
              <div class="target-player" :style="{ color: PLAYERS[pid].color }">
                <strong>{{ PLAYERS[pid].shortName }}</strong> (Threat: {{ getPlayerPressure(pid).threat }}, Defense: {{ getPlayerPressure(pid).defense }}):
              </div>
              <div class="opponent-formulas">
                <div
                  v-for="bd in getPlayerPressure(pid).breakdown"
                  :key="bd.opponentId"
                  class="opp-formula"
                  :class="{
                    nato: bd.isNatoExempt,
                    pressured: bd.pressure < 0
                  }"
                >
                  <span class="opp-name">
                    vs {{ PLAYERS[bd.opponentId].shortName }} (Threat: {{ bd.opponentThreat }})
                  </span>
                  <span v-if="bd.isNatoExempt" class="formula-result nato-text">
                    🛡️ NATO Exempt (0)
                  </span>
                  <span v-else-if="bd.isBoundlessExempt" class="formula-result boundless-text">
                    🤝 Boundless Exempt (0)
                  </span>
                  <span v-else-if="bd.pressure < 0" class="formula-result warn-text">
                    Threat {{ bd.opponentThreat }} > Def {{ bd.playerDefense }} ➔ VP: <strong>{{ bd.vpPenalty }}</strong>
                    <small v-if="bd.isNewStartTreaty" class="treaty-tag"> (📜 START x1)</small>
                  </span>
                  <span v-else class="formula-result safe-text">
                    Defended (Threat {{ bd.opponentThreat }} ≤ Def {{ bd.playerDefense }}) (0)
                  </span>
                </div>
              </div>
            </div>
          </template>
          <div
            v-if="
              zone.interestedPlayers.every(
                (p) => getPlayerPressure(p).breakdown.length === 0
              )
            "
            class="empty-breakdown"
          >
            No rival tanks deployed in this zone.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.zone-card {
  display: inline-block;
  flex-direction: column;
  gap: 1rem;
  border-width: 1px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;
  break-inside: avoid;

  @media (max-width: 1023px) {
    margin-bottom: 0;
  }
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
  width: 100%;
}

.zone-title {
  flex: 1;
  min-width: 0;

  h3 {
    font-size: 1.15rem;
    margin: 0;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    line-height: 1.25;
    word-break: break-word;

    @media (max-width: 640px) {
      font-size: 0.95rem;
    }
  }
}

.header-right-tags {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.interested-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;

  .label {
    font-size: 0.7rem;
    color: var(--c-grey-400);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .tags-list {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .player-tag {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.45rem;
    border-radius: 0.4rem;
  }
}

.vp-rewards-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .label {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
  }

  .vp-range-pill-btn {
    font-family: var(--font-numeric), var(--font-primary), sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #ffffff;
    background: rgba(15, 23, 42, 0.65);
    border: 1.5px solid rgba(255, 255, 255, 0.45);
    border-radius: 0.5rem;
    padding: 0.4rem 0.85rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;

    @media (max-width: 640px) {
      font-size: 0.95rem;
      padding: 0.3rem 0.65rem;
    }

    &:hover {
      border-color: rgba(255, 255, 255, 0.7);
      background: rgba(15, 23, 42, 0.85);
      color: #ffffff;
    }

    &.disabled {
      opacity: 0.45;
      text-decoration: line-through;
      text-decoration-thickness: 2px;
    }
  }
}

.accordion-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4rem 0.55rem;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  @media (max-width: 640px) {
    padding: 0.3rem 0.45rem;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(15, 23, 42, 0.85);
  }

  .chevron {
    font-size: 0.75rem;
    transition: transform 0.2s ease;

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

.minimalist-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-top: 0.15rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }
}

.min-summary-card {
  border: 1px solid;
  border-radius: 0.45rem;
  padding: 0.4rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  .min-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .min-player-name {
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    .min-vp-badge {
      font-size: 0.68rem;
      font-weight: 800;
      color: #4ade80;
      background: rgba(0, 0, 0, 0.4);
      padding: 0.05rem 0.3rem;
      border-radius: 0.25rem;
      line-height: 1;
    }
  }

  .min-stats-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-wrap: wrap;

    .stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      background: rgba(15, 23, 42, 0.55);
      padding: 0.15rem 0.35rem;
      border-radius: 0.3rem;
      border: 1px solid rgba(255, 255, 255, 0.15);

      .stat-val {
        font-family: var(--font-numeric);
        font-weight: 800;
        color: #ffffff;
        font-size: 0.85rem;
        line-height: 1;
      }
    }
  }
}

.table-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.35rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
  margin-top: 0.6rem;

  .table-title {
    margin: 0;
    padding: 0;
    border-bottom: none;
  }
}

.table-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: 0.25rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
  margin-top: 0.6rem;
}

.neutral-counter-inline {
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .neutral-label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
}

.mobile-label {
  display: none;

  @media (max-width: 640px) {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    margin-right: 0.15rem;
  }
}

.desktop-only {
  @media (max-width: 640px) {
    display: none !important;
  }
}

.mobile-only {
  display: none !important;

  @media (max-width: 640px) {
    display: inline-block !important;
  }
}

/* Influence Table Section (4 horizontal columns) */
.influence-columns-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.2rem;
  }
}

.influence-col-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.15rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;

  &.black-influence-col {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .col-header-name {
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;

    @media (max-width: 640px) {
      font-size: 0.65rem;
    }
  }

  .col-input-cell {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .col-result-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 1.8rem;
  }
}

/* Threat Table Section (6-column table) */
.threat-grid-container {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.threat-header-row,
.threat-player-row {
  display: grid;
  grid-template-columns: 85px 1fr 1fr 70px 70px 70px;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 50px 1fr 1fr 34px 34px 34px;
    gap: 0.15rem;
    padding: 0.25rem 0.15rem;
  }
}

.threat-header-row {
  font-size: 0.72rem;
  color: #ffffff;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.7);

  @media (max-width: 640px) {
    font-size: 0.6rem;
    letter-spacing: 0.01em;
  }

  .col-title {
    display: flex;
    align-items: center;
    padding-left: 0.4rem;

    @media (max-width: 640px) {
      padding-left: 0.25rem;
    }

    &.center {
      justify-content: center;
      text-align: center;
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.threat-player-row {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &.no-interest {
    opacity: 0.75;
  }

  .player-info-cell {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    overflow: hidden;
    padding-left: 0.4rem;

    @media (max-width: 640px) {
      padding-left: 0.25rem;
    }

    .name {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--c-grey-200);
      white-space: nowrap;

      @media (max-width: 640px) {
        font-size: 0.72rem;
      }
    }
  }

  .controls-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;

    @media (max-width: 640px) {
      justify-content: space-between;
      width: 100%;
      background: rgba(0, 0, 0, 0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 0.4rem;
    }
  }

  .badge-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 640px) {
      gap: 0.15rem;
    }
  }

  .calc-badge {
    font-family: var(--font-numeric);
    font-size: 1.15rem;
    font-weight: 700;
    padding: 0.1rem 0.45rem;
    border-radius: 0.35rem;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    min-width: 1.8rem;
    text-align: center;

    @media (max-width: 640px) {
      font-size: 1rem;
      padding: 0.05rem 0.3rem;
      min-width: 1.5rem;
    }
  }

  .pressure-cell {
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 640px) {
      gap: 0.15rem;
    }
  }

  .vp-bonus-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inf-vp-pill {
    font-family: var(--font-numeric);
    font-size: 1.5rem;
    font-weight: 700;
    padding: 0.1rem 0.5rem;
    border-radius: 0.4rem;
    min-width: 2.2rem;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    color: var(--c-grey-200);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);

    @media (max-width: 640px) {
      font-size: 1.1rem;
      padding: 0.1rem 0.2rem;
      min-width: 1.5rem;
    }

    &.safe {
      color: var(--c-grey-400);
      border-color: transparent;
    }
  }

  .no-zoi-dash {
    color: var(--c-grey-600);
    font-size: 1.2rem;
    font-weight: 500;

    @media (max-width: 640px) {
      font-size: 1rem;
    }
  }

  .pressure-cell {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .pressure-pill {
      font-family: var(--font-numeric);
      font-size: 1.5rem;
      font-weight: 700;
      padding: 0.1rem 0.5rem;
      border-radius: 0.4rem;
      min-width: 2.2rem;
      text-align: center;
      line-height: 1;
      color: var(--c-grey-200);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);

      @media (max-width: 640px) {
        font-size: 1.1rem;
        padding: 0.1rem 0.2rem;
        min-width: 1.5rem;
      }

      &.safe {
        color: var(--c-grey-400);
        border-color: transparent;
      }
    }

    .no-zoi-dash {
      margin-right: 0.5rem;
    }
  }
}

.influence-vp-section {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  background: rgba(34, 197, 94, 0.05);
  border-color: rgba(34, 197, 94, 0.2);

  .influence-vp-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.4rem;
  }

  .inf-rank-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 0.25rem 0.5rem;
    border-radius: 0.35rem;
    font-size: 0.8rem;

    .rank-pos {
      font-size: 0.9rem;
    }

    .player-name {
      font-weight: 700;
    }

    .details {
      font-size: 0.7rem;
      color: var(--c-grey-400);

      .tie-tag {
        color: #fde047;
      }
    }

    .vp-badge {
      margin-left: auto;
      font-family: var(--font-numeric);
      font-weight: 800;
      color: #4ade80;
      font-size: 0.85rem;
    }
  }
}

.formula-breakdown-section {
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px dashed rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  padding: 0.6rem 0.8rem;
  font-size: 0.8rem;

  .formula-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--c-grey-400);
    font-weight: 600;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.05em;
  }

  .breakdown-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .player-breakdown-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;

    .target-player {
      font-size: 0.8rem;
    }

    .opponent-formulas {
      padding-left: 0.6rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .opp-formula {
      display: flex;
      justify-content: space-between;
      color: var(--c-grey-300);
      font-size: 0.75rem;

      .formula-result {
        &.warn-text {
          color: #f87171;
        }

        &.nato-text {
          color: #38bdf8;
        }

        &.boundless-text {
          color: #fda4af;
        }

        &.safe-text {
          color: var(--c-grey-400);
        }
      }
    }
  }

  .empty-breakdown {
    color: var(--c-grey-500);
    font-style: italic;
  }
}
</style>
