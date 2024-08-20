import { createRouter, createWebHistory } from 'vue-router';
import AppHome from './pages/AppHome.vue';
import AppGiorni from './pages/AppGiorni.vue';

const routes = [
    {
        path: '/', name: 'home', component: AppHome
    },
    {
        path: '/giorni', name: 'giorni', component: AppGiorni
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router
