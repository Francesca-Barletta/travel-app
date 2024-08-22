<script>
import { getDays } from '../services/days/index';
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      days: [],
      user: null,
      lastVisible: null,
      loading: false,
      hasMore: false
    };
  },
  async created() {
    try {
      await this.loadDays(); // Carica i giorni iniziali
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
      <h1 class="text-primary">Qui i giorni del viaggio</h1>
        <div class="row row-gap-3 row-cols-1 row-cols-md-2 row-cols-lg-4">
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
        <button v-if="!loading && hasMore" @click="loadMore" class="btn btn-primary mt-3">Carica più</button>
        <div v-if="loading" class="text-center">Caricamento...</div>
    </div>
</template>

<style lang="scss" scoped></style>