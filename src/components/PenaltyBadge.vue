<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: number | string;
  }>(),
  {
    size: 14
  }
);

const computedSize = computed(() => {
  return typeof props.size === 'number' ? `${props.size}px` : props.size;
});
</script>

<template>
  <span
    class="penalty-badge-wrapper"
    :style="{
      width: computedSize,
      height: computedSize
    }"
  >
    <svg
      viewBox="0 0 27.963 27.963"
      class="penalty-svg-icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13.9815" cy="13.9815" r="13" fill="#ff1100" />
      <g fill="#000000">
        <path d="M13.983,0C6.261,0,0.001,6.259,0.001,13.979c0,7.724,6.26,13.984,13.982,13.984s13.98-6.261,13.98-13.984 C27.963,6.259,21.705,0,13.983,0z M13.983,26.531c-6.933,0-12.55-5.62-12.55-12.553c0-6.93,5.617-12.548,12.55-12.548 c6.931,0,12.549,5.618,12.549,12.548C26.531,20.911,20.913,26.531,13.983,26.531z" />
        <polygon points="12.414,17.158 15.579,17.158 16.191,4.579 11.804,4.579 " transform="matrix(1.1690658,0,0,1,-2.3664987,-0.139815)" />
        <path d="m 13.998,18.755721 c -1.471,0 -2.5,1.029 -2.5,2.526 0,1.443 0.999,2.528 2.444,2.528 h 0.056 c 1.499,0 2.469,-1.085 2.469,-2.528 -0.026,-1.497 -0.999,-2.526 -2.469,-2.526 z" />
      </g>
    </svg>
  </span>
</template>

<style scoped>
.penalty-badge-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -4px;
  left: calc(100% + 2px);
  filter: drop-shadow(0 0 1.5px rgba(255, 17, 0, 0.7));
  pointer-events: none;
}

.penalty-svg-icon {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
