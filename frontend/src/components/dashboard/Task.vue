<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  status?: "todo" | "in-progress" | "done"
  date?: string
}>()

const statusConfig = {
  "todo":        { label: "À faire",   classes: "bg-gray-100 text-gray-600" },
  "in-progress": { label: "En cours",  classes: "bg-sky-100 text-sky-700" },
  "done":        { label: "Terminé",   classes: "bg-emerald-100 text-emerald-700" },
}
</script>

<template>
  <div class="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow transition-shadow">
    <div class="flex-1 min-w-0">
      <h3 class="text-sm font-medium text-zinc-800 truncate">{{ title }}</h3>
      <p v-if="description" class="text-xs text-gray-500 mt-1 line-clamp-2">{{ description }}</p>
      <p v-if="date" class="text-xs text-gray-400 mt-2">{{ date }}</p>
    </div>
    <span
      v-if="status"
      :class="['text-xs px-2.5 py-1 rounded-full font-medium ml-4 shrink-0', statusConfig[status].classes]"
    >
      {{ statusConfig[status].label }}
    </span>
  </div>
</template>