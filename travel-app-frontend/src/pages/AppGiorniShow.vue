<script>
import { deleteDayAndAssociates} from '../services/days/delete';
import { getAuth } from 'firebase/auth';
import { getDayBySlug } from '../services/days/show';
import {deleteStopAndAssociates} from '../services/stops/delete'

export default {
  props: ['slug'],
  data() {
    return {
      day: null,
      loading: false,
      user: null
    };
  },
  async created() {
    try {
      this.day = await getDayBySlug(this.slug);
      // console.log('giorno', this.day);
      // console.log('slug', this.slug);
      // console.log('dayId', this.day.id);
    } catch (error) {
      console.error('Error fetching day: ', error);
    }
    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  },
  methods: {
  async deleteDay() {
    if (confirm('Sei sicuro di voler eliminare questo giorno? Questo eliminerà anche le tappe e i cibi associati.')) {
      this.loading = true;
      try {
        if (!this.day || !this.day.id) {
          throw new Error('ID del giorno non valido.');
        }

        await deleteDayAndAssociates(this.day.id);
        alert('Giorno eliminato correttamente.');

        this.$router.push({ name: 'giorni' });
      } catch (error) {
        console.error('Errore eliminazione giorno: ', error);
        alert('Non è stato possibile cancellare il giorno.');
      } finally {
        this.loading = false;
      }
    }
  },
  async deleteStop(stopId) {
      if (confirm('Sei sicuro di voler eliminare questa tappa? Questo eliminerà anche i cibi associati.')) {
        this.loading = true;
        try {
          await deleteStopAndAssociates(stopId, this.day.id);
          alert('Tappa eliminata correttamente.');
          
          // Aggiorna la lista delle tappe
          this.day.stops = this.day.stops.filter(stop => stop.id !== stopId);
        } catch (error) {
          console.error('Errore durante l\'eliminazione della tappa:', error);
          alert('Non è stato possibile cancellare la tappa.');
        } finally {
          this.loading = false;
        }
      }
    }
}
};
</script>
<template>

  <div class="container my-5 flex-grow-1">
    <div class="container d-flex justify-content-center p-3 bg-light rounded my-2 col-12 col-lg-8 align-items-center gap-4">

      <h1 class="text-primary">Il giorno nel dettaglio</h1>
      <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">Torna alla lista di giorni</RouterLink>
    </div>
    <div class="row">
      <div v-if="day" class="col-12 col-lg-8 p-2 m-auto">
        <div class="card p-4">
          <h4 class="fw-bold">{{ day.titolo }}: {{ day.regione }}</h4>
          <hr>
          
          <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner mb-3">
      <!-- Slide items -->
      <div v-for="(url, index) in day.photoUrls" :key="index"
           :class="['carousel-item', { active: index === 0 }]">
        <img class="d-block w-100"  style="aspect-ratio: 16/9; object-fit: cover;" :src="url" :alt="'Slide ' + (index + 1)">
      </div>
    </div>
    <!-- Controls -->
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </a>
  </div>
            <p><span class="fw-bold p-2">Alloggio: </span>{{ day.alloggio }}</p>
            <p><span class="fw-bold p-2">Località alloggio: </span>{{ day.citta_alloggio }}</p>
            <ul class="list-unstyled  ">
              <li v-for="stop in day.stops" :key="stop.id" class=" border border-primary p-2 rounded m-2">
           
               
                <div class="d-flex justify-content-between align-items-center p-3 my-2">
                  <h4 class="text-center">Tappa a {{ stop.paese }}</h4>
                  <button v-if="user" @click="deleteStop(stop.id)" :disabled="loading" class="btn btn-danger">
                    {{ loading ? 'Elimino...' : 'Elimina tappa' }}
                  </button>
                  
                </div>
                <hr>
                <p><span class="fw-bold p-2">Attività: </span>{{ stop.attivita }}</p>
                <p class="fw-bold ps-2">Descrizione:</p>
                <p class="ps-2">{{ stop.descrizione }}</p>

               
             
              <ul class="list-unstyled">
                  <li v-if="day.stops[0].cibi.length > 0">
                    <!-- {{ console.log(day.stops[0].cibi) }} -->
                    <hr>
                    <h5 class="fw-bold text-center">Il cibo della tappa:</h5>
                    <hr>
                  </li>
                  
                  <li v-for="food in stop.foods" :key="food.id" class="text-center">
                    <p><span class="fw-bold">Piatto: </span>{{ food.piatto }}</p>
                    <img v-if="food.photoUrls" class="d-block w-100" :src="food.photoUrls[0]" :alt="food.piatto">
                    <p  class="mt-3"><span class="fw-bold mt-3">Locale: </span>{{ food.locale }}</p>
                    <p><span class="fw-bold">Prezzo: </span>{{ food.prezzo }} €</p>
                    <p class="fw-bold ps-2">Descrizione:</p>
                    <p class="ps-2">{{ food.descrizione }}</p>
                    <p><span class="fw-bold">Voto: </span>{{ food.voto }} / 10</p>
                    <hr>
                  </li>
                </ul>

               
              </li>
            </ul>
            <div v-if="user" class="d-flex justify-content-between align-items-center p-2">
              
              <button @click="deleteDay" :disabled="loading" class="btn btn-danger">
                {{ loading ? 'Elimino...' : 'Elimina giorno' }}
              </button>
              <RouterLink class="btn btn-primary" :to="{ name: 'modifica-giorno', params: { slug: day.slug } }">Modifica
                il
                giorno</RouterLink>

            </div>
          </div>
        </div>
      </div>

    </div>
 
</template>

<style lang="scss" scoped></style>

