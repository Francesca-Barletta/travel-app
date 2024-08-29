import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
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
import AppLogin from './pages/AppLogin.vue';





const routes = [
    {
        path: '/', name: 'home', component: AppHome
    },
    {
        path: '/login', name: 'login', component: AppLogin
    },
    {
        path: '/giorni', name: 'giorni', component: AppGiorni
    },
    {
        path: '/giorni/create', name: 'aggiungi-giorni', component: AppGiorniCreate
    },
    {
        path: '/giorni/:slug', name: 'dettagli-giorno', component: AppGiorniShow, props:true
    },
    {
        path: '/giorni/edit/:slug', name: 'modifica-giorno', component: AppGiorniEdit, props:true
    },
    {
        path: '/tappe', name: 'tappe', component: AppTappe
    },
    {
        path: '/tappe/:slug', name: 'dettagli-tappa', component: AppTappeShow, props:true
    },
    {
        path: '/tappe/create', name: 'aggiungi-tappe', component: AppTappeCreate
    },
    {
        path: '/tappe/edit/:slug', name: 'modifica-tappa', component: AppTappeEdit, props:true
    },
        {
        path: '/cibi/:slug', name: 'dettagli-cibo', component: AppCibiShow, props:true
    },
    {
        path: '/cibi/create/:slug', name: 'aggiungi-cibo', component: AppCibiCreate, props:true
    },
    {
        path: '/cibi/edit/:slug', name: 'modifica-cibo', component: AppCibiEdit, props:true
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if(to.matched.some(record => record.meta.requiresAuth) && !currentUser) {
        next({ name:'login'});
    } else {
        next();
    }
});

export default router
