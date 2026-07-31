<script setup lang="ts">
import { useGameStore } from '@/stores/game';
import PlayerSummaryCard from '@/components/PlayerSummaryCard.vue';
import ZoneCard from '@/components/ZoneCard.vue';
import SettingsBar from '@/components/SettingsBar.vue';

const gameStore = useGameStore();
</script>

<template>
  <div class="app-root">
    <!-- Player Summary Cards (Top Dashboard) -->
    <section class="player-summary-grid">
      <PlayerSummaryCard
        v-for="pid in (['usa', 'eu', 'russia', 'china'] as const)"
        :key="pid"
        :summary="gameStore.playerSummaries[pid]"
      />
    </section>

    <!-- 7 Geopolitical Zones Grid -->
    <main class="zones-grid">
      <ZoneCard
        v-for="calc in Object.values(gameStore.zoneCalculations)"
        :key="calc.zone.id"
        :calculation="calc"
      />
    </main>

    <!-- Bottom Settings & Controls Toolbar -->
    <SettingsBar />
  </div>
</template>

<style scoped lang="scss">
.app-root {
  min-height: 100vh;
}
</style>
