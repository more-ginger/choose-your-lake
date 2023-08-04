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
    resetModel(event) {
      if (event) {
        // console.log(this.isOpen)
        this.$router.replace({'query': null});
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
          <li @click="resetModel">
            <!-- <a @click="toggleMap">See it on the map</a> -->
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
