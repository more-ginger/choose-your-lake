<script>
import { ref } from "vue";

export default {
  name:'TopBar',
  setup() {
    const isMap = ref(false);
    return {
      isMap
    }
  },
  methods: {
    toggleMap(event) {
      if (event) {
        // console.log(this.isOpen)
        this.isMap = !this.isMap
        console.log(this.isMap)
        this.$emit('onMapToggle', this.isMap)
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="inner-container">
      <nav class="top-menu">
        <ul>
          <li><a @click="toggleMap">Map</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>
