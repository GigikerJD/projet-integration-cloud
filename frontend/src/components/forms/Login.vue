<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useMutation } from "@tanstack/vue-query"
import { useAuthStore } from "../../stores/authStores"
import { loginApi } from "../../models/api.models"

const email = ref("")
const password = ref("")

const router = useRouter()
const authStore = useAuthStore()

const inputClasses =
  "peer w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-1 text-sm focus:outline-none focus:border-zinc-800 placeholder-transparent"
const labelClasses =
  "absolute left-0 top-0 text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-zinc-800"

const { mutate, isPending, error } = useMutation({
  mutationFn: loginApi,
  onSuccess: (data) => {
    authStore.login(data.token)
    router.push("/dashboard")
  },
})

const submit = () => {
  mutate({ email: email.value, password: password.value })
}
</script>

<template>
  <form id="login-form" class="fade-in space-y-6" @submit.prevent="submit">
    <h2 class="text-xl font-semibold text-zinc-800">Se connecter</h2>

    <p v-if="error" class="text-sm text-red-500">{{ error.message }}</p>

    <div class="relative">
      <input
        type="email"
        id="login-email-input"
        v-model="email"
        placeholder=" "
        required
        :class="inputClasses"
      />
      <label for="login-email-input" :class="labelClasses">Email</label>
    </div>

    <div class="relative">
      <input
        type="password"
        id="login-password-input"
        v-model="password"
        placeholder=" "
        required
        :class="inputClasses"
      />
      <label for="login-password-input" :class="labelClasses">Mot de passe</label>
    </div>

    <button
      type="submit"
      :disabled="isPending"
      class="w-full py-2 px-4 bg-zinc-800 text-white text-sm rounded hover:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {{ isPending ? "Connexion..." : "Se connecter" }}
    </button>
  </form>
</template>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>