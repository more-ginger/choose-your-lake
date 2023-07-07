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
            return currentConsumption
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
                opacity: 0.7,
                side: THREE.DoubleSide
                })
            ]

            console.log("initiation done");

            //decide which shape should be added
            if (lakePath) {  
                if (Object.hasOwn(lakePath, 'type')) {
                    console.log('render lake')
                    // this.grid.position.y = 0
                    this.camera.position.z = 10
                    this.camera.position.y = 8
                    this.buildLakeShape(lakePath, materials)
                } else {
                    console.log('render cube')
                    this.buildDefaultGlass(materials)
                }
                
            } else {
                console.log('render cube')
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
            // console.log('current volume', this.currentLakeVolume)
            // console.log('iterations', Math.round(numOfIterations))
           
            let numOfGaps = Math.floor(numOfIterations);
            let checkedNumOfIterations = numOfIterations;

            // check if faktor has decimals
            const decimal = numOfIterations%1
            if (decimal===0) numOfGaps -= 1;

            // if less then 1 assign 1 (so it has full height)
            if (numOfIterations<1) checkedNumOfIterations = 1
      
            const totalHeight = 10
            const gapHeight = Math.max(totalHeight/(checkedNumOfIterations*10), 0.05)
            const lakeHeight = (totalHeight-(gapHeight*numOfGaps))/checkedNumOfIterations

            this.group = new THREE.Group();
            let positionY = 0
            for (let index = 0; index < numOfIterations; index++) {
                // console.log('!')
                let depth = Math.abs(lakeHeight)

                // check if more than 1 lake needed and at last lake
                if(numOfIterations>1 && numOfIterations - index < 1){
                    // adjust lakeHeight to decimal
                    depth = Math.abs(lakeHeight * decimal) 
                }
                
                // add height if not first lake
                if(index > 0) positionY = positionY + lakeHeight + gapHeight
                
                const extrudeSettings = {
                    depth,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelOffset: 0,
                    bevelSegments: 0
                }

                const lakeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                lakeGeometry.groups[0].materialIndex = 2
                lakeGeometry.groups[1].materialIndex = 1
                const lakeShape = new THREE.Mesh(lakeGeometry, materials);
                lakeShape.scale.set(6, 6, 1)
                lakeShape.rotation.x = -Math.PI / 2;
                lakeShape.position.y = positionY
                this.group.add(lakeShape);
            }
            this.group.position.y = -4
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
            const innerCylinder = new THREE.CylinderGeometry(2.4, 2.4, 10, 64) 
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
            this.currentLake = newVal === undefined ? '' : newVal.name
            this.currentLakeID = newVal === undefined ? '' : newVal.id
            this.currentLakeVolume = newVal === undefined 
                || newVal.volume === undefined ? 0 : newVal.volume

            const waterConsumptionPretty = this.waterConsumption.toFixed(1)
            this.$emit('onChangeConsumption', waterConsumptionPretty)
            // console.log(newVal)
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