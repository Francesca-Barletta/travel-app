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
      console.log('giorno', this.day);
      console.log('slug', this.slug);
      console.log('dayId', this.day.id);
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
          
          // Aggiorna la lista delle tappe senza la tappa eliminata
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
    <div class="d-flex justify-content-between align-items-center p-3">
      <h1 class="text-primary">Qui il giorno nel dettaglio</h1>
      <RouterLink class="btn btn-primary mt-3" :to="{ name: 'giorni' }">Torna alla lista di giorni</RouterLink>
    </div>
    <div class="row">
      <div v-if="day" class="col-8 m-auto">
        <div class="card p-4">
          <h4 class="fw-bold">{{ day.titolo }}: {{ day.regione }}</h4>
          <hr>
          <p><span class="fw-bold">Alloggio: </span>{{ day.alloggio }}</p>
          <p><span class="fw-bold">Località alloggio: </span>{{ day.citta_alloggio }}</p>
          <hr>
          <ul class="list-unstyled">
            <li v-for="stop in day.stops" :key="stop.id">
              <p>{{ console.log(stop.paese) }}</p>
              <div class="d-flex justify-content-between align-items-center p-3">
                <h4 class="text-center">Tappa a {{ stop.paese }}</h4>
                <button @click="deleteStop(stop.id)" :disabled="loading" class="btn btn-danger">
      {{ loading ? 'Elimino...' : 'Elimina tappa' }}
    </button>
              </div>
              <hr>
              <p><span class="fw-bold">Attività: </span>{{ stop.attivita }}</p>
              <p><span class="fw-bold">Descrizione: </span>{{ stop.descrizione }}</p>
              <hr>
              <h5  class="fw-bold">Il cibo della tappa:</h5>
              <ul  class="list-unstyled">
                <li v-for="food in stop.foods" :key="food.id" class="text-center">
                  <hr>
                  <p><span class="fw-bold">Piatto: </span>{{ food.piatto }}</p>
                  <p><span class="fw-bold">Locale: </span>{{ food.locale }}</p>
                  <p><span class="fw-bold">Prezzo: </span>{{ food.prezzo }} €</p>
                  <p><span class="fw-bold">Voto: </span>{{ food.voto }} / 10</p>
                </li>
              </ul>
 
              <hr>
            </li>
          </ul>
          <div  class="d-flex justify-content-between align-items-center p-3">
            <button @click="deleteDay" :disabled="loading" class="btn btn-danger">
                {{ loading ? 'Elimino...' : 'Elimina giorno' }}
            </button>
            <RouterLink class="btn btn-primary" :to="{ name: 'modifica-giorno', params: { slug: day.slug } }">modifica il
              giorno</RouterLink>

          </div>
        </div>
      </div>
    </div>
   
  </div>
</template>

<style lang="scss" scoped></style>

