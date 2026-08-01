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
          class="btn-bar btn-toggle"
          :class="{ active: gameStore.newStartTreatyActive, inactive: !gameStore.newStartTreatyActive }"
          @click="gameStore.newStartTreatyActive = !gameStore.newStartTreatyActive"
          title="Toggle New START Treaty (USA & Russia VP penalty reduced to x1)"
        >
          <span class="btn-text">New START Treaty</span>
        </button>

        <button
          type="button"
          class="btn-bar btn-toggle"
          :class="{ active: gameStore.boundlessFriendshipActive, inactive: !gameStore.boundlessFriendshipActive }"
          @click="gameStore.boundlessFriendshipActive = !gameStore.boundlessFriendshipActive"
          title="Toggle Russia-China Boundless Friendship (Immunity between Russia & China)"
        >
          <span class="btn-text">Boundless Friendship</span>
        </button>
      </div>

      <div class="right-icon-group">
        <button
          type="button"
          class="icon-btn btn-formula"
          :class="{ active: gameStore.showFormulas, inactive: !gameStore.showFormulas }"
          @click="gameStore.showFormulas = !gameStore.showFormulas"
          :title="gameStore.showFormulas ? 'Formulas Breakdown: ON (Click to Hide)' : 'Formulas Breakdown: OFF (Click to Show)'"
        >
          <span class="fx-icon">fx</span>
        </button>

        <button
          type="button"
          class="icon-btn btn-reset"
          @click="handleReset"
          title="Reset All Forces & Board State"
        >
          <span class="reset-icon">↺</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.settings-bar {
  position: relative;
  margin-top: 1.75rem;
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

.left-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.right-icon-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-bar {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

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

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.8rem;
  height: 2.3rem;
  padding: 0 0.65rem;
  border-radius: 0.5rem;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.65);
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  user-select: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.7);
    background: rgba(15, 23, 42, 0.85);
  }

  &.inactive {
    opacity: 0.45;
  }

  &.active {
    opacity: 1;
  }

  .fx-icon {
    font-family: 'Times New Roman', Georgia, serif;
    font-style: italic;
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1;
  }

  .reset-icon {
    font-size: 1.3rem;
    font-weight: 800;
    line-height: 1;
  }
}
</style>
