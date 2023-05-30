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
};
</script>

<template>
  <main>
    <header>
      <top-bar />
    </header>
    <home />
    <footer>
      <bottom-bar />
    </footer>
  </main>
</template>

<style>
main {
  width: 100%;
}
</style>
