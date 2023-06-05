<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './Threejs-Canva.vue'
import { ref } from "vue";
// import AllLakes from 

const selectedLake = ref();

const allLakes = ref([
    { name: 'Hubertussee', code: 'Q1616489' },
    { name: 'Schäfersee', code: 'Q2258294' },
    { name: 'Plötzensee', code: 'Q541313' }
]);

export default {
  components: {
    Dropdown,
    ThreejsCanva
  },
  data () {
    return {
      allLakes,
      selectedLake,
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
        <div class="inner-title" v-if="selectedLake === undefined">
          <h1>00Mln M3 is the daily water consumption of Berliners.</h1>
        </div>
        <div class="inner-title" v-else>
          <h1>{{ selectedLake.name }}</h1>
        </div>
      </div>
      <div class="canvas-container">
        <div class="canvas-inner-container" ref="canvas-inner"> 
          <ThreejsCanva 
            v-if="mounted === true"
            :canvasWidth=canvasWidth 
            :canvasHeight=canvasHeight
            :selectedLake=selectedLake
          />
        </div>
      </div>
    </div>
    <div class="searchbar container-inner">
      <div class="search-bar">
        <Dropdown 
          v-model="selectedLake" 
          :options="allLakes" 
          optionLabel="name" 
          editable
          placeholder="Select a Lake" 
          class="w-full md:w-14rem" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
