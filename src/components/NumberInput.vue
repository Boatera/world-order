<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    color?: string;
  }>(),
  {
    min: 0,
    max: 99,
    step: 1,
    disabled: false,
    color: 'var(--c-grey-400)'
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const timer = ref<any>(null);

function updateVal(val: number) {
  const clamped = Math.max(props.min, Math.min(props.max, val));
  emit('update:modelValue', clamped);
}

function increment() {
  if (props.disabled) return;
  updateVal(props.modelValue + props.step);
}

function decrement() {
  if (props.disabled) return;
  updateVal(props.modelValue - props.step);
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const num = parseInt(target.value, 10);
  updateVal(isNaN(num) ? 0 : num);
}

function startHold(action: () => void) {
  action();
  timer.value = setInterval(() => {
    action();
  }, 180);
}

function stopHold() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
</script>

<template>
  <div class="number-input-container" :class="{ disabled }">
    <button
      type="button"
      class="btn-step btn-minus"
      :disabled="disabled || modelValue <= min"
      @mousedown="startHold(decrement)"
      @mouseup="stopHold"
      @mouseleave="stopHold"
      @touchstart.prevent="startHold(decrement)"
      @touchend="stopHold"
      aria-label="Decrease tanks"
    >
      −
    </button>
    <input
      type="number"
      class="num-field"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      @input="onInput"
      :style="{ borderColor: color }"
    />
    <button
      type="button"
      class="btn-step btn-plus"
      :disabled="disabled || modelValue >= max"
      @mousedown="startHold(increment)"
      @mouseup="stopHold"
      @mouseleave="stopHold"
      @touchstart.prevent="startHold(increment)"
      @touchend="stopHold"
      aria-label="Increase tanks"
    >
      +
    </button>
  </div>
</template>

<style scoped lang="scss">
.number-input-container {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 0.5rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);

  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
}

.btn-step {
  flex: 1;
  min-width: 1.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--c-grey-200);
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.15s ease, color 0.15s ease;
  user-select: none;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.15);
    color: var(--c-white);
  }

  &:active:not(:disabled) {
    background: rgba(255, 255, 255, 0.25);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.num-field {
  flex: 1.2;
  min-width: 1.2rem;
  width: 100%;
  height: 2.2rem;
  text-align: center;
  background: transparent;
  border: none;
  color: var(--c-white);
  font-family: var(--font-numeric);
  font-size: 1.4rem;
  font-weight: 700;
  appearance: textfield;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    outline: none;
  }
}

@media (max-width: 640px) {
  .btn-step {
    height: 1.8rem;
    font-size: 1.1rem;
  }

  .num-field {
    height: 1.8rem;
    font-size: 1.15rem;
  }
}
</style>
