<script>
import * as THREE from 'three'

export default {
    props: {
        canvasWidth: Number,
        canvasHeight: Number
    },
    mounted() {
        this.init()
        this.animate()
        this.$refs.canvas.appendChild(this.renderer.domElement)
    },
    methods: {
        init() {
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
                color: '0x6699ff',
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
    }
}

</script>

<template>
    <div id="canvas" ref="canvas"></div>
</template>

<style></style>