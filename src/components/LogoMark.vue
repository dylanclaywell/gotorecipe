<script setup lang="ts">
/* Brand mark — a tomato: squashed red body, basil-green calyx with forced
   perspective (front leaves large, back leaves small/foreshortened) and a
   filled center. Each leaf is authored at its own size and placed with
   rotate+translate only — never scale() — so the 2.5 stroke stays uniform and
   scales proportionally with the icon (no non-scaling-stroke). Colors come
   from theme tokens, so it follows any palette change. Decorative. */
</script>

<template>
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <!-- body (squashed) -->
    <ellipse
      cx="20"
      cy="25"
      rx="14"
      ry="11"
      fill="var(--color-primary)"
      stroke="var(--color-ink)"
      stroke-width="2.5"
    />
    <!-- calyx: 6 leaves, back-to-front. Size baked into each path. -->
    <g
      fill="var(--color-accent)"
      stroke="var(--color-ink)"
      stroke-width="2.5"
      stroke-linejoin="round"
    >
      <!-- back (small) -->
      <path
        d="M0 0 Q-2.5 -2.7 0 -5.4 Q2.5 -2.7 0 0Z"
        transform="translate(20 15) rotate(0)"
      />
      <!-- upper sides (medium) -->
      <path
        d="M0 0 Q-3 -3.6 0 -7.2 Q3 -3.6 0 0Z"
        transform="translate(20 15) rotate(62)"
      />
      <path
        d="M0 0 Q-3 -3.6 0 -7.2 Q3 -3.6 0 0Z"
        transform="translate(20 15) rotate(298)"
      />
      <!-- lower sides (big) -->
      <path
        d="M0 0 Q-3.5 -4.4 0 -8.8 Q3.5 -4.4 0 0Z"
        transform="translate(20 15) rotate(118)"
      />
      <path
        d="M0 0 Q-3.5 -4.4 0 -8.8 Q3.5 -4.4 0 0Z"
        transform="translate(20 15) rotate(242)"
      />
      <!-- front center (biggest) -->
      <path
        d="M0 0 Q-3.6 -4.7 0 -9.4 Q3.6 -4.7 0 0Z"
        transform="translate(20 15) rotate(180)"
      />
    </g>
    <!-- calyx center -->
    <circle
      cx="20"
      cy="15"
      r="2"
      fill="var(--color-accent)"
      stroke="var(--color-ink)"
      stroke-width="2.5"
    />
  </svg>
</template>
