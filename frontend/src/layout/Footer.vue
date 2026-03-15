<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <footer class="w-full bg-zinc-900 text-zinc-400 px-6 py-10">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">

      <!-- Logo -->
      <span
        @click="router.push('/')"
        class="text-white font-bold text-lg tracking-tight cursor-pointer hover:text-sky-400 transition-colors"
      >
        Task<span class="text-sky-500">Manager</span>
      </span>

      <!-- Links -->
      <div class="flex gap-6 text-sm">
        <RouterLink to="/" class="hover:text-white transition-colors">Accueil</RouterLink>
        <RouterLink to="/dashboard" class="hover:text-white transition-colors">Dashboard</RouterLink>
        <RouterLink to="/settings" class="hover:text-white transition-colors">Paramètres</RouterLink>
      </div>

      <!-- Copyright -->
      <p class="text-xs text-zinc-600">
        &copy; {{ new Date().getFullYear() }} TaskManager — Tous droits réservés
      </p>

    </div>
  </footer>
</template>