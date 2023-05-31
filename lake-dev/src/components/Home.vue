<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './Threejs-Canva.vue'
import { ref } from "vue";

const selectedCity = ref();

const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

export default {
  components: {
    Dropdown,
    ThreejsCanva
  },
  data () {
    return {
      cities,
      selectedCity,
      canvasWidth: 0,
      canvasHeight: 0,
      mounted: false
    }
  },
  mounted () {
    this.getContainerSizes()
    this.mounted = true
  },
  methods: {
    getContainerSizes(){
      this.canvasWidth = this.$refs['canvas-inner'].clientWidth
      this.canvasHeight = this.$refs['canvas-inner'].clientHeight
    }
  }
}

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
        <div class="canvas-inner-container" ref="canvas-inner"> 
          <ThreejsCanva 
            v-if="mounted === true"
            :canvasWidth=canvasWidth 
            :canvasHeight=canvasHeight
          />
        </div>
      </div>
    </div>
    <div class="searchbar container-inner">
      <div class="search-bar">
        <Dropdown 
          v-model="selectedCity" 
          :options="cities" 
          optionLabel="name" 
          placeholder="Select a Lake" 
          class="w-full md:w-14rem" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
