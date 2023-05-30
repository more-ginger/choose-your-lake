<script setup>
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="home container">
    <div class="graphic container-inner">
      <div class="title">
        <div class="inner-title">
          <h1>00Mln M3 is the daily water consumption of Berliners.</h1>
        </div>
      </div>
      <div class="canvas-container">
        <canvas></canvas>
      </div>
    </div>
    <div class="searchbar container-inner">
      <div class="search-bar">
        <input type="text" placeholder="Choose a lake" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
