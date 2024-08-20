import { createRouter, createWebHistory } from 'vue-router';
import AppHome from './pages/AppHome.vue';
import AppGiorni from './pages/AppGiorni.vue';
import AppGiorniCreate from './pages/AppGiorniCreate.vue';
import AppGiorniShow from './pages/AppGiorniShow.vue';
import AppGiorniEdit from './pages/AppGiorniEdit.vue';
import AppTappe from './pages/AppTappe.vue';
import AppTappeShow from './pages/AppTappeShow.vue';
import AppTappeCreate from './pages/AppTappeCreate.vue';
import AppTappeEdit from './pages/AppTappeEdit.vue';
import AppCibiCreate from './pages/AppCibiCreate.vue';
import AppCibiEdit from './pages/AppCibiEdit.vue';
import AppCibiShow from './pages/AppCibiShow.vue';





const routes = [
    {
        path: '/', name: 'home', component: AppHome
    },
    {
        path: '/giorni', name: 'giorni', component: AppGiorni
    },
    {
        path: '/giorni/create', name: 'aggiungi-giorni', component: AppGiorniCreate
    },
    {
        path: '/giorni/show', name: 'dettagli-giorno', component: AppGiorniShow, props:true
    },
    {
        path: '/giorni/edit', name: 'modifica-giorno', component: AppGiorniEdit, props:true
    },
    {
        path: '/tappe', name: 'tappe', component: AppTappe
    },
    {
        path: '/tappe/show', name: 'dettagli-tappa', component: AppTappeShow, props:true
    },
    {
        path: '/tappe/create', name: 'aggiungi-tappe', component: AppTappeCreate
    },
    {
        path: '/tappe/edit', name: 'modifica-tappa', component: AppTappeEdit, props:true
    },
        {
        path: '/cibi/show', name: 'dettagli-cibo', component: AppCibiShow, props:true
    },
    {
        path: '/cibi/create', name: 'aggiungi-cibo', component: AppCibiCreate
    },
    {
        path: '/cibi/edit', name: 'modifica-cibo', component: AppCibiEdit, props:true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router
