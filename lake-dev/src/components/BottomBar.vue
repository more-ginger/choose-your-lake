<script>
import { ref } from "vue";
import { useI18n } from 'vue-i18n';
  
export default {
  setup() {
    const isOpen = ref(false);
    const { t } = useI18n();

    return {
      isOpen,
      t
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
              <strong>{{t('footer.design')}}</strong> Francesca Morini
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
