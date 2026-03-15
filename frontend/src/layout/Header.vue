<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStores';

const store = useAuthStore();
const router = useRouter();
const route = useRoute();

const isActive = (path: string) => route.path === path;
</script>

<template>
  <header class="w-full px-6 py-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
    <nav class="max-w-5xl mx-auto flex justify-between items-center">

      <!-- Logo -->
      <RouterLink to="/" class="text-zinc-800 font-bold text-lg tracking-tight hover:text-sky-700 transition-colors">
        Task<span class="text-sky-600">Manager</span>
      </RouterLink>

      <!-- Nav links (connecté) -->
      <div v-if="store.getLoggedIn" class="max-sm:hidden flex items-center gap-6">
        <RouterLink
          to="/dashboard"
          :class="['text-sm transition-colors', isActive('/dashboard') ? 'text-sky-600 font-semibold' : 'text-gray-500 hover:text-zinc-800']"
        >
          Mon espace
        </RouterLink>
        <RouterLink
          to="/settings"
          :class="['text-sm transition-colors', isActive('/settings') ? 'text-sky-600 font-semibold' : 'text-gray-500 hover:text-zinc-800']"
        >
          Paramètres
        </RouterLink>
        <button
          type="button"
          @click="store.logout()"
          class="px-4 py-1.5 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
        >
          Se déconnecter
        </button>
      </div>

      <!-- Nav links (non connecté) -->
      <div v-else class="max-sm:hidden flex items-center gap-4">
        <button
          type="button"
          @click="router.push('/forms')"
          class="px-4 py-1.5 text-sm text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          Se connecter
        </button>
        <button
          type="button"
          @click="router.push('/forms')"
          class="px-4 py-1.5 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors cursor-pointer"
        >
          S'inscrire
        </button>
      </div>

    </nav>
  </header>
</template>