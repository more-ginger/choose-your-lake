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
            this.camera = new THREE.PerspectiveCamera(75,this.canvasWidth / this.canvasHeight,0.1)
            this.camera.position.z = 12
            this.camera.rotation.x = -Math.PI/6
            this.camera.position.y = 7.5
            
            //rendered
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true })
           
            this.light =  new THREE.AmbientLight( 0xffffff );

            this.grid = new THREE.GridHelper(25, 10,  0x82C3FF, 0x3E9AEF );
            this.grid.geometry.rotateY( -Math.PI / 2 );
            this.grid.position.y = -4
            this.scene.fog = new THREE.Fog(0xffffff,10, 25);
            this.scene.add( this.grid );

            //scene
            this.scene.add(this.camera)
            this.scene.add(this.light)
            this.renderer.setSize(this.canvasWidth, this.canvasHeight)

            const materials = [
                new THREE.MeshToonMaterial({
                color: 0x82C3FF,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
                }),
                new THREE.MeshToonMaterial({
                color: 0x82C3FF,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
                }),
                new THREE.MeshToonMaterial({
                color: 0x82C3FF,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
                })
            ]

            console.log("initiation done");

            //decide which shape should be added
            if (lakePath) {  
                console.log('render lake')
                this.grid.position.y = 0
                this.camera.position.z = 5
                this.camera.position.y = 6
                this.buildLakeShape(lakePath, materials)
            } else {
                console.log('default to cube')
                this.buildDefaultGlass(materials)
            }
        },
        animate: function(lakePath) {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            // console.log(lakePath)
            this.grid.rotation.y += 0.005
            if (this.context !== 'mounted') {
                this.group.rotation.y += 0.005
            } else {
                this.defaultGlassGroup.rotation.y += 0.005
            }
            
        },
        addShape(shape, materials) {
            const numOfIterations = this.dailyWaterConsumption / this.currentLakeVolume
            console.log('current volume', this.currentLakeVolume)
            console.log('iterations', Math.round(numOfIterations))

            const domain = [0, numOfIterations]
            const range = [0, 1]
            const consumptionScale = scale.scaleLinear().domain(domain).range(range)

            this.group = new THREE.Group();
            let positionY = 0
            for (let index = 0; index < numOfIterations; index++) {
                
                // const element = array[index];
                // console.log(5 / numOfIterations)
                const depth = (5 / numOfIterations)
                const scaledDepth = consumptionScale(depth) * 10
                console.log('scaled depth', scaledDepth)
                // console.log(depth)
                positionY = positionY + depth
                const extrudeSettings = {
                    depth: scaledDepth,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelOffset: 0,
                    bevelSegments: 0
                }

                const lakeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                const lakeShape = new THREE.Mesh(lakeGeometry, materials);
                lakeShape.scale.set(5, 5, 1)
                lakeShape.rotation.x = -Math.PI / 2;
                lakeShape.position.y =positionY
                this.group.add(lakeShape);
            }

            //Create the geometry
    

            // const lakeShape = new THREE.Mesh(lakeGeometry, materials);
            // this.lakeShape = lakeShape
            // this.lakeShape.castShadow = true;
            // this.lakeShape.name = 'lake';
            // this.lakeShape.scale.set(5, 5, 1)
            // this.lakeShape.rotation.x = -Math.PI / 2;
            
            this.scene.add(this.group);
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
        buildLakeShape(lakePath, materials) {
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
                this.addShape(new THREE.Shape(points), materials);
            }
        },
        buildDefaultGlass(materials) {
            // builds default glass geometry
            const innerCylinder = new THREE.CylinderGeometry(2.8, 2.8, 9, 64) 
            this.water = new THREE.Mesh(innerCylinder, materials) 
            this.defaultGlassGroup = new THREE.Group()
            this.defaultGlassGroup.add(this.water)
            // this.defaultGlassGroup.position.y = 2
            this.scene.add(this.defaultGlassGroup)
        },

    },
    watch: {
        // changes current lake to display new glass
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