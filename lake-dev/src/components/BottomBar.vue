<script>
import { ref } from "vue";
  
export default {
  setup() {
    const isOpen = ref(false);
    // function toggleFooter(event) {
    //   if (event) {
    //     isOpen = ref(!isOpen.value)
    //     console.log('isOpen', isOpen.value)
    //   }
    // }
    return {
      isOpen
      // toggleFooter
    }
  },
  methods: {
    toggleFooter(event) {
      if (event) {
        // console.log(this.isOpen)
        this.isOpen = !this.isOpen
        this.$emit('onFooterChange', this.isOpen)
      }
    }
  }
}
</script>
<template>
  <footer 
    :class="{'opened-footer': isOpen}" 
    @click="toggleFooter"
  >
    <div class="container">
      <div class="inner-container">
        <p>How does it work?</p>
        <div class="open-footer-content" v-if="isOpen">
          <div>
            <h1>Data</h1>
            <p>
              A method handler automatically receives the native DOM Event object 
              that triggers it - in the example above, we are able to access the 
              element dispatching the event via event.target.tagName.
            </p>
          </div>
          <div>
            <h1>Calculations</h1>
            <p>
              A method handler automatically receives the native DOM Event object 
              that triggers it - in the example above, we are able to access 
              the element dispatching the event via event.target.tagName.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
