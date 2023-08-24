import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from "primevue/config";
import router from "./router";
import App from './App.vue';

import { createI18n } from "vue-i18n";

const i18n = createI18n({
legacy: false,
locale: "en",
fallbackLocale: 'en',
 globalInjection: true,
  messages: {
    en: {
      message: {
        language: "English",
        greeting: "Hello !"
      }
    },
    ar: {
      message: {
        language: "العربية",
        greeting: "السلام عليكم"
      }
    },
    es: {
      message: {
        language: "Español",
        greeting: "Hola !"
      }
    }
  }
});

const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.use(i18n)
app.mount('#app')

// App.use(PrimeVue)
