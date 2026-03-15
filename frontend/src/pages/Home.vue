<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStores"

const router = useRouter()
const store = useAuthStore()
</script>

<template>
  <div class="flex flex-col">

    <!-- Hero -->
    <section class="flex flex-col items-center justify-center text-center px-6 py-28 bg-linear-to-br from-sky-600 via-sky-800 via-30% to-zinc-900">
      <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
        Gérez vos tâches,<br />simplement.
      </h1>
      <p class="text-sky-200 text-lg max-w-xl mb-10">
        Task Manager vous permet d'organiser votre travail, suivre vos projets et collaborer efficacement.
      </p>
      <div class="flex gap-4">
        <button
          v-if="!store.getLoggedIn"
          @click="router.push('/forms')"
          type="button"
          class="px-6 py-3 bg-white text-zinc-800 font-semibold rounded-lg shadow hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          Commencer gratuitement
        </button>
        <button
          v-else
          @click="router.push('/dashboard')"
          type="button"
          class="px-6 py-3 bg-white text-zinc-800 font-semibold rounded-lg shadow hover:bg-zinc-100 transition-colors cursor-pointer"
        >
          Mon espace
        </button>
        <a
          href="#features"
          class="px-6 py-3 border border-white/40 text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          En savoir plus
        </a>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="py-20 px-6 bg-white">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold text-zinc-800 text-center mb-12">Pourquoi Task Manager ?</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-bold">
              ✓
            </div>
            <h3 class="font-semibold text-zinc-800">Suivi en temps réel</h3>
            <p class="text-sm text-gray-500">Visualisez l'avancement de vos tâches à tout moment.</p>
          </div>
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-bold">
              ⚡
            </div>
            <h3 class="font-semibold text-zinc-800">Rapide et simple</h3>
            <p class="text-sm text-gray-500">Une interface épurée pour aller à l'essentiel sans friction.</p>
          </div>
          <div class="flex flex-col items-center text-center gap-3">
            <div class="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-bold">
              🔒
            </div>
            <h3 class="font-semibold text-zinc-800">Sécurisé</h3>
            <p class="text-sm text-gray-500">Vos données sont protégées par une authentification JWT.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 px-6 bg-zinc-900 text-center">
      <h2 class="text-2xl font-bold text-white mb-4">Prêt à vous lancer ?</h2>
      <p class="text-zinc-400 mb-8">Créez votre compte en quelques secondes.</p>
      <button
        @click="router.push(store.getLoggedIn ? '/dashboard' : '/forms')"
        type="button"
        class="px-8 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors cursor-pointer"
      >
        {{ store.getLoggedIn ? "Accéder au dashboard" : "S'inscrire maintenant" }}
      </button>
    </section>

  </div>
</template>