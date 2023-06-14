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
            LakesFeatures: Lakes.features,
            contenxt: ''
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
        init(path) {
            console.log(path)
            //scene
            this.scene = new THREE.Scene()
            //camera
            this.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
            )
            
            //rendered
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true })
            this.light = new THREE.DirectionalLight(0xcff1ff, 1)

            this.scene.add(this.camera)
            this.scene.add(this.light)
            this.renderer.setSize(this.canvasWidth, this.canvasHeight)
            this.light.position.set(0, 5, 10)
            this.camera.position.z = 5

            console.log("initiation done");

            //decide which shape should be added
            if (path) {
                this.camera.position.z = 1
                this.buildShape(path)
            } else {
                console.log('default to cube')
                this.geometry = new THREE.BoxGeometry(2, 4, 2)

                const material = new THREE.MeshPhysicalMaterial({
                    color: 0x00d4ff,
                    metalness: 0,
                    roughness: 0.7,
                    transmission: 0.5,
                    thickness: 0.5
                 })
            
                this.cube = new THREE.Mesh(this.geometry, material)
                this.scene.add(this.cube)
            }
        },
        animate: function(path) {
            requestAnimationFrame(this.animate)
            this.renderer.render(this.scene, this.camera)
            // console.log(path)
            if (this.context !== 'mounted') {
                this.lakeShape.rotation.y += 0.005
            } else {
                this.cube.rotation.y += 0.005
            }
            
        },
        addShape(shape) {
            const extrudeSettings = {
                steps: 1,
                depth: 1.1,
                bevelEnabled: true,
                bevelThickness: 0,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: 0,
            };

            //Create the geometry
            var lakeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            let material = new THREE.MeshPhongMaterial({ color: 0x0231bd, wireframe: false });

            const lakeShape = new THREE.Mesh(lakeGeometry, material);
            this.lakeShape = lakeShape
            this.lakeShape.castShadow = true;
            this.lakeShape.name = 'lake';
            this.scene.add(this.lakeShape)
        },
        translateLat(lat, firstLat) {
            if (!lat) {
            lat = 0;
          }
          return (lat - firstLat) * 100;
        },
        translateLng(lng, firstLng) {
            if (!lng) {
            lng = 0;
          }
          return (lng - firstLng) * 100;
        },
        buildShape(path) {
            console.log(path.geometry)
            let good = true;
            const points = [];

            if (
                path.geometry.coordinates.length < 1 ||
                path.geometry.coordinates[0] < 1
            ) {
                good = false
            } else {
                for (let i = 0; i < path.geometry.coordinates[0].length; i++) {
                    if (
                            path.geometry.coordinates[0][i][0] &&
                            path.geometry.coordinates[0][i][1] &&
                            path.geometry.coordinates[0][i][0] > 0 &&
                            path.geometry.coordinates[0][i][1] > 0
                    ) {
                        points.push(
                            new THREE.Vector2(
                                this.translateLat(path.geometry.coordinates[0][i][0], path.geometry.coordinates[0][0][0]),
                                this.translateLng(path.geometry.coordinates[0][i][1], path.geometry.coordinates[0][0][1])
                            )
                        )
                    } else {
                        good = false
                    }
                }
                // console.log(good)
            }

            if (good) {
                this.addShape(new THREE.Shape(points));
            }
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