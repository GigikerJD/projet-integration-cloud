<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import Login from "../components/forms/Login.vue";
import Register from "../components/forms/Register.vue";

const router = useRouter();
const goHome = () => router.push('/')

const currentForm = ref<"login" | "register">("login");
const switchForm = () => {
  currentForm.value = currentForm.value === "login" ? "register" : "login"
}
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-screen w-full overflow-y-auto p-6 bg-linear-to-br from-sky-600 via-sky-800 via-30% to-zinc-900">
    <div class="max-w-xl w-full bg-white rounded-xl shadow-md overflow-hidden">

      <!-- Tabs -->
      <div class="flex border-b border-gray-200">
        <button
          type="button"
          @click="currentForm = 'login'"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors duration-200',
            currentForm === 'login'
              ? 'text-zinc-800 border-b-2 border-zinc-800'
              : 'text-gray-400 hover:text-zinc-600'
          ]"
        >
          Se connecter
        </button>
        <button
          type="button"
          @click="currentForm = 'register'"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors duration-200',
            currentForm === 'register'
              ? 'text-zinc-800 border-b-2 border-zinc-800'
              : 'text-gray-400 hover:text-zinc-600'
          ]"
        >
          Créer un compte
        </button>
      </div>

      <!-- Form -->
      <div class="p-8">
        <Login v-if="currentForm === 'login'" />
        <Register v-else />
      </div>

      <!-- Footer switch -->
      <div class="px-8 pb-6 text-center text-sm text-gray-400">
        <span v-if="currentForm === 'login'">
          Pas encore de compte ?
          <button type="button" @click="switchForm" class="text-zinc-700 font-medium hover:underline cursor-pointer">
            S'inscrire
          </button>
        </span>
        <span v-else>
          Déjà un compte ?
          <button type="button" @click="switchForm" class="text-zinc-700 font-medium hover:underline cursor-pointer">
            Se connecter
          </button>
        </span>
        <div class="flex justify-end items-center">
          <button
            type="button"
            @click="goHome()"
            :class="{
              'rounded p-2 shadow drop-shadow font-semibold cursor-pointer transition-all duration-300': true,
              'hover:shadow-xl hover:drop-shadow-xl bg-zinc-800 text-white': true
            }"
          >
            Revenir
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
