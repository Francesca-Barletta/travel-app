<script>
import { ref, onMounted } from 'vue';
import { getStopBySlug } from '../services/stops/show'; 
import { getAuth } from 'firebase/auth';
export default {
    props: ['slug'],
  data() {
    return {
      stop: null,
      user: null
      
    };
  },
  async created() {
    try {
      this.stop = await getStopBySlug(this.slug);
    } catch (error) {
      console.error('Error fetching stop: ', error);
    }
    const auth = getAuth();
    this.user = auth.currentUser;
    auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }
}
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

