<script>
import * as d3geo from 'd3-geo';
import mapboxgl from 'mapbox-gl';
import Lakes from '@/assets/data/berlin-bb-lakes.json';
import lakesVolume from '@/assets/data/lakes-water-volume.json';


Lakes.features.forEach((lake, l) => {
  // console.log(lakesVolume)
  if(
      lakesVolume[lake.properties.wikidata] !== undefined
      && lakesVolume[lake.properties.wikidata]["portability(m3)"] !== 'undefined'
    ) {
      lake.properties.volume = lakesVolume[lake.properties.wikidata]["portability(m3)"]
  } else {
    lake.properties.volume = "undefined"
  }
})

export default {
  name: 'LakeMap',
  setup() {
    const mapToken = import.meta.env['VITE_MAP_TOKEN']
    return  {
      mapToken
    }
  },
  data () {
    return {
      isMounted: false,
      isMap: true,
      Lakes,
      currentLake: '',
      currentVolume: 0,
      currentLakeID: undefined
    }
  },
  mounted() {
    // console.log('component is mounted', this.mapToken)
    mapboxgl.accessToken = this.mapToken
    
    this.map = new mapboxgl.Map({
      container: "mapContainer",
      style: "mapbox://styles/mapbox/light-v11",
      center: [13.404954, 52.520008],
      zoom: 10
    });

    this.map.on('load', () => {
        this.map.addSource('lakes', {
        type: 'geojson',
        data: this.Lakes
      });

      this.map.addLayer({
        'id': 'lake',
        'type': 'fill',
        'source': 'lakes',
        'paint': {
        'fill-color': ['match', ['get', 'volume'],
          'undefined', 'gray', 
          '#004590']
        }
      });

      this.map.on('click', 'lake', (e) => {
        const currentLakeCentroid = d3geo.geoPath().centroid(e.features[0].geometry)
        this.map.flyTo({
          center: currentLakeCentroid
        });

        while (Math.abs(e.lngLat.lng - currentLakeCentroid[0]) > 180) {
          currentLakeCentroid[0] += e.lngLat.lng > currentLakeCentroid[0] ? 360 : -360;
        }

        this.currentLakeID =  e.features[0].properties["wikidata"]
        this.currentLake = e.features[0].properties["name"]
        this.currentVolume = e.features[0].properties["volume"]
          
        new mapboxgl.Popup()
        .setLngLat(currentLakeCentroid)
        .setDOMContent(this.$refs.htmlPopup)
        .addTo(this.map);
      })

      this.map.on('mouseenter', 'lake', () => {
        this.map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change it back to a pointer when it leaves.
       this.map.on('mouseleave', 'lake', () => {
        this.map.getCanvas().style.cursor = '';
        });
    });
  },
    methods: {
    toggleMap(event) {
      if (event) {
        this.isMap = false
        this.$emit('onMapToggle', 
          {
            isMap: this.isMap, 
            lakeID: this.currentLakeID
          })
      }
    }
  },
  watch: {
    currentLakeID(newVal) {
      if (newVal !== undefined && newVal !== null) {
        this.$router.push(
          { query: 
            { 
              ...this.$router.currentRoute.value.query, 
              lake: newVal 
            } 
          });
      } else {
        this.$router.replace({'query': null});
      }
    }
  }
}
</script>

<template>
  <div class="map-container">
    <div class="inner-map-container" id="mapContainer">
      <div id="popup" ref="htmlPopup">
        <div class="innerPopup">
            <p>
              The volume of 
              <strong>{{currentLake}}</strong>
              is {{currentVolume}}Mln m<span class="super">3</span>.
            </p>
            <a v-on:click="toggleMap">Check out the model</a>
          </div>
      </div>
    </div>
  </div>
</template>
<style>
.mapboxgl-popup-content {
  max-width: 200px;
}

#popup {
  padding: 1rem;
}

.innerPopup > a {
  cursor: pointer;
}
</style>
