<script>
import { ref } from "vue";
// import VueI18n from 'vue-i18n';
import { useI18n } from 'vue-i18n';


export default {
  setup() {
    const isOpen = ref(false);
    const { t } = useI18n();
    const { locale } = useI18n();
  
    
    return {
      isOpen,
      t,
      locale
    }
  },
  methods: {
    toggleFooter(event) {
      if (event) {
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
      <div :class="{'visible': isOpen}" class="close-button-container">
        <!-- <div class="close-icon"></div> -->
      </div>
      <div class="inner-container">
        <p>{{t('footer.footer-title')}}</p>
        <div class="open-footer-content" v-if="isOpen">
          <div class="legend">
            <h1>{{t('footer.title-par-1')}}</h1>
            <p>
              {{t('footer.par-1')}}
            <br/><br/>
              {{t('footer.par-1-1')}} 
              <b class="insufficient">{{t('footer.par-1-labelcolor')}}</b> 
              {{t('footer.par-1-2')}}
            </p>
          </div>
          <div class="context">
            <h1>{{t('footer.title-par-2')}}</h1>
            <p>
             {{t('footer.par-2')}}
            </p>
            <div class="light-mode">
            <div class="desktop-water-diagram">
            <img v-if="locale === 'en'" class="water-cycle" src="@/assets/img/data_diagram-EN.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            <img v-else class="water-cycle" src="@/assets/img/data_diagram-DE.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            </div>
            <div class="mobile-water-diagram">
            <img v-if="locale === 'en'" class="water-cycle" src="@/assets/img/data_diagram_mobile-EN.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            <img v-else class="water-cycle" src="@/assets/img/data_diagram_mobile-DE.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            </div>
            </div>
            <div class="dark-mode">
            <div class="desktop-water-diagram">
            <img v-if="locale === 'en'" class="water-cycle" src="@/assets/img/data_diagram-DARK_EN.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            <img v-else class="water-cycle" src="@/assets/img/data_diagram-DARK_DE.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            </div>
            <div class="mobile-water-diagram">
            <img v-if="locale === 'en'" class="water-cycle" src="@/assets/img/data_diagram_mobile-DARK_EN.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            <img v-else class="water-cycle" src="@/assets/img/data_diagram_mobile-DARK_DE.svg" alt="The image shows the water cycle through a circular diagram. At the top five circles represent the challenges we face in depleting our water supply: extreme weather events, sealed ground, water conservation, population growth, and further challenges. At the bottom we find two elements that are both influenced by these challenges: on the left the groundwater level, on the right the water consumption."/>
            </div>
            </div>
            <p>
             {{t('footer.par-2-3')}}
            </p>
            <div class="light-mode">
            <img v-if="locale === 'en'" class="water-measurement" src="@/assets/img/water-measurement-EN.png" alt="The graphic shows a flow with different colors arranged on a timeline covering from the 1800 to 2022. The blue flow shows positive measurement of ground water supply, the red flow shows negative measurements. Over time it is possible to appreciate a decline of the ground water: the flow starts to be increasingly red."/>
            <img v-else class="water-measurement" src="@/assets/img/water-measurement-DE.png" alt="The graphic shows a flow with different colors arranged on a timeline covering from the 1800 to 2022. The blue flow shows positive measurement of ground water supply, the red flow shows negative measurements. Over time it is possible to appreciate a decline of the ground water: the flow starts to be increasingly red."/>
            </div>
            <div class="dark-mode">
            <img v-if="locale === 'en'" class="water-measurement" src="@/assets/img/water-measurement-DARK_EN.png" alt="The graphic shows a flow with different colors arranged on a timeline covering from the 1800 to 2022. The blue flow shows positive measurement of ground water supply, the red flow shows negative measurements. Over time it is possible to appreciate a decline of the ground water: the flow starts to be increasingly red."/>
            <img v-else class="water-measurement" src="@/assets/img/water-measurement-DARK_DE.png" alt="The graphic shows a flow with different colors arranged on a timeline covering from the 1800 to 2022. The blue flow shows positive measurement of ground water supply, the red flow shows negative measurements. Over time it is possible to appreciate a decline of the ground water: the flow starts to be increasingly red."/>
            </div>
            <p>
             {{t('footer.par-2-4')}}
            </p>
          </div>
          <div class="calculations">
            <h1>{{t('footer.title-par-3')}}</h1>
            <p>
              {{t('footer.par-3')}} <a href="wikidata.org">wikidata.org</a>
            </p>
            <p>
               {{t('footer.par-3-2')}}
            </p>
          </div>
          <div class="credits">
            <h1>{{t('footer.title-par-4')}}</h1>
            <p>
              <strong>{{t('footer.concept')}}</strong> Anna Eschenbacher, Johanna Hartmann, Francesca Morini
            </p>
            <p>
              <strong>{{t('footer.design')}}</strong> Francesca Morini, Anna Eschenbacher
            </p>
            <p>
              {{t('footer.feedback')}}
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
