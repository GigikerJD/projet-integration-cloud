<script setup lang="ts">
import { useRoute } from "vue-router";
import Footer from "./Footer.vue";
import Header from "./Header.vue";
import { computed } from "vue";

const route = useRoute();
const withContent = computed(() => route.meta.withContent === true) 
</script>

<template>
  <main v-if="!withContent" id="layout-container">
    <router-view/>
  </main>
  <div v-else id="layout-container" class="flex flex-col min-h-screen">
    <Header />
    <main id="layout-container-main" class="flex-1 relative">
      <router-view />
    </main>
    <Footer />
  </div>
</template>