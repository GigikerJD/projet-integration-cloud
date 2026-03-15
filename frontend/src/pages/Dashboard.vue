<script setup lang="ts">
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"
import { useAuthStore } from "../stores/authStores"
import { getUserApi, decodeToken } from "../models/api.models"
import Task from "../components/dashboard/Task.vue"

const store = useAuthStore()

const userId = computed(() => {
  if (!store.getToken) return ""
  return decodeToken(store.getToken).id
})

const { data: user, isPending, isError } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUserApi(userId.value, store.getToken!),
  enabled: computed(() => !!userId.value),
})

const mockTasks = [
  { title: "Créer la maquette", description: "Réaliser les wireframes de l'application", status: "done" as const, date: "10 mars 2026" },
  { title: "Intégration API", description: "Connecter le frontend aux routes backend", status: "in-progress" as const, date: "14 mars 2026" },
  { title: "Tests unitaires", description: "Couvrir les composants principaux", status: "todo" as const, date: "20 mars 2026" },
  { title: "Déploiement", description: "Mise en production sur le cloud", status: "todo" as const, date: "25 mars 2026" },
]

const stats = computed(() => ({
  total: mockTasks.length,
  done: mockTasks.filter(t => t.status === "done").length,
  inProgress: mockTasks.filter(t => t.status === "in-progress").length,
  todo: mockTasks.filter(t => t.status === "todo").length,
}))
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-10 space-y-10">

    <!-- Welcome -->
    <div v-if="isPending" class="h-16 bg-gray-100 rounded-xl animate-pulse" />
    <div v-else-if="isError" class="text-sm text-red-500">Impossible de charger le profil.</div>
    <div v-else class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-zinc-800">
          Bonjour, {{ user?.firstname }} {{ user?.lastname }} 👋
        </h1>
        <p class="text-sm text-gray-500 mt-1">Voici un aperçu de vos tâches en cours.</p>
      </div>
      <span
        :class="[
          'text-xs font-semibold px-3 py-1 rounded-full',
          user?.role === 'ADMIN' ? 'bg-sky-100 text-sky-700' : 'bg-zinc-100 text-zinc-600'
        ]"
      >
        {{ user?.role }}
      </span>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-zinc-800">{{ stats.total }}</p>
        <p class="text-xs text-gray-500 mt-1">Total</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-sky-600">{{ stats.inProgress }}</p>
        <p class="text-xs text-gray-500 mt-1">En cours</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-emerald-600">{{ stats.done }}</p>
        <p class="text-xs text-gray-500 mt-1">Terminées</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
        <p class="text-2xl font-bold text-gray-400">{{ stats.todo }}</p>
        <p class="text-xs text-gray-500 mt-1">À faire</p>
      </div>
    </div>

    <!-- Tasks -->
    <div>
      <h2 class="text-lg font-semibold text-zinc-800 mb-4">Mes tâches</h2>
      <div class="space-y-3">
        <Task
          v-for="(task, i) in mockTasks"
          :key="i"
          :title="task.title"
          :description="task.description"
          :status="task.status"
          :date="task.date"
        />
      </div>
    </div>

  </div>
</template>