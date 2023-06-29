<script>
import * as THREE from 'three'
import * as d3geo from 'd3-geo'
import * as scale from 'd3-scale'
import Lakes from '@/assets/data/berlin-bb-lakes.json'

export default {
    // emits: ['update:changeConsumption'],
    props: {
        canvasWidth: Number,
        canvasHeight: Number,
        selectedLake: Object,
        dailyWaterConsumption: Number
    },
    data() {
        return {
            currentLake: '',
            currentLakeID: '',
            LakesFeatures: Lakes.features,
            contenxt: '',
            currentLakeVolume: 0
        }
    },
    computed: {
        lakeFeature () {
            let feature = {}
            if (this.currentLakeID !== '') {
                this.LakesFeatures.forEach(el => {
                    if (el.properties.wikidata === this.currentLakeID) {
                        console.log(el.properties.wikidata)
                        feature = el
                    }
                })
            }

            return feature
        },
        waterConsumption () {
            const {dailyWaterConsumption, currentLakeVolume} = this
            // console.log()
            const currentConsumption = dailyWaterConsumption /  currentLakeVolume
            const currentConsumptionPretty = currentConsumption.toFixed(1)
            this.$emit('onChangeConsumption', currentConsumptionPretty)
            return currentConsumption
        },
        consumptionScale () {
            const domain = [0, this.dailyWaterConsumption]
            const range = [0, 1]
            const consumptionScale = scale.scaleLinear().domain(domain).range(range)
            // Define scale based on mix and max volume, 
            // with max being daily consumption
            return consumptionScale
        }
    },
    mounted() {
        this.context = 'mounted'
        this.init()
        this.animate()
        // console.log('i am mounted')
        this.$refs.canvas.appendChild(this.renderer.domElement)
    },
    updated () {
        // console.log('i am in updated', this.lakeFeature.properties.name)
        this.context = 'updated'
        this.$refs.canvas.removeChild(this.renderer.domElement)
        this.init(this.lakeFeature)
        // this.animate() don't I have to run animate again???
        this.$refs.canvas.appendChild(this.renderer.domElement)
    }, 
    methods: {
        init(lakePath) {
            
            this.scene = new THREE.Scene()
            //camera
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
            )
            
            //rendered
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true })
            this.light = new THREE.DirectionalLight(0xFFFBE6, 0.8)

            // const sphereSize = 1;
            // const lightHelper = new THREE.DirectionalLightHelper(this.light, sphereSize);
            // // add the point light helper to the scene
            // this.scene.add(lightHelper);

            //scene
            this.scene.add(this.camera)
            this.scene.add(this.light)
            this.renderer.setSize(this.canvasWidth, this.canvasHeight)
            this.light.position.set(-1, 2, 5)
            this.light.rotation.z = Math.PI / 4
            this.camera.position.z = 10 
            // this.camera.position.y = 1

            const material = new THREE.MeshPhysicalMaterial({
                color: 0x00d4ff,
                metalness: 0,
                roughness: 0.7,
                transmission: 0.5,
                thickness: 0.5
            })

            console.log("initiation done");

            //decide which shape should be added
            if (lakePath) {  
                console.log(this.consumptionScale)      
                this.camera.position.z = 1.5
                this.buildShape(lakePath, material)
            } else {
                console.log('default to cube')
                this.geometry = new THREE.BoxGeometry(2, 4, 2)       
                this.cube = new THREE.Mesh(this.geometry, material)
                this.scene.add(this.cube)
            }
        },
        animate: function(lakePath) {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            // console.log(lakePath)
            if (this.context !== 'mounted') {
                this.lakeShape.rotation.z += 0.005
                this.defaultLakeShape.rotation.z += 0.005
            } else {
                this.cube.rotation.y += 0.005
            }
            
        },
        addShape(shape) {
            const depth = this.consumptionScale(this.currentLakeVolume)
            
            const defaultExtrudeSettings = {
                depth: 1,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 0,
            }

            const extrudeSettings = {
                depth,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 0,
            };

            //Create the geometry
            var lakeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            var totalConsumptionGeometry = new THREE.ExtrudeGeometry(shape, defaultExtrudeSettings);
            // let material = new THREE.MeshPhongMaterial({ color: 0x0231bd, wireframe: false });

            const defaultMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xFFFFFF,
                metalness: 0,
                roughness: 0,
                transmission: 0.9,
                thickness: 1,
                transparent: true,
                opacity: 0.8
            })

            const material = new THREE.MeshPhysicalMaterial({
                color: 0x00d4ff,
                metalness: 0,
                roughness: 0.7,
                transmission: 0.5,
                thickness: 0.1,
                polygonOffset: true,
                polygonOffsetFactor: -0.2
            })

            const lakeShape = new THREE.Mesh(lakeGeometry, material);
            this.lakeShape = lakeShape
            this.lakeShape.castShadow = true;
            this.lakeShape.name = 'lake';
            this.lakeShape.rotation.x = -Math.PI / 2;

            const defaultLakeShape = new THREE.Mesh(totalConsumptionGeometry, defaultMaterial);
            this.defaultLakeShape = defaultLakeShape
            this.defaultLakeShape.castShadow = true;
            this.defaultLakeShape.name = 'lake';
            this.defaultLakeShape.scale.set(1.01, 1.01, 1.01);
            this.defaultLakeShape.rotation.x = -Math.PI / 2;
            this.defaultLakeShape.renderOrder=1

            const group = new THREE.Group();
            group.position.y = -0.5;
            group.add( this.defaultLakeShape );
            group.add( this.lakeShape );

            this.scene.add(group);
        },
        translateLat(lat, firstLat) {
            if (!lat) {
            lat = 0;
          }

          return (lat - Math.abs(firstLat)) * 100;
        },
        translateLng(lng, firstLng) {
            if (!lng) {
            lng = 0;
          }
          return (lng - Math.abs(firstLng)) * 100;
        },
        buildShape(lakePath, material) {
            // console.log(lakePath.geometry)
            let good = true;
            const points = [];

            const lakeCentroid = d3geo.geoPath().centroid(lakePath.geometry)
            
            if (
                lakePath.geometry.coordinates.length < 1 ||
                lakePath.geometry.coordinates[0] < 1
            ) {
                good = false
            } else {
                for (let i = 0; i < lakePath.geometry.coordinates[0].length; i++) {
                    if (
                            lakePath.geometry.coordinates[0][i][0] &&
                            lakePath.geometry.coordinates[0][i][1] &&
                            lakePath.geometry.coordinates[0][i][0] > 0 &&
                            lakePath.geometry.coordinates[0][i][1] > 0
                    ) {
                        points.push(
                            new THREE.Vector2(
                                this.translateLat(lakePath.geometry.coordinates[0][i][0], lakeCentroid[0]),
                                this.translateLng(lakePath.geometry.coordinates[0][i][1], lakeCentroid[1])
                            )
                        )
                    } else {
                        good = false
                    }
                }
            }

            if (good) {
                this.addShape(new THREE.Shape(points), material);
            }
        }
    },
    watch: {
        selectedLake(newVal, oldVal) {
            this.currentLake = newVal.name
            this.currentLakeID = newVal.id
            this.currentLakeVolume = newVal.volume === undefined ? 0 : newVal.volume
            console.log(this.waterConsumption)
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