<script>
import { getDays } from '../services/days/index';
import { getAuth } from 'firebase/auth';
import AppMap from '../components/AppMap.vue';

export default {
  components: {
    AppMap
  },
  data() {
    return {
      days: [],
      user: null,
      lastVisible: null,
      loading: false,
      hasMore: false,
      pageSize: 8
    };
  },
  async created() {
    try {
      // Carica i giorni iniziali
      await this.loadDays(); 
    } catch (error) {
      console.error('Error fetching days: ', error);
    }

    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  },
  methods: {
    async loadDays() {
      if (this.loading) return;

      this.loading = true;
      try {
        const result = await getDays(this.lastVisible, this.pageSize);
        this.days = [...this.days, ...result.days];
        this.lastVisible = result.newLastVisible;

     console.log('length', result.days.length);   
     console.log('massimo', this.pageSize);   

        if (result.days.length < this.pageSize) {
          
        this.hasMore = false;
      } else {
        this.hasMore = !!result.newLastVisible;
      }

      } catch (error) {
        console.error('Error loading days: ', error);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      if (this.hasMore) {
        this.loadDays();
      }
    }
  }
};
</script>

<template>
  <div class="container my-5 flex-grow-1">
    <div class="d-flex justify-content-between align-items-center">
      <div class="w-100 my-5">
            <h1 class="text-primary text-center bg-light mt-2 rounded p-4 shadow">I giorni del viaggio</h1>
        </div>
      
      <div v-if="user">

        <RouterLink class="btn btn-primary mt-3 ms-3" :to="{ name: 'aggiungi-giorni' }">Aggiungi giorni</RouterLink>
      </div>
    </div>
    <div class="row row-gap-3 row-cols-1 row-cols-md-2 row-cols-lg-4">
      <div v-for="day in days" :key="day.id" class="col">
        <div class="card h-100 py-3 px-2">
          <h4 class="fw-bold pt-2">{{ day.titolo }}</h4>
          <hr>
          <img v-if="day.photoUrls.length > 0" class="d-block w-100" style="aspect-ratio: 16/9; object-fit: cover;" :src="day.photoUrls[0]" :alt="day.titolo">
          <hr>
          <p><span class="fw-bold">Regione: </span>{{ day.regione }}</p>
          <p><span class="fw-bold">Alloggio: </span>{{ day.alloggio }}</p>
          <p><span class="fw-bold">Città: </span>{{ day.citta_alloggio }}</p>
          <RouterLink class="btn btn-primary mt-auto" :to="{ name: 'dettagli-giorno', params: { slug: day.slug } }">Vedi
            giorno nel dettaglio</RouterLink>
        </div>
      </div>
    </div>

    <button v-if="!loading && hasMore" @click="loadMore" class="btn btn-primary mt-3">Carica più</button>
    <div v-if="loading" class="text-center">Caricamento...</div>
  </div>
  <div class="container mb-5">

    <AppMap/>
  </div>
</template>

<style lang="scss" scoped></style>