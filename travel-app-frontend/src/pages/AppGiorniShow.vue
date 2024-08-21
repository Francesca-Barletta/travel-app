<script>

import { ref, onMounted } from 'vue';
import { getDayBySlug } from '../services/days/show'; 

export default {
  props: ['slug'],
  data() {
    return {
      day: null,
      
    };
  },
  async created() {
    try {
      this.day = await getDayBySlug(this.slug);
    } catch (error) {
      console.error('Error fetching day: ', error);
    }
  }
};
</script>

<template>

    <div class="container my-5 flex-grow-1">
        <h1 class="text-primary">Qui il giorno nel dettaglio</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
            <div v-if="day" class="col">
                <div class="card p-2">
                    <h4 class="fw-bold">{{ day.titolo }}</h4>
                    <p>{{ day.regione }}</p>
                    <p>{{ day.alloggio }}</p>
                    <p>{{ day.citta_alloggio }}</p>
                    
                            <RouterLink class="btn btn-primary" :to="{ name: 'modifica-giorno', params: { slug: day.slug } }">modifica il giorno</RouterLink>
                </div>
            </div>
        </div>
        <RouterLink class="btn btn-primary mt-3" :to="{ name: 'giorni' }">torna alla lista di giorni</RouterLink>
    </div>
</template>

<style lang="scss" scoped></style>

