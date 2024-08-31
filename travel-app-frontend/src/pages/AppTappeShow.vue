<script>
import { getAuth } from 'firebase/auth';
import { getStopBySlug } from '../services/stops/show';
import { deleteFood } from '../services/foods/delete'; // Importa la funzione di eliminazione

export default {
  props: ['slug'],
  data() {
    return {
      stop: null,
      user: null,
      error: null
    };
  },
  async created() {
    try {
      // Recupera la tappa con giorno e cibo
      console.log('Fetching stop with slug:', this.slug);
      this.stop = await getStopBySlug(this.slug);
      console.log('Stop fetched:', this.stop);

      // Recupera l'utente corrente
      const auth = getAuth();
      this.user = auth.currentUser;
      auth.onAuthStateChanged(user => {
        this.user = user;
      });

    } catch (error) {
      this.error = error;
      console.error('Error fetching stop or day document:', error);
    }
  },
  methods: {
    async removeFood(foodId) {
      try {
        if (this.stop) {
          await deleteFood(this.stop.id, foodId);
          // Ricarica la tappa aggiornata
          this.stop = await getStopBySlug(this.slug);
          alert('Cibo eliminato con successo!');
        }
      } catch (error) {
        console.error('Error removing food:', error);
      }
    }
  }
};
</script>
<template>
  <div class="container my-5 flex-grow-1">
    <div  class="d-flex justify-content-center align-items-center p-3">
      <h1 class="text-primary text-center p-3">Qui la tappa nel dettaglio</h1>
      
      <RouterLink  v-if="user" class="btn btn-primary m-2" :to="{ name: 'aggiungi-tappe' }">aggiungi tappa</RouterLink>
    </div>
    <div class="row">
      <div v-if="stop" class="col-8 m-auto">
        <div class="card p-4 ">
          <h4 class="fw-bold text-center">La tappa di {{ stop.paese }}:</h4>
          <hr>
          <!-- inizio carosello -->
          <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <!-- Slide items -->
              <div v-for="(url, index) in stop.photoUrls" :key="index"
                :class="['carousel-item', { active: index === 0 }]">
                <img class="d-block w-100" :src="url" :alt="'Slide ' + (index + 1)">
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
           <!-- fine carosello -->
          <p class="text-center mt-4"><span class="fw-bold">Attività: </span>{{ stop.attivita }}</p>
          <p class="text-center"><span class="fw-bold">Descrizione: </span>{{ stop.descrizione }}</p>
          
          <div v-if="stop.day">
            <p class="text-center"><span class="fw-bold">Giorno della tappa: </span> {{ stop.day.titolo }}</p>
          </div>
          <hr>
          <div v-if="stop.foods">
          
            <ul class="list-unstyled text-center">
              <li v-for="food in stop.foods" :key="food.id">
                <h4>Cibi Associati: </h4>
                <hr>
                <p><span class="fw-bold">Nome del locale: </span>{{ food.locale }}</p>
                <p><span class="fw-bold">Piatto: </span>{{ food.piatto }}</p>
                <p><span class="fw-bold">Prezzo: </span>{{ food.prezzo }} €</p>
                <p><span class="fw-bold">Descrizione: </span>{{ food.descrizione }}</p>
                <p><span class="fw-bold">Voto: </span>{{ food.voto }} / 10</p>
                <RouterLink class="btn btn-primary m-2" :to="{ name: 'dettagli-cibo', params: { slug: food.slug } }">Vedi
                  il cibo nel dettaglio</RouterLink>
                  <button @click="removeFood(food.id)" class="btn btn-danger m-2">Elimina Cibo</button>
                <hr>
              </li>
            </ul>
          </div>

          <div v-if="user" class="d-flex justify-content-between">

            <RouterLink class="btn btn-primary" :to="{ name: 'modifica-tappa', params: { slug: stop.slug } }">modifica
              la tappa</RouterLink>
              <RouterLink class="btn btn-primary" :to="{ name: 'aggiungi-cibo', params: { slug: stop.slug } }">aggiungi cibo alla
                tappa</RouterLink>

          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">

      <RouterLink class="btn btn-primary m-2" :to="{ name: 'tappe' }">torna alla lista delle tappe</RouterLink>
    </div>



  </div>
</template>
<style lang="scss" scoped></style>

