<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './ThreejsCanva.vue'
import { ref } from "vue";
import lakesID from '@/assets/data/lakes-water-volume.json' 

// const eventHub = new Vue();

const selectedLake = ref();
const lakesArray = [];
const lakesKeys = Object.keys(lakesID)

lakesKeys.forEach(id => {
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
    footerActive: Boolean,
    lakeIDFromMap: String
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
  mounted () {
    if (this.lakeIDFromMap !== undefined) {
      const filterResult = sortedLakesArray.filter(lake => lake.id === this.lakeIDFromMap)
      this.selectedLake = filterResult[0]
    }

    this.getContainerSizes()
    this.mounted = true    
  },
  computed: {
    answerLabel() {
      return this.currentConsumption >= 1 ? 'No' : 'Yes'
    },
    consumptionLabel() {
      return Math.trunc(this.dailyWaterConsumption / 1000)
    }
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
    lakeIDFromMap(newVal) {
      console.log('in watch', this.lakesID[newVal])
    },
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
        <div class="additional-description">
        <p>
          That's a lot of water! What if we wouldn't be able to use groundwater anymore?
          Would the lakes of Berlin keep up with our daily consumption?
        </p>
       </div>
        <div 
          class="inner-title" 
          v-if="selectedLake === undefined || selectedLake === null"
        >
        <h1>
          Berliners consume
          {{consumptionLabel}} Tsd m<span class="super">3</span> 
          of water each day.
        </h1>
        </div>
        <div class="inner-title" v-else>
          <h1>
            {{answerLabel}}, we would need 
            {{ currentConsumption }} times a day the volume of 
            {{ selectedLake.name }} to fulfil it.
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
