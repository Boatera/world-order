<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import PlayerSummaryCard from '@/components/PlayerSummaryCard.vue';
import ZoneCard from '@/components/ZoneCard.vue';
import SettingsBar from '@/components/SettingsBar.vue';

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
  min-height: 100vh;
}

.dashboard-layout {
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
