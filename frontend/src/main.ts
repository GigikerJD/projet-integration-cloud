import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia';
import router from './config/router';
import { VueQueryPlugin } from '@tanstack/vue-query';

const pinia = createPinia();

createApp(App)
    .use(router)
    .use(pinia)
    .use(VueQueryPlugin)
    .mount('#app')