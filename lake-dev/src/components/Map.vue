<script>
import mapboxgl from 'mapbox-gl';
import Lakes from '@/assets/data/berlin-bb-lakes.json';
import lakesVolume from '@/assets/data/lakes-water-volume.json';


Lakes.features.forEach((lake, l) => {
  if(
      lakesVolume[lake.properties.wikidata] 
      && lakesVolume[lake.properties.wikidata]["portability(m3)"] !== 'undefined'
    ) {
    lake.properties.volume = lake.properties.wikidata["portability(m3)"]
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
      Lakes
    }
  },
  mounted() {
    // console.log('component is mounted', this.mapToken)
    mapboxgl.accessToken = this.mapToken
    
    this.map = new mapboxgl.Map({
      container: "mapContainer",
      style: "mapbox://styles/mapbox/light-v11",
      center: [13.404954, 52.520008],
      zoom: 8
    });

    this.map.on('load', () => {
        this.map.addSource('lakes', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: this.Lakes
      });

      this.map.addLayer({
        'id': 'earthquakes-layer',
        'type': 'fill',
        'source': 'lakes',
        'paint': {
        'fill-color': ['match', ['get', 'volume'],
          'undefined', 'gray', 
          '#004590']
        }
      });
    });

    console.log(this.map)
  }
}
</script>

<template>
  <div class="map-container">
    <div class="inner-map-container" id="mapContainer">
    </div>
  </div>
</template>
