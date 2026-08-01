<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    width?: number | string;
    height?: number | string;
    size?: number | string;
  }>(),
  {
    width: 16,
    height: 16
  }
);

const baseUrl = import.meta.env.BASE_URL;
const imageSrc = `${baseUrl}images/threat.svg`;

const computedWidth = computed(() => {
  if (props.size) return typeof props.size === 'number' ? `${props.size}px` : props.size;
  return typeof props.width === 'number' ? `${props.width}px` : props.width;
});

const computedHeight = computed(() => {
  if (props.size) return typeof props.size === 'number' ? `${props.size}px` : props.size;
  return typeof props.height === 'number' ? `${props.height}px` : props.height;
});
</script>

<template>
  <img
    :src="imageSrc"
    alt="Threat Icon"
    class="threat-icon-img"
    :style="{
      width: computedWidth,
      height: computedHeight
    }"
  />
</template>

<style scoped>
.threat-icon-img {
  display: inline-block;
  vertical-align: middle;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}
</style>
