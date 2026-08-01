<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    label: string;
    id: string;
    activeColor?: string;
  }>(),
  {
    activeColor: '#3b82f6'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function toggle() {
  emit('update:modelValue', !props.modelValue);
}
</script>

<template>
  <div class="check-toggle-control" @click="toggle" :title="'Toggle ' + label">
    <div class="toggler">
      <input
        :id="id"
        type="checkbox"
        :checked="modelValue"
        tabindex="-1"
      />
      <label :for="id">
        <svg class="toggler-on" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
          <polyline class="path check" points="100.2,40.2 51.5,88.8 29.8,67.5"></polyline>
        </svg>
        <svg class="toggler-off" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
          <line class="path line" x1="34.4" y1="34.4" x2="95.8" y2="95.8"></line>
          <line class="path line" x1="95.8" y1="34.4" x2="34.4" y2="95.8"></line>
        </svg>
      </label>
    </div>
    <span class="toggle-control-label" :class="{ active: modelValue }">
      <slot>{{ label }}</slot>
    </span>
  </div>
</template>

<style scoped>
.check-toggle-control {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  user-select: none;
  padding: 0.2rem 0.1rem;
}

.toggle-control-label {
  font-family: var(--font-numeric), var(--font-primary), sans-serif;
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.01em;
  line-height: 1;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.toggle-control-label.active {
  color: #ffffff;
}

.toggler {
  width: 42px;
  flex-shrink: 0;
  pointer-events: none;
}

.toggler input {
  display: none;
}

.toggler label {
  display: block;
  position: relative;
  width: 42px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 22px;
  background: #0f172a;
  cursor: pointer;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.toggler label::after {
  display: block;
  border-radius: 100%;
  background: #475569;
  content: '';
  animation-name: toggler-size;
  animation-duration: 0.15s;
  animation-timing-function: ease-out;
  animation-direction: forwards;
  animation-iteration-count: 1;
  animation-play-state: running;
}

.toggler label::after,
.toggler label .toggler-on,
.toggler label .toggler-off {
  position: absolute;
  top: 50%;
  left: 25%;
  width: 16px;
  height: 16px;
  transform: translateY(-50%) translateX(-50%);
  transition: left 0.15s ease-in-out, background 0.2s ease-out, width 0.15s ease-in-out, height 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.toggler input:checked + label::after,
.toggler input:checked + label .toggler-on,
.toggler input:checked + label .toggler-off {
  left: 75%;
}

.toggler input:checked + label::after {
  background: v-bind(activeColor);
  animation-name: toggler-size2;
}

.toggler .toggler-on,
.toggler .toggler-off {
  opacity: 1;
  z-index: 2;
}

.toggler input:checked + label .toggler-off,
.toggler input:not(:checked) + label .toggler-on {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggler .path {
  fill: none;
  stroke: #ffffff;
  stroke-width: 10px;
  stroke-linecap: round;
  stroke-miterlimit: 10;
}

@keyframes toggler-size {
  0%, 100% {
    width: 16px;
    height: 16px;
  }

  50% {
    width: 12px;
    height: 12px;
  }
}

@keyframes toggler-size2 {
  0%, 100% {
    width: 16px;
    height: 16px;
  }

  50% {
    width: 12px;
    height: 12px;
  }
}
</style>
