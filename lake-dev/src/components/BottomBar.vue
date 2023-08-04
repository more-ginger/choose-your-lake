<script>
import { ref } from "vue";
  
export default {
  setup() {
    const isOpen = ref(false);
    return {
      isOpen
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
      <div class="inner-container">
        <p>How does it work?</p>
        <div class="open-footer-content" v-if="isOpen">
          <div class="legend">
            <h1>How to read the visualization</h1>
            <p>
              By using the dropdown menu, the default cylinder is replaced by the 3D representation of the selected lake.
              The model is scaled according to its real size and volume.
            <br/><br/>
              The height of the lakes encode volume: the lake's water capacity. If the lake capacity is insufficient 
              – i.e. its water volume cannot fulfil Berlin's daily consumption – another <b class="insufficient">red</b> lake is stacked on top of the first one.
              Stacking is repeated based on how many times the lake capacity is exceeded.
            </p>
          </div>
          <div class="context">
            <h1>Context</h1>
            <p>
              A method handler automatically receives the native DOM Event object 
              that triggers it - in the example above, we are able to access 
              the element dispatching the event via event.target.tagName.
            </p>
          </div>
          <div class="calculations">
            <h1>Calculations and data</h1>
            <p>
              Data on the daily water consumption of Berlin:
              Data on lakes' volume and shape: OpenStreetMap, <a href="wikidata.org">wikidata.org</a>
            </p>
            <p>
              To calculate lake capacity overshoot we divide the overall water consumption in Berlin 
              by the currently selected lake volume.
            </p>
          </div>
          <div class="credits">
            <h1>Credits</h1>
            <p>
              <strong>Concept:</strong> Anna Eschenbacher, Johanna Hartmann, Francesca Morini
            </p>
            <p>
              <strong>Design and code:</strong> Francesca Morini
            </p>
            <p>
              Thanks to Jona Pomerance, Fidel Thomet, Nadia Zeissig, Giacomo Nanni for the feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
</style>
