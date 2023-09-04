<script>
import { ref } from "vue";
// import { i18n } from "@src/main.ts";

export default {
  name:'TopBar',
  setup() {
    const isMap = ref(false);
    return {
      isMap
    }
  },
  methods: {
    resetModel(event) {
      if (event) {
        // console.log(this.isOpen)
        this.$router.replace({'query': null});
      }
    },
    changeLocaleLanguage(lang) {
      this.$i18n.locale = lang
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="inner-container">
      <nav class="top-menu">
        <ul>
          <li class="logo" @click="resetModel">
            <!-- <a @click="toggleMap">See it on the map</a> -->
          </li>
          <language-container>
          <li class="language" :class="$i18n.locale === 'en'? 'en-active': ''" @click="changeLocaleLanguage('en')">EN</li>
          <li class="language">|</li>
          <li class="language" :class="$i18n.locale === 'de'? 'de-active': ''" @click="changeLocaleLanguage('de')">DE</li>
          </language-container>
        </ul>
      </nav>
    </div>
  </div>
</template>
