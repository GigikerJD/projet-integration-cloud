<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useMutation } from "@tanstack/vue-query"
import { useAuthStore } from "../../stores/authStores"
import { registerApi } from "../../models/api.models"

const firstname = ref("")
const lastname = ref("")
const email = ref("")
const password = ref("")
const birthdate = ref("")
const role = ref<"ADMIN" | "CLIENT">("CLIENT")

const router = useRouter()
const authStore = useAuthStore()

const inputClasses =
  "peer w-full border-b-2 border-gray-300 bg-transparent px-0 pt-5 pb-1 text-sm focus:outline-none focus:border-zinc-800 placeholder-transparent"
const labelClasses =
  "absolute left-0 top-0 text-xs text-gray-500 transition-all duration-200 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-zinc-800"

const { mutate, isPending, error } = useMutation({
  mutationFn: registerApi,
  onSuccess: (data) => {
    authStore.login(data.token)
    router.push("/dashboard")
  },
})

const submit = () => {
  mutate({
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    password: password.value,
    birthdate: birthdate.value,
    role: role.value,
  })
}
</script>

<template>
  <form id="register-form" class="fade-in space-y-6" @submit.prevent="submit">
    <h2 class="text-xl font-semibold text-zinc-800">Créer un compte</h2>

    <p v-if="error" class="text-sm text-red-500">{{ error.message }}</p>

    <div class="flex flex-col sm:flex-row justify-between items-start gap-6">
      <div class="relative flex-1">
        <input
          type="text"
          id="register-form-firstname"
          v-model="firstname"
          placeholder=" "
          required
          :class="inputClasses"
        />
        <label for="register-form-firstname" :class="labelClasses">Prénom</label>
      </div>
      <div class="relative flex-1">
        <input
          type="text"
          id="register-form-lastname"
          v-model="lastname"
          placeholder=" "
          required
          :class="inputClasses"
        />
        <label for="register-form-lastname" :class="labelClasses">Nom</label>
      </div>
    </div>

    <div class="relative">
      <input
        type="date"
        id="register-birthdate-input"
        v-model="birthdate"
        required
        :class="inputClasses + ' pt-5'"
      />
      <label for="register-birthdate-input" class="absolute left-0 top-0 text-xs text-gray-500">
        Date de naissance
      </label>
    </div>

    <div class="relative">
      <input
        type="email"
        id="register-email-input"
        v-model="email"
        placeholder=" "
        required
        :class="inputClasses"
      />
      <label for="register-email-input" :class="labelClasses">Email</label>
    </div>

    <div>
      <p class="text-xs text-gray-500 mb-3">Statut</p>
      <div class="flex gap-3">
        <button
          type="button"
          @click="role = 'CLIENT'"
          :class="[
            'flex-1 py-2 text-sm rounded border transition-colors duration-200 cursor-pointer',
            role === 'CLIENT'
              ? 'bg-zinc-800 text-white border-zinc-800'
              : 'bg-white text-gray-400 border-gray-300 hover:border-zinc-500 hover:text-zinc-600'
          ]"
        >
          Client
        </button>
        <button
          type="button"
          @click="role = 'ADMIN'"
          :class="[
            'flex-1 py-2 text-sm rounded border transition-colors duration-200 cursor-pointer',
            role === 'ADMIN'
              ? 'bg-zinc-800 text-white border-zinc-800'
              : 'bg-white text-gray-400 border-gray-300 hover:border-zinc-500 hover:text-zinc-600'
          ]"
        >
          Admin
        </button>
      </div>
    </div>

    <div class="relative">
      <input
        type="password"
        id="register-password-input"
        v-model="password"
        placeholder=" "
        required
        :class="inputClasses"
      />
      <label for="register-password-input" :class="labelClasses">Mot de passe</label>
    </div>

    <button
      type="submit"
      :disabled="isPending"
      class="w-full py-2 px-4 bg-zinc-800 text-white text-sm rounded hover:bg-zinc-700 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {{ isPending ? "Inscription..." : "S'inscrire" }}
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