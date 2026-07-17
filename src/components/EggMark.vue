<script setup lang="ts">
/* Fried-egg brand mark — thick ink outline, primary-color center.
   Colors come from theme tokens, so it follows any palette change.
   Decorative; label lives on the parent link. */
</script>

<template>
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M14 4C7 4 3 9 4 15c-3 2-3 8 1 10-1 6 5 11 11 9 3 3 9 3 12-1 6 1 10-4 9-9 3-3 2-9-2-11 0-6-6-9-11-7-3-2-8-1-10 3Z"
      fill="var(--color-paper)"
      stroke="var(--color-ink)"
      stroke-width="2.5"
      stroke-linejoin="round"
    />
    <circle
      cx="22"
      cy="21"
      r="7.5"
      fill="var(--color-primary)"
      stroke="var(--color-ink)"
      stroke-width="2.5"
    />
  </svg>
</template>
