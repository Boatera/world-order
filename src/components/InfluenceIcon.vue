<script setup lang="ts">
import { computed } from 'vue';
import type { PlayerId } from '@/types/game';

const props = withDefaults(
  defineProps<{
    playerId?: PlayerId | 'black';
    color?: string;
    size?: number | string;
  }>(),
  {
    size: 20
  }
);

const playerColorMap: Record<PlayerId | 'black', string> = {
  usa: '#0284c7',
  eu: '#f59e0b',
  russia: '#ffffff',
  china: '#dc2626',
  black: '#000000'
};

const fillColor = computed(() => {
  if (props.color) return props.color;
  if (props.playerId && playerColorMap[props.playerId]) {
    return playerColorMap[props.playerId];
  }
  return '#ffffff';
});

const strokeColor = computed(() => {
  return fillColor.value.toLowerCase() === '#ffffff' ? 'rgba(0,0,0,0.5)' : '#ffffff';
});

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>

<template>
  <svg
    :width="computedSize"
    :height="computedSize"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="influence-icon-svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      rx="3"
      :fill="fillColor"
      :stroke="strokeColor"
      stroke-width="2.5"
    />
  </svg>
</template>

<style scoped>
.influence-icon-svg {
  display: inline-block;
  vertical-align: middle;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
}
</style>
