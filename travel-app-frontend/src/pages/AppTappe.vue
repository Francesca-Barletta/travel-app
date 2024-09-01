
<script>
import { getStops } from '../services/stops/index';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      stops: [],
      user: null
    };
  },
  async created() {
    try {
      this.stops = await getStops();
    } catch (error) {
      console.error('Error fetching days: ', error);
    }
    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }
};
</script>

<template>
  <div class="container my-5 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center">
      <div class="w-100 my-4 rounded bg-light d-flex justify-content-center align-items-center">
            <h1 class="text-primary text-center bg-light p-4 ">Le tappe del viaggio</h1>
            <div v-if="user">
      
              <RouterLink class="btn btn-primary ms-3" to="/tappe/create">Aggiungi tappe</RouterLink>
            </div>
        </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-gap-4">
      <div v-for="stop in stops" :key="stop.id" class="col">
        <div class="card shadow h-100 py-3 px-2">
          <h4 class="fw-bold pt-2">{{ stop.paese }}</h4>
          <hr>
          <img v-if="stop.photoUrls.length > 0" class="d-block w-100" style="aspect-ratio: 16/9; object-fit: cover;" :src="stop.photoUrls[0]" :alt="stop.paese">
          <hr>
          <!-- <p>{{ console.log(stop) }}</p> -->
          <p><span class="fw-bold">Attività: </span>{{ stop.attivita }}</p>
        

          <RouterLink class="btn btn-primary mt-auto" :to="{ name: 'dettagli-tappa', params: { slug: stop.slug } }">Vedi la
            tappa nel dettaglio</RouterLink>
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>
