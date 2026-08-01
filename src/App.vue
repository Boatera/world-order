<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import PlayerSummaryCard from '@/components/PlayerSummaryCard.vue';
import ZoneCard from '@/components/ZoneCard.vue';
import SettingsBar from '@/components/SettingsBar.vue';
import CheckToggle from '@/components/CheckToggle.vue';

const gameStore = useGameStore();
</script>

<template>
  <div class="app-root">
    <div class="dashboard-layout">
      <!-- Left Sidebar: Player Summary Cards -->
      <aside class="player-summary-section">
        <PlayerSummaryCard
          v-for="pid in (['usa', 'eu', 'russia', 'china'] as const)"
          :key="pid"
          :summary="gameStore.playerSummaries[pid]"
        />

        <!-- Global Treaties Toggles (New START Treaty & Boundless Friendship) -->
        <div class="global-treaties-controls">
          <CheckToggle
            id="start-treaty-global-toggle"
            :model-value="gameStore.newStartTreatyActive"
            @update:model-value="(val) => gameStore.newStartTreatyActive = val"
            label="New Start Treaty"
            active-color="linear-gradient(135deg, #2563eb 0%, #ffffff 100%)"
          >New Start Treaty</CheckToggle>
          <CheckToggle
            id="boundless-friendship-global-toggle"
            :model-value="gameStore.boundlessFriendshipActive"
            @update:model-value="(val) => gameStore.boundlessFriendshipActive = val"
            label="Russia-China Boundless Friendship"
            active-color="linear-gradient(135deg, #ffffff 0%, #dc2626 100%)"
          >Russia-China Boundless Friendship</CheckToggle>
        </div>

        <!-- Global Accordion Control Buttons -->
        <div class="global-accordion-controls">
          <button
            type="button"
            class="accordion-global-btn expand-all-btn"
            @click="gameStore.expandAllZones()"
            title="Expand all 7 zone card details"
          >
            <span class="chevron-icon">▼</span>
            <span>Expand All</span>
          </button>

          <button
            type="button"
            class="accordion-global-btn collapse-all-btn"
            @click="gameStore.collapseAllZones()"
            title="Collapse all 7 zone card details"
          >
            <span class="chevron-icon">▲</span>
            <span>Collapse All</span>
          </button>
        </div>
      </aside>

      <!-- Right Main Content: 7 Geopolitical Zones Grid -->
      <main class="zones-main-section">
        <ZoneCard
          v-for="calc in Object.values(gameStore.zoneCalculations)"
          :key="calc.zone.id"
          :calculation="calc"
        />
      </main>
    </div>

    <!-- Bottom Settings Toolbar -->
    <SettingsBar />
  </div>
</template>

<style scoped lang="scss">
.app-root {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
}

.dashboard-layout {
  flex: 1;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
}

.player-summary-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 350px;
  max-width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;

  @media (max-width: 1023px) {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.global-treaties-controls {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: var(--c-card-bg, rgba(15, 23, 42, 0.65));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.6rem;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.global-accordion-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 0.2rem;
  width: 100%;
}

.accordion-global-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.5rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;
  white-space: nowrap;

  .chevron-icon {
    font-size: 0.65rem;
    color: var(--c-accent-blue);
  }

  &:hover {
    background: rgba(30, 41, 59, 0.85);
    border-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: translateY(1px);
  }
}

.zones-main-section {
  flex: 1;
  column-count: 2;
  column-gap: 1rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;

  @media (max-width: 1280px) and (min-width: 1024px) {
    column-count: 1;
  }

  @media (max-width: 1023px) {
    column-count: 1;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
