<script>

import { getFoodWithStopBySlug } from '../services/foods/show';
import { getAuth } from 'firebase/auth';

export default {
  props: ['slug'],
  data() {
    return {
      food: null,
      stop: null,
      user: null
    };
  },
  async created() {
    try {
      // Recupera i dettagli del cibo e della tappa usando lo slug
      const result = await getFoodWithStopBySlug(this.slug);
      this.food = result.food;
      this.stop = result.stop;

      console.log('Food:', this.food);
      console.log('Stop:', this.stop);

    } catch (error) {
      console.error('Error fetching data: ', error);
   
    }

    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  },
}
</script>
<template>
  <div class="container my-5 flex-grow-1">
    <div  class="container d-flex justify-content-center bg-light rounded my-2 col-12 col-lg-8 align-items-center">
    <h1 class="text-primary text-center p-3">I dettagli del cibo</h1>
    <RouterLink class="btn btn-primary" :to="{ name: 'dettagli-tappa', params: { slug: stop.slug } }">Torna alla tappa
    </RouterLink>
    </div>
    <div class="row">
      <div v-if="food" class="col-12 col-lg-8 p-2 m-auto">
        <div class="card p-2">
          <h4 class="text-center p-3"><span class="fw-boldp-3">Locale: </span>{{ food.locale }}</h4>
          <!-- inizio carosello -->
          <div id="carouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              <!-- Slide items -->
              <div v-for="(url, index) in food.photoUrls" :key="index"
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
          <p class="text-center mt-3"><span class="fw-bold">Piatto: </span><br>{{ food.piatto }}</p>
          <p class="text-center"><span class="fw-bold">Descrizione: </span><br>{{ food.descrizione }}</p>
          <p class="text-center"><span class="fw-bold">Prezzo: </span><br>{{ food.prezzo }} €</p>
          <p class="text-center"><span class="fw-bold">Voto: </span><br>{{ food.voto }}/10</p>
          <div v-if="user" class="container d-flex justify-content-center align-items-center p-3">
            <RouterLink  class="btn btn-primary" :to="{ name: 'modifica-cibo', params: { slug: food.slug } }">Modifica il cibo
            </RouterLink>
           
        </div>
      </div>
    </div>



    </div>
  </div>
</template>
<style lang="scss" scoped></style>
