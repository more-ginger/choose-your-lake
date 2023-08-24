<script>
import Dropdown from 'primevue/dropdown';
import ThreejsCanva from './ThreejsCanva.vue'
import { ref } from "vue";
import lakesID from '@/assets/data/lakes-water-volume.json' 
import { useI18n } from 'vue-i18n';
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

// const { t } = useI18n();
// console.log(t)

export default {
  setup() {
        const { t } = useI18n();
        // console.log(t())
        console.log(t('message.greeting'))
        return { t }
      // then use it like t('message.greeting')
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
        <div>{{ t('message.greeting') }}</div>
        <div 
          class="inner-title" 
          v-if="selectedLake === undefined || selectedLake === null"
        >
        <h1>
          {{t('message.greeting')}} <b>{{consumptionLabel}} Tsd m<span class="super">3</span></b>
          of water every day.
        </h1>
        </div>
        <div class="inner-title" v-else>
          <h1>
            We would need <b :class="classOfConsumption">{{ currentConsumption < 0.1 ? "less than 0.1" : currentConsumption }} times</b> the volume of <b>{{ selectedLake.name }}&nbsp;</b> 
             to fulfil the daily water needs of Berlin.
          </h1>
        </div>
        <div class="additional-description" v-if="selectedLake === undefined || selectedLake === null">
          <p>
            Sounds like a lot, right? But how much is that, really?
            Select a Berlin/Brandenburg lake from the list below and see.
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
