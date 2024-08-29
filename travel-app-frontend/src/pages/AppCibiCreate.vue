<script>
import { createFood, getStopBySlug } from '../services/foods/create';

export default {
  props: ['slug'],
  data() {
    return {
      newFood: {
        locale: '',
        piatto: '',
        descrizione: '',
        prezzo: 0,
        voto: 0,
        stop_id: ''
      },
      loading: false,
    };
  },
  async created() {
    if (this.slug) {
      try {
        // Trova la tappa corrispondente allo slug passato
        const stop = await getStopBySlug(this.slug);
        if (stop) {
          this.newFood.stop_id = stop.id;  // Associa lo stop_id
        } else {
          throw new Error('Stop not found');
        }
      } catch (error) {
        console.error('Error loading stop: ', error);
      }
    }
  },
  methods: {
    async addFood() {
      try {
        await createFood(this.newFood);
        alert('Cibo aggiunto con successo!');
        this.$router.push({ name: 'dettagli-tappa', params: { slug: this.slug } });
      } catch (error) {
        console.error('Error adding food: ', error);
      }
    },
    
  }
};
</script>

<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per creare cibi</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="addFood">
                <div>
                <label for="locale" class="form-label text-white">Inserisci locale</label>
                <input class="form-control" v-model="newFood.locale" type="text" id="locale" placeholder="Default input"
                    aria-label="default input example">
            </div>
            <div>
                <label for="piatto" class="form-label text-white">Inserisci piatto</label>
                <input class="form-control" v-model="newFood.piatto" type="text" id="piatto" placeholder="Default input"
                    aria-label="default input example">
            </div>
            <div class="mb-3">
                <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
                <textarea class="form-control" v-model="newFood.descrizione" id="descrizione" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="prezzo" class="form-label text-white">Inserisci prezzo</label>
                <input class="form-control" type="number" v-model="newFood.prezzo" id="prezzo" >
            </div>
            <div class="mb-3">
                <label for="voto" class="form-label text-white">Inserisci voto</label>
                <input class="form-control" type="number" v-model="newFood.voto" id="voto" >
            </div>



                <button class="btn btn-primary mb-3" type="submit">Aggiungi</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'dettagli-tappa' }">torna al dettaglio della tappa</RouterLink>
            </div>

        </div>
</template>
<style lang="scss" scoped></style>

