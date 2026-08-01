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

  @media (max-width: 1023px) {
    flex-direction: column;
  }
}

.player-summary-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 350px;
  flex-shrink: 0;

  @media (max-width: 1023px) {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.6rem;
  }
}

.zones-main-section {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  min-width: 0;

  @media (max-width: 1280px) and (min-width: 1024px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
