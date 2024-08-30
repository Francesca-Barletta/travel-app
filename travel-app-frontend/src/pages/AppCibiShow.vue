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
      // Gestisci gli errori, potresti voler reindirizzare o mostrare un messaggio
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

        <h1 class="text-primary">Qui i dettagli del cibo</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
            <div v-if="food" class="col">
                <div class="card p-2">
                    <h4 class="fw-bold">{{ food.locale }}</h4>
                     
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
                    <p>{{ food.piatto }}</p>
                    <p>{{ food.descrizione }}</p>
                    <p>{{ food.prezzo}}</p>
                    <p>{{ food.voto }}</p>
                </div>
            </div>
        </div>

        <div v-if="user" class="container">
          <RouterLink class="btn btn-primary" :to="{ name: 'modifica-cibo', params: {slug: food.slug} }">modifica il cibo</RouterLink>
          <RouterLink class="btn btn-primary" :to="{ name: 'dettagli-tappa', params: {slug: stop.slug} }">torna alla tappa</RouterLink>

          
        </div>
    </div>
</template>
<style lang="scss" scoped></style>


