<script>
import { getDays } from '../services/days/index';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      days: [],
      user: null
    };
  },
  async created() {
    try {
      this.days = await getDays();
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
      <h1 class="text-primary">Qui i giorni del viaggio</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
          <div v-for="day in days" :key="day.id" class="col">
                          <div class="card h-100 p-2">
                            <h4 class="fw-bold">{{ day.titolo }}</h4>
                            <p>{{ day.regione }}</p>
                            <p>{{ day.alloggio }}</p>
                            <p>{{ day.citta_alloggio }}</p>
                            <RouterLink class="btn btn-primary mt-auto" :to="{ name: 'dettagli-giorno', params: { slug: day.slug } }">Vedi giorno nel dettaglio</RouterLink>
                        </div>
            </div>
        </div>
        <div v-if="user">

          <RouterLink class="btn btn-primary mt-3 ms-3" :to="{ name: 'aggiungi-giorni' }">aggiungi giorni</RouterLink>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>