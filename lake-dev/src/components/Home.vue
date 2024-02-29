<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './ThreejsCanva.vue'
import { ref } from "vue";
import lakesID from '@/assets/data/lakes-water-volume.json' 
import LakesData from '@/assets/data/berlin-bb-lakes.json'
import * as d3geo from 'd3-geo';
import { useI18n } from 'vue-i18n';

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

// const { t } = useI18n();
// console.log(t)

export default {
  setup() {
        const { t } = useI18n();
        // console.log(t())
        // console.log(t('message.greeting'))
        let selectionPlaceholder = t('dropdown.selection-label')
        let quantityPlaceholder = t('lake.quantity')
        return { t, selectionPlaceholder, quantityPlaceholder }
      // then use it like t('message.greeting')
  },
  metaInfo: {
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
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
      LakesData,
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
    classOfConsumption() {
      return this.currentConsumption > 1 ? 'insufficient' : 'sufficient'
    },
    consumptionLabel() {
      return Math.trunc(this.dailyWaterConsumption / 1000)
    },
    lakeCoords () {
      const currentLake = this.LakesData.features.filter((a,b) => a.properties.wikidata === this.selectedLake.id)
      const currentLakeCentroid = d3geo.geoPath().centroid(currentLake[0].geometry)
      const lat = Math.round(currentLakeCentroid[0] * 100000) / 100000
      const lon = Math.round(currentLakeCentroid[1] * 100000) / 100000
      // const url = `http://www.google.com/maps/place/${currentLakeCentroid}`
      // console.log(currentLakeCentroid)
      return {lakeUrl: `${currentLakeCentroid[1]}, ${currentLakeCentroid[0]}`, label: `${lat}, ${lon}`}
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
    }, 
    '$i18n.locale': function(lan){
      this.selectionPlaceholder = this.t('dropdown.selection-label')
      this.quantityPlaceholder = this.t('lake.quantity')
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
        <h1>
          {{t('home.paragraph-one')}} <b>{{consumptionLabel}} {{t('home.unit')}} m<span class="super">3</span></b>
          {{t('home.paragraph-two')}}
        </h1>
        </div>
        <div class="inner-title" v-else>
          <h1>
            {{t('lake.par-1')}} 
            <b :class="classOfConsumption">
              {{ currentConsumption < 0.1 ? quantityPlaceholder : currentConsumption }} 
              {{t('lake.par-timelabel')}}</b> {{t('lake.par-1-2')}} 
              <b>{{ selectedLake.name }}</b>{{t('lake.par-1-3')}}.
          </h1>
        </div>
        <div class="additional-description">
          <p v-if="selectedLake === undefined || selectedLake === null">
            {{t('home.description')}}
          </p>
          <p class="lake-description" v-else>
             <span>{{t('lake.volume')}} {{selectedLake.volume}} m<span class="super">3</span></span> 
             <span>{{t('lake.location')}} <a :href="`http://www.google.com/maps/place/${lakeCoords.lakeUrl}`">
              {{ lakeCoords.label }} &#8594;
            </a></span>
          </p>
       </div>
      </div>
    </div>
    <div class="searchbar container-inner">
      <div class="search-bar">
        <Dropdown 
          v-model="selectedLake" 
          :options="allLakes" 
          optionLabel="name" 
          :placeholder="selectionPlaceholder" 
          class="w-full md:w-14rem" 
          showClear
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
