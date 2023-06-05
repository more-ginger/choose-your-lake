<script>
import * as THREE from 'three'
import Lakes from '@/assets/data/berlin-bb-lakes.json'

export default {
    props: {
        canvasWidth: Number,
        canvasHeight: Number,
        selectedLake: Object
    },
    data() {
        return {
            currentLake: '',
            LakesFeatures: Lakes.features
        }
    },
    computed: {
        lakeFeature () {
            let feature = {}
            if (this.currentLake !== '') {
                this.LakesFeatures.forEach(el => {
                    if (el.properties.name === this.currentLake) {
                        feature = el
                    }
                })
            }
            return feature
        }
    },
    mounted() {
        this.init(0xff0000)
        this.animate()
        console.log('i am mounted')
        this.$refs.canvas.appendChild(this.renderer.domElement)
    },
    updated () {
        console.log('i am in updated', this.lakeFeature.properties.name)
        this.$refs.canvas.removeChild(this.renderer.domElement)
        this.init(0x00d4ff)
        // this.animate() don't I have to run animate again???
        this.$refs.canvas.appendChild(this.renderer.domElement)
    }, 
    methods: {
        init(color) {
            this.scene = new THREE.Scene()
            this.camera = new THREE.PerspectiveCamera(
                80,
                window.innerWidth / window.innerHeight,
                0.1,
            )
            
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true })
            this.light = new THREE.DirectionalLight(0xcff1ff, 1)
            this.geometry = new THREE.BoxGeometry(2, 4, 2)

            const material = new THREE.MeshPhysicalMaterial({
                color: color,
                metalness: 0,
                roughness: 0.7,
                transmission: 0.5,
                thickness: 0.5
            })
            
            this.cube = new THREE.Mesh(this.geometry, material)
            // this.cube.rotation.x = 2;

            this.scene.add(this.camera)
            this.scene.add(this.light)
            this.scene.add(this.cube)
            this.renderer.setSize(this.canvasWidth, this.canvasHeight)
            this.light.position.set(0, 5, 10)
            this.camera.position.z = 5
        },
        animate: function() {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            this.cube.rotation.y += 0.005
        }
    },
    watch: {
        selectedLake(newVal, oldVal) {
            this.currentLake = newVal.name
            console.log(this.currentLake, this.lakeFeature)
        }
    }
}

</script>

<template>
    <div id="canvas" ref="canvas">
        <!-- <span>{{ lakeFeature }}</span> -->
        <div id="blur-background"></div>
    </div>
</template>

<style></style>