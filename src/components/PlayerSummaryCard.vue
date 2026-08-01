<script setup lang="ts">
import type { PlayerSummary } from '@/types/game';
import TankIcon from '@/components/TankIcon.vue';
import InfluenceIcon from '@/components/InfluenceIcon.vue';
import { useGameStore } from '@/stores/game';

defineProps<{
  summary: PlayerSummary;
}>();

const gameStore = useGameStore();
</script>

<template>
  <div
    class="card player-summary-card"
    :style="{
      background: summary.player.bgGradient,
      borderColor: summary.player.borderColor
    }"
  >
    <!-- Header -->
    <div class="card-header">
      <div class="player-title">
        <div class="name-group">
          <h3>{{ summary.player.shortName }}</h3>
          <span class="full-name">{{ summary.player.name }}</span>
        </div>
      </div>

      <!-- Top Right: Boxless Tanks & Influence Counters -->
      <div class="top-right-counters">
        <div class="counter-item" title="Total Tanks across all zones">
          <TankIcon :player-id="summary.player.id" :color="summary.player.color" :width="24" :height="14" />
          <span class="count-value">{{ summary.totalTanks }}</span>
        </div>
        <div class="counter-item" title="Total Influence across all zones">
          <InfluenceIcon :color="summary.player.color" :size="16" />
          <span class="count-value">{{ summary.totalInfluence }}</span>
        </div>
      </div>
    </div>

    <!-- 2 Metric Boxes -->
    <div class="metrics-row">
      <div class="metric inf-vp-metric">
        <span class="metric-label">Scoring Phase</span>
        <span class="metric-value">+{{ summary.totalInfluenceVp }}</span>
      </div>

      <div class="metric pressure-metric" :class="{ penalized: summary.totalVpPenalty < 0 }">
        <span class="metric-label">Threat Phase</span>
        <span class="metric-value">{{ summary.totalVpPenalty }}</span>
      </div>
    </div>

    <!-- Footer Controls (Military Focus & Nuclear Program) -->
    <div class="card-footer-controls">
      <button
        type="button"
        class="mf-toggle-btn"
        :class="{
          active: gameStore.isMilitaryFocusActive(summary.player.id),
          inactive: !gameStore.isMilitaryFocusActive(summary.player.id)
        }"
        @click="gameStore.toggleMilitaryFocus(summary.player.id)"
        title="Toggle Military Focus: +1 Threat (if tanks ≥ 1), +1 Defense (if Zone of Interest)"
      >
        <span class="mf-label">Military Focus</span>
      </button>

      <button
        type="button"
        class="nuclear-toggle-btn"
        :class="{
          active: gameStore.isNuclearProgramActive(summary.player.id),
          inactive: !gameStore.isNuclearProgramActive(summary.player.id)
        }"
        @click="gameStore.toggleNuclearProgram(summary.player.id)"
        title="Toggle Nuclear Program: +1 Threat & +1 Defense in all 7 zones (Only 1 player active)"
      >
        <span class="nuclear-label">Nuclear Program</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-summary-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-width: 1px;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.player-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;

  .name-group {
    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }

    .full-name {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.8);
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 140px;
    }
  }
}

.top-right-counters {
  display: flex;
  align-items: center;
  gap: 0.75rem;

  .counter-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;

    .count-value {
      font-family: var(--font-numeric);
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffffff;
      line-height: 1;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    }
  }
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.metric {
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem 0.6rem;
  display: flex;
  flex-direction: column;
  min-width: 0;

  .metric-label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 700;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }

  .metric-value {
    font-family: var(--font-numeric);
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.1;
    color: #ffffff;
    margin-top: 0.15rem;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
  }
}

.card-footer-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.4rem;
  width: 100%;
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  padding-top: 0.5rem;
  margin-top: 0.35rem;
}

.mf-toggle-btn,
.nuclear-toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-family: var(--font-numeric), var(--font-primary), sans-serif;
  font-size: 0.82rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  border-radius: 0.5rem;
  padding: 0.35rem 0.25rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 0.78rem;
    padding: 0.3rem 0.2rem;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(15, 23, 42, 0.85);
    color: #ffffff;
  }

  &.inactive {
    opacity: 0.45;
    text-decoration: line-through;
    text-decoration-thickness: 2px;
  }

  &.active {
    opacity: 1;
    text-decoration: none;
  }
}
</style>
