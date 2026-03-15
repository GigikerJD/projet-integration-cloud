<script setup lang="ts">
import { computed } from "vue"
import { useQuery } from "@tanstack/vue-query"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/authStores"
import { getUserApi, decodeToken } from "../models/api.models"

const store = useAuthStore()
const router = useRouter()

const userId = computed(() => {
  if (!store.getToken) return ""
  return decodeToken(store.getToken).id
})

const { data: user, isPending, isError } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUserApi(userId.value, store.getToken!),
  enabled: computed(() => !!userId.value),
})

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })

const handleLogout = () => {
  store.logout()
  router.push("/")
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-6 py-10 space-y-8">

    <div>
      <h1 class="text-2xl font-bold text-zinc-800">Paramètres</h1>
      <p class="text-sm text-gray-500 mt-1">Informations de votre compte.</p>
    </div>

    <!-- Skeleton -->
    <div v-if="isPending" class="space-y-4">
      <div v-for="n in 5" :key="n" class="h-14 bg-gray-100 rounded-xl animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="isError" class="text-sm text-red-500">
      Impossible de charger le profil.
    </div>

    <!-- Profile -->
    <div v-else class="space-y-6">

      <!-- Avatar + role -->
      <div class="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div class="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xl font-bold shrink-0">
          {{ user?.firstname?.charAt(0).toUpperCase() }}{{ user?.lastname?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <p class="font-semibold text-zinc-800">{{ user?.firstname }} {{ user?.lastname }}</p>
          <span
            :class="[
              'text-xs font-medium px-2.5 py-0.5 rounded-full mt-1 inline-block',
              user?.role === 'ADMIN' ? 'bg-sky-100 text-sky-700' : 'bg-zinc-100 text-zinc-600'
            ]"
          >
            {{ user?.role }}
          </span>
        </div>
      </div>

      <!-- Fields -->
      <div class="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-50">
        <div class="flex justify-between items-center px-5 py-4">
          <span class="text-xs text-gray-400 uppercase tracking-wide">Prénom</span>
          <span class="text-sm text-zinc-800 font-medium">{{ user?.firstname }}</span>
        </div>
        <div class="flex justify-between items-center px-5 py-4">
          <span class="text-xs text-gray-400 uppercase tracking-wide">Nom</span>
          <span class="text-sm text-zinc-800 font-medium">{{ user?.lastname }}</span>
        </div>
        <div class="flex justify-between items-center px-5 py-4">
          <span class="text-xs text-gray-400 uppercase tracking-wide">Email</span>
          <span class="text-sm text-zinc-800 font-medium">{{ user?.email }}</span>
        </div>
        <div class="flex justify-between items-center px-5 py-4">
          <span class="text-xs text-gray-400 uppercase tracking-wide">Date de naissance</span>
          <span class="text-sm text-zinc-800 font-medium">{{ user?.birthdate ? formatDate(user.birthdate) : '—' }}</span>
        </div>
        <div class="flex justify-between items-center px-5 py-4">
          <span class="text-xs text-gray-400 uppercase tracking-wide">Membre depuis</span>
          <span class="text-sm text-zinc-800 font-medium">{{ user?.createdAt ? formatDate(user.createdAt) : '—' }}</span>
        </div>
      </div>

      <!-- Logout -->
      <div class="pt-2">
        <button
          type="button"
          @click="handleLogout"
          class="w-full py-2.5 text-sm text-red-600 border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
        >
          Se déconnecter
        </button>
      </div>

    </div>
  </div>
</template>