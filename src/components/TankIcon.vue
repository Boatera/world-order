<script setup lang="ts">
import { computed } from 'vue';
import type { PlayerId } from '@/types/game';
import { PLAYERS } from '@/data/gameData';

const props = withDefaults(
  defineProps<{
    playerId?: PlayerId;
    color?: string;
    src?: string;
    width?: number | string;
    height?: number | string;
  }>(),
  {
    width: 28,
    height: 14
  }
);

const baseUrl = import.meta.env.BASE_URL;

const playerImageMap: Record<PlayerId, string> = {
  usa: `${baseUrl}images/tank-us.png`,
  eu: `${baseUrl}images/tank-eu.png`,
  russia: `${baseUrl}images/tank-ru.png`,
  china: `${baseUrl}images/tank-cn.png`
};

const imageSrc = computed(() => {
  if (props.src) return props.src;
  if (props.playerId && playerImageMap[props.playerId]) {
    return playerImageMap[props.playerId];
  }
  if (props.color) {
    const c = props.color.toLowerCase();
    for (const config of Object.values(PLAYERS)) {
      if (
        config.color.toLowerCase() === c ||
        config.borderColor.toLowerCase() === c ||
        config.bgGradient.toLowerCase() === c
      ) {
        return config.tankImage.startsWith('http') ? config.tankImage : `${baseUrl}${config.tankImage.replace(/^\//, '')}`;
      }
    }
    if (c.includes('facc15') || c.includes('eab308') || c.includes('ca8a04') || c.includes('yellow') || c.includes('gold')) {
      return `${baseUrl}images/tank-eu.png`;
    }
    if (c.includes('e2e8f0') || c.includes('94a3b8') || c.includes('475569') || c.includes('gray') || c.includes('grey') || c.includes('slate')) {
      return `${baseUrl}images/tank-ru.png`;
    }
    if (c.includes('f87171') || c.includes('ef4444') || c.includes('b91c1c') || c.includes('red')) {
      return `${baseUrl}images/tank-cn.png`;
    }
    if (c.includes('60a5fa') || c.includes('3b82f6') || c.includes('1d4ed8') || c.includes('blue')) {
      return `${baseUrl}images/tank-us.png`;
    }
  }
  return `${baseUrl}images/tank-us.png`;
});

const computedWidth = computed(() => {
  return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

const computedHeight = computed(() => {
  return typeof props.height === 'number' ? `${props.height}px` : props.height;
});
</script>

<template>
  <img
    :src="imageSrc"
    alt="Tank Icon"
    class="tank-icon-img"
    :style="{
      width: computedWidth,
      height: computedHeight
    }"
  />
</template>

<style scoped>
.tank-icon-img {
  display: inline-block;
  vertical-align: middle;
  object-fit: contain;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.4));
}
</style>
