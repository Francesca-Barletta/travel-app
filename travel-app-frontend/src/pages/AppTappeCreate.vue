<script>
import {getAuth} from 'firebase/auth';
import { createStop, getDaysForStops } from '../services/stops/create';


export default {
  data() {
    return {
      newStop: {
        paese: '',
        attivita: '',
        descrizione: '',
        day_id:'',
        cibi: []
      },
      days : [],
      loadingDays: false,
    };
  },
  async created() {
    const auth = getAuth();
    this.user = auth.currentUser;

    if (!this.user) {
      this.$router.push({ name: 'login' });
      return;
    }
    this.loadingDays = true;
    try {
      this.days = await getDaysForStops();
    } catch (error) {
      console.error('Error fetching days: ', error);
    } finally {

      this.loadingDays = false;
    }
  },
  methods: {
    async addStop() {
      try {
        await createStop(this.newStop);
        // Puoi aggiungere un messaggio di successo o redirigere l'utente
        alert('tappa aggiunto con successo!');
        // Resetta il modulo se necessario
        this.newStop = {
            paese: '',
            attivita: '',
            descrizione: '',
            day_id:'',
            cibi: [],
          // Resetta altri campi se necessario
        };
      } catch (error) {
        console.error('Error adding stop: ', error);
        // Mostra un messaggio di errore se necessario
      }
    }
  }
};
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per creare tappe</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="addStop">

                <div>
                    <label for="paese" class="form-label text-white">Inserisci Paese</label>
                    <input class="form-control" v-model=" newStop.paese" type="text" id="paese" placeholder="Default input"
                        aria-label="default input example">
                </div>
                <div>
                    <label for="attivita" class="form-label text-white">Inserisci attività</label>
                    <input class="form-control" v-model="newStop.attivita" type="text" id="attivita" placeholder="Default input"
                        aria-label="default input example">
                </div>
                <div class="mb-3">
                    <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
                    <textarea class="form-control" v-model="newStop.descrizione" id="descrizione" rows="3"></textarea>
                </div>
                <div class="mb-3">
                <label for="day_id" class="form-label">Seleziona Giorno</label>
                <select class="form-control" v-model="newStop.day_id">
                    <option v-for="day in days" :key="day.id" :value="day.id">
                        {{ day.titolo }}
                    </option>
                </select>
            </div>


                <button class="btn btn-primary mb-3" type="submit">Aggiungi</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'tappe' }">torna alla lista delle tappe</RouterLink>
            </div>

        </div>
</template>
<style lang="scss" scoped></style>

