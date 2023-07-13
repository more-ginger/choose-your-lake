<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './ThreejsCanva.vue'
import { ref } from "vue";
import lakesID from '@/assets/data/lakes-water-volume.json' 

// const eventHub = new Vue();

const selectedLake = ref();
const lakesArray = [];
const lakesKeys = Object.keys(lakesID)

const lakes = lakesKeys.forEach(id => {
  const currentLake = lakesID[id]
  if (lakesID[id]['portability(m3)'] !== "undefined") {
      lakesArray.push({
    "name":currentLake.name,
    "id": id,
    "volume": currentLake['portability(m3)']
  })
  }
})

const sortedLakesArray = lakesArray.sort((a, b) => a.name.localeCompare(b.name))
const allLakes = ref(sortedLakesArray)

export default {
  props: {
    footerActive: Boolean
  },
  components: {
    Dropdown,
    ThreejsCanva
  },
  data () {
    return {
      lakesID,
      allLakes,
      selectedLake,
      canvasWidth: 0,
      canvasHeight: 0,
      mounted: false,
      dailyWaterConsumption: 578849.3,
      currentConsumption: 0,
      isBlurred: false
    }
  },
  computed: {
    // selectedLake: {
    //   get() {
    //     return selectedLake === undefined ? '' : selectedLake 
    //   },
    //   set(value) {
    //     this.$router.replace({  
    //       query: {
    //         ...this.$route.query,
    //         your_query_param: value.id
    //       }
    //     })
    //   }
    // }
  },
  mounted () {
    this.getContainerSizes()
    this.mounted = true

    console.log(this.selectedLake)
  },
  methods: {
    getContainerSizes(){
      this.canvasWidth = this.$refs['canvas-inner'].clientWidth
      this.canvasHeight = this.$refs['canvas-inner'].clientHeight
    },
    updateConsumption(value) {
      this.currentConsumption = value 
    }
  },
  watch: {
    selectedLake(newVal) {
      if (newVal !== undefined && newVal !== null) {
        this.$router.push(
          { query: 
            { 
              ...this.$router.currentRoute.value.query, 
              lake: newVal.id 
            } 
          });
      } else {
        this.$router.replace({'query': null});
      }
    },
    '$route.query.lake': function(val){
      // very inelegant solution to pass a proxy target, maybe change?
      const lakeId = this.allLakes.filter(el => el.id === val)
      const stringifyLakeId = JSON.parse(JSON.stringify(lakeId))
      this.selectedLake = stringifyLakeId[0]
    }
  }
}

</script>

<template>
  <div 
    class="home container" 
    :class="{'blurred-container': footerActive}"
  >
    <div class="graphic container-inner">
      <div class="canvas-container">
        <div class="canvas-inner-container" ref="canvas-inner"> 
          <ThreejsCanva 
            v-if="mounted === true"
            :canvasWidth=canvasWidth 
            :canvasHeight=canvasHeight
            :selectedLake="selectedLake === null ? undefined : selectedLake"
            :dailyWaterConsumption=dailyWaterConsumption
            @onChangeConsumption="updateConsumption"
          />
        </div>
      </div>
            <div class="title">
        <div 
          class="inner-title" 
          v-if="selectedLake === undefined || selectedLake === null"
        >
        <h1>{{dailyWaterConsumption}} Mln m<span class="super">3</span> is the water consumed daily by Berliners.</h1>
        </div>
        <div class="inner-title" v-else>
          <h1>
            It would take {{ currentConsumption }} times a day the volume of {{ selectedLake.name }} to fulfil it.
          </h1>
        </div>
      </div>
    </div>
    <div class="searchbar container-inner">
      <div class="search-bar">
        <Dropdown 
          v-model="selectedLake" 
          :options="allLakes" 
          optionLabel="name" 
          placeholder="Select a Lake" 
          class="w-full md:w-14rem" 
          showClear
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
