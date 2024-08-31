<script>
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      map: null,
      days: [],
      user: null,
      waypoints: [], // Array per memorizzare i waypoints
    };
  },
  async mounted() {
    this.initializeMap();
    await this.loadDays();
  },
  methods: {
    initializeMap() {
      // Crea la mappa e imposta la vista iniziale su Roma
      this.map = L.map('mapContainer').setView([41.9028, 12.4964], 6); // Livello di zoom modificato

      // Aggiungi il layer di base (da OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      console.log('Map object:', this.map);
    },

    async loadDays() {
      try {
        const querySnapshot = await getDocs(collection(db, 'days'));
        this.days = querySnapshot.docs.map(doc => doc.data());
        await this.addMarkers();
        this.addRouting(); // Aggiungi routing per tutti i punti
      } catch (error) {
        console.error('Error fetching days: ', error);
      }
    },

    async addMarkers() {
      if (!this.map || !this.days.length) return;

      // Crea un array di punti per il routing
      this.waypoints = [];

      const geocodePromises = this.days.map(day =>
        this.geocodeCity(day.citta_alloggio).then(coords => {
          console.log('coords', coords);

          // Crea un marker sulla mappa alle coordinate ottenute
          let marker = L.marker(coords, {
            icon: L.divIcon({
              className: 'custom-icon',
              html: '<i class="bi bi-geo-alt-fill" style="font-size: 24px; color: #007bff;"></i>', // Icona Bootstrap
              iconSize: [32, 32], // Dimensioni dell'icona
              iconAnchor: [16, 32], // Punto dell'icona che sarà ancorato al marker
              popupAnchor: [0, -32] // Punto dal quale il popup si aprirà
            })
          }).addTo(this.map);

          // Personalizza il contenuto del popup
          const popupContent = `
            <div>
              <h5>${day.citta_alloggio}</h5>
            </div>
          `;

          marker.bindPopup(popupContent).openPopup();
          console.log('marker', marker);  // Logga il marcatore

          // Aggiungi le coordinate ai waypoints
          this.waypoints.push(L.latLng(coords[0], coords[1]));
        }).catch(error => {
          console.error('Error geocoding city: ', error);
        })
      );

      // Aspetta che tutte le geocodifiche siano completate
      await Promise.all(geocodePromises);
    },

    async geocodeCity(city) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        const data = await response.json();
        console.log('Geocode response:', data);

        if (data && data.length > 0) {
          const position = data[0];
          return [position.lat, position.lon]; // Restituisce le coordinate come [lat, lon]
        } else {
          throw new Error('City not found');
        }
      } catch (error) {
        console.error('Error in geocoding request: ', error);
        throw error;
      }
    },

    addRouting() {
      if (this.waypoints.length < 2) return; // Assicurati di avere almeno due waypoints

      // Aggiungi il routing alla mappa
      L.Routing.control({
        waypoints: this.waypoints,
        router: L.Routing.osrmv1({ language: 'it' }), // Utilizza il router di default di Leaflet Routing Machine
        routeWhileDragging: true,
        createMarker: () => null, // Non creare marker di routing
        // Opzioni per nascondere il pannello di istruzioni
        
      }).addTo(this.map);

      // Logga i waypoints per il debug
      console.log('waypoints', this.waypoints);
    }
  },

  async created() {
    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }
}
</script>

<template>
  <div>
    <div id="mapContainer" style="height: 500px; width: 90%; margin: 0 auto"></div>
  </div>
</template>

<style scoped>
#mapContainer {
  height: 100%;
}

.custom-icon {
  text-align: center;
  line-height: 32px;
}

/* Nascondere il pannello delle indicazioni */


/* Se desideri nascondere altre parti del pannello, puoi aggiungere altre regole */

</style>
