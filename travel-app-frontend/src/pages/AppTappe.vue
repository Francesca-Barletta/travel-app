
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
      <h1 class="text-primary">Qui le tappe del viaggio</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
          <div v-for="stop in stops" :key="stop.id" class="col">
                          <div class="card p-2">
                            <h4 class="fw-bold">{{ stop.paese }}</h4>
                            <p>{{ stop.attivita }}</p>
                            <p>{{ stop.descrizione }}</p>
                            
                            <RouterLink class="btn btn-primary my-3" :to="{name: 'dettagli-tappa',params: { slug: stop.slug }}">Vedi la tappa nel dettaglio</RouterLink>
                        </div>
            </div>
        </div>
        <div v-if="user">

          <RouterLink class="btn btn-primary ms-3" to="/tappe/create">Aggiungi tappe</RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
