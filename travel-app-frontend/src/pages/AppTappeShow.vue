<script>
import { getAuth } from 'firebase/auth';
import { getStopBySlug } from '../services/stops/show';

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
  }
};
</script>

<template>
    <div class="container my-5 flex-grow-1">

        <h1 class="text-primary">Qui la tappa nel dettaglio</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
            <div v-if="stop" class="col">
                <div class="card p-2">
                    <h4 class="fw-bold">{{ stop.paese }}</h4>
                    <p>{{ stop.attivita }}</p>
                    <p>{{ stop.descrizione }}</p>
                    <div v-if="stop.day">
                       <h5>Giorno Associato: {{ stop.day.titolo}}</h5>
                     </div>
                     <div v-if="stop.foods && stop.foods.length > 0">
            <h5>Cibi Associati:</h5>
            <ul>
              <li v-for="food in stop.foods" :key="food.id">
                <p>{{ food.piatto }}</p>
                <p>{{ food.locale }}</p>
                <p>{{ food.prezzo }} €</p>
                <p>{{ food.voto }} / 10</p>
              </li>
            </ul>
          </div>

                    <div v-if="user">

                        <RouterLink class="btn btn-primary" :to="{ name: 'modifica-tappa', params: { slug: stop.slug } }">modifica la tappa</RouterLink>
                        <RouterLink class="btn btn-primary m-2" :to="{name: 'dettagli-cibo'}">Vedi il cibo nel dettaglio</RouterLink>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="user">
            <RouterLink class="btn btn-primary m-2" :to="{name: 'aggiungi-cibo'}">aggiungi cibo alla tappa</RouterLink>
            <RouterLink class="btn btn-primary m-2" :to="{name: 'aggiungi-tappe'}">aggiungi tappa</RouterLink>
        </div>
        <RouterLink class="btn btn-primary m-2" :to="{name: 'tappe'}">torna alla lista delle tappe</RouterLink>
  


    </div>
</template>
<style lang="scss" scoped></style>

