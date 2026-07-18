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
        d="M 0,0 C -1.6666667,-1.8 -1.6666667,-2.5632881 0,-4.3632881 1.6666667,-2.5632881 1.6666667,-1.8 0,0 Z"
        transform="translate(20,15)"
      />
      <!-- upper sides (medium) -->
      <path
        d="M 0,0 C -2,-2.4 -1.7535563,-4.6689636 0.24644368,-7.0689636 2.2464437,-4.6689636 2,-2.4 0,0 Z"
        transform="rotate(62,-2.4820961,24.142795)"
      />
      <path
        d="M 0,0 C -2,-2.4 -2.2464437,-4.6689636 -0.24644368,-7.0689636 1.7535563,-4.6689636 2,-2.4 0,0 Z"
        transform="rotate(-62,22.482096,-9.1427948)"
      />
      <!-- lower sides (big) -->
      <path
        d="M 0,0 C -2.3333333,-2.9333333 -3.600758,-5.192765 -1.2674246,-8.1260984 1.0659087,-5.192765 2.3333333,-2.9333333 0,0 Z"
        transform="rotate(118,5.4935454,13.508606)"
      />
      <path
        d="M 0,0 C -2.3333333,-2.9333333 -1.0659087,-5.192765 1.2674246,-8.1260984 3.600758,-5.192765 2.3333333,-2.9333333 0,0 Z"
        transform="rotate(-118,14.506455,1.4913938)"
      />
      <!-- front center (biggest) -->
      <path
        d="M 0,0 C -2.4,-3.1333333 -2.4,-4.8312195 0,-7.9645528 2.4,-4.8312195 2.4,-3.1333333 0,0 Z"
        transform="rotate(180,10,7.5)"
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
