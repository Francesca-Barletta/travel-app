
<script>
import { getStops } from '../services/stops/index';

export default {
  data() {
    return {
      stops: []
    };
  },
  async created() {
    try {
      this.stops = await getStops();
    } catch (error) {
      console.error('Error fetching days: ', error);
    }
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
                            
                        </div>
            </div>
        </div>
        <RouterLink class="btn btn-primary my-3" :to="{name: 'dettagli-tappa'}">Vedi la tappa nel dettaglio</RouterLink>
        <RouterLink class="btn btn-primary ms-3" to="/tappe/create">Aggiungi tappe</RouterLink>
    </div>
</template>

<style lang="scss" scoped></style>
