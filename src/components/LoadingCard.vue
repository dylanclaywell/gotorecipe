<script setup lang="ts">
defineProps<{ host: string }>()
</script>

<template>
  <div class="card-hard flex flex-col gap-5 p-6" aria-busy="true">
    <p class="font-mono text-sm text-ink/70">
      Decluttering <span class="text-ink">{{ host }}</span
      >…
    </p>
    <div class="h-9 w-3/4 animate-pulse rounded-sm bg-muted" />
    <div class="flex flex-col gap-2.5">
      <div class="h-4 w-full animate-pulse rounded-sm bg-muted" />
      <div class="h-4 w-5/6 animate-pulse rounded-sm bg-muted" />
      <div class="h-4 w-4/6 animate-pulse rounded-sm bg-muted" />
    </div>
    <span class="sr-only">Loading recipe</span>
  </div>
</template>
