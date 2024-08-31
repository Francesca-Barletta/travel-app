import { createApp } from 'vue'

import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'  
import 'leaflet/dist/leaflet.css';


import router from './router'

createApp(App).use(router).mount('#app')
