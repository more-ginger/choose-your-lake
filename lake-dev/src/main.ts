import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import router from "./router";
import App from './App.vue';

import { createI18n } from "vue-i18n";
import en from './locales/en.json'
import de from './locales/de.json'

const i18n = createI18n({
legacy: false,
locale: "de",
fallbackLocale: 'en',
 globalInjection: true,
  messages: {
    en,
    de
  }
});

const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.use(i18n)
app.mount('#app')

// App.use(PrimeVue)
