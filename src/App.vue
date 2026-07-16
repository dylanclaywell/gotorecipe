<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import EggMark from '@/components/EggMark.vue'
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b-2 border-ink">
      <div
        class="mx-auto flex max-w-3xl items-center justify-between px-5 py-4"
      >
        <RouterLink
          to="/"
          class="press flex items-center gap-2.5 hover:-translate-y-0.5"
          aria-label="GoToRecipe home"
        >
          <EggMark class="h-9 w-9" />
          <span
            class="font-display text-xl tracking-tight text-ink sm:text-2xl"
          >
            GoToRecipe
          </span>
        </RouterLink>
        <span
          class="hidden font-mono text-xs text-ink/60 sm:inline"
          aria-hidden="true"
        >
          the recipe, nothing else
        </span>
      </div>
    </header>

    <main class="mx-auto w-full max-w-3xl flex-1 px-5 py-8 sm:py-12">
      <RouterView />
    </main>

    <footer class="border-t-2 border-ink">
      <div
        class="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-5 py-4 font-mono text-xs text-ink/60"
      >
        <span>No ads · No account · No life story</span>
        <span>Works offline once installed</span>
      </div>
    </footer>
  </div>
</template>
