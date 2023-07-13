<script>
import Home from "./components/Home.vue";
import LakesMap from "./components/Map.vue";
import TopBar from "./components/TopBar.vue";
import BottomBar from "./components/BottomBar.vue";


export default {
  components: {
    Home,
    LakesMap,
    TopBar,
    BottomBar,
  },
  data () {
    return {
      footerActive: false,
      isMap: false
    }
  },
  methods: {
    updateClass(value) {
      this.footerActive = value
    },
    updateMapStatus(value) {
      this.isMap = value
    }
  }
};
</script>

<template>
  <main>
    <header >
      <top-bar @onMapToggle="updateMapStatus"/>
    </header>
    <Home :footerActive="footerActive" v-if="isMap === false"/>
    <lakes-map v-if="isMap"/>
    <bottom-bar @onFooterChange="updateClass"/>
  </main>
</template>

<style>
main {
  width: 100%;
}
</style>
