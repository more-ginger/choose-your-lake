<script>
import Home from "./components/Home.vue";
import TopBar from "./components/TopBar.vue";
import BottomBar from "./components/BottomBar.vue";


export default {
  components: {
    Home,
    TopBar,
    BottomBar,
  },
  data () {
    return {
      footerActive: false
    }
  },
  methods: {
    updateClass(value) {
      // console.log(value)
      this.footerActive = value
    }
  }
};
</script>

<template>
  <main>
    <header >
      <top-bar />
    </header>
    <Home :footerActive="footerActive"/>
    <bottom-bar @onFooterChange="updateClass"/>
  </main>
</template>

<style>
main {
  width: 100%;
}
</style>
