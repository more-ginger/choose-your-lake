import { createWebHistory, createRouter } from "vue-router"
import Home from '@/components/Home.vue'
import ThreejsCanva from '@/components/ThreejsCanva.vue'

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        props: true
    },
    {
        path: "/lake/:id",
        name: "Lake",
        component: ThreejsCanva
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router