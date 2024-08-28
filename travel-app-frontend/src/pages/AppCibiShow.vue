<script>
import { ref, onMounted } from 'vue';
import { getFoodBySlug } from '../services/foods/show'; 
import { getAuth } from 'firebase/auth';
export default {
    props: ['slug'],
    data() {
    return {
      food: null,
      user: null
      
    };
  },
  async created() {
    try {
      this.food = await getFoodBySlug(this.slug);
    } catch (error) {
      console.error('Error fetching food: ', error);
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

        <h1 class="text-primary">Qui i dettagli del cibo</h1>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
            <div v-if="food" class="col">
                <div class="card p-2">
                    <h4 class="fw-bold">{{ food.locale }}</h4>
                    <p>{{ food.piatto }}</p>
                    <p>{{ food.descrizione }}</p>
                    <p>{{ food.prezzo}}</p>
                    <p>{{ food.voto }}</p>
                </div>
            </div>
        </div>

        <div v-if="user" class="container">


            <RouterLink class="text-white m-3" :to="{ name: 'modifica-cibo' }">modifica il cibo</RouterLink>
            <RouterLink class="text-white m-3" :to="{ name: 'dettagli-tappa' }">torna indietro</RouterLink>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>


