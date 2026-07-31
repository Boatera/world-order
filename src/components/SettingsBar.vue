<script setup lang="ts">
import { useGameStore } from '@/stores/game';

const gameStore = useGameStore();

function handleReset() {
  if (window.confirm('Are you sure you want to reset all forces, influence, and settings?')) {
    gameStore.resetBoard();
  }
}
</script>

<template>
  <footer class="settings-bar">
    <div class="settings-container">
      <div class="left-controls">
        <button
          type="button"
          class="btn-bar btn-reset"
          @click="handleReset"
          title="Reset all tanks to zero"
        >
          <span class="btn-text">Reset Board</span>
        </button>
      </div>

      <div class="right-controls">
        <button
          type="button"
          class="btn-bar btn-toggle"
          :class="{ active: gameStore.newStartTreatyActive }"
          @click="gameStore.newStartTreatyActive = !gameStore.newStartTreatyActive"
          title="Toggle New START Treaty (USA & Russia VP penalty reduced to x1)"
        >
          <span class="btn-text">New START Treaty: </span>
          <span class="status-pill">{{ gameStore.newStartTreatyActive ? 'ON' : 'OFF' }}</span>
        </button>

        <button
          type="button"
          class="btn-bar btn-toggle"
          :class="{ active: gameStore.boundlessFriendshipActive }"
          @click="gameStore.boundlessFriendshipActive = !gameStore.boundlessFriendshipActive"
          title="Toggle Russia-China Boundless Friendship (Immunity between Russia & China)"
        >
          <span class="btn-text">Boundless Friendship: </span>
          <span class="status-pill">{{ gameStore.boundlessFriendshipActive ? 'ON' : 'OFF' }}</span>
        </button>

        <button
          type="button"
          class="btn-bar btn-toggle"
          :class="{ active: gameStore.showFormulas }"
          @click="gameStore.showFormulas = !gameStore.showFormulas"
          title="Toggle detailed formula breakdown"
        >
          <span class="btn-text">Formulas: </span>
          <span class="status-pill">{{ gameStore.showFormulas ? 'ON' : 'OFF' }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.settings-bar {
  position: relative;
  margin-top: 1.5rem;
  background: var(--c-surface-settings);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  padding: 0.8rem 1.25rem;
}

.settings-container {
  max-width: 1380px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
  }
}

.left-controls, .right-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-grey-200);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    color: var(--c-white);
  }

  &.active {
    background: rgba(59, 130, 246, 0.2);
    border-color: rgba(59, 130, 246, 0.4);
    color: var(--c-white);
  }

  .status-pill {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.05rem 0.35rem;
    border-radius: 0.25rem;
    background: rgba(255, 255, 255, 0.15);
  }

  &.active .status-pill {
    background: #3b82f6;
    color: var(--c-white);
  }
}

.btn-reset {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;

  &:hover {
    background: rgba(239, 68, 68, 0.3);
    color: var(--c-white);
  }
}
</style>
