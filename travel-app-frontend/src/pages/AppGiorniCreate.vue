<script>
import { createDay } from '../services/days/create';

export default {
  data() {
    return {
      newDay: {
        titolo: '',
        regione: '',
        alloggio: '',
        citta_alloggio: '',
        data: ''
        // Aggiungi altri campi se necessario
      }
    };
  },
  methods: {
    async addDay() {
      try {
        await createDay(this.newDay);
        // Puoi aggiungere un messaggio di successo o redirigere l'utente
        alert('Giorno aggiunto con successo!');
        // Resetta il modulo se necessario
        this.newDay = {
          titolo: '',
          regione: '',
          alloggio: '',
          citta_alloggio: '',
          data: ''
          // Resetta altri campi se necessario
        };
      } catch (error) {
        console.error('Error adding day: ', error);
        // Mostra un messaggio di errore se necessario
      }
    }
  }
};
</script>

<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per creare giorni</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="addDay">

                <div>
                    <label for="titolo" class="form-label text-white">Inserisci nome del giorno</label>
                    <input class="form-control" v-model="newDay.titolo" type="text" id="titolo" 
                        aria-label="giorno uno">
                </div>
                <div>
                    <label for="regione" class="form-label text-white">Inserisci regione</label>
                    <input class="form-control" v-model="newDay.regione" type="text" id="regione" 
                        aria-label="regione">
                </div>
                <div>
                    <label for="alloggio" class="form-label text-white">Inserisci alloggio</label>
                    <input class="form-control" v-model="newDay.alloggio" type="text" id="alloggio" 
                        aria-label="alloggio">
                </div>
                <div>
                    <label for="citta_alloggio" class="form-label text-white">Inserisci la città dell'alloggio</label>
                    <input class="form-control" v-model="newDay.citta_alloggio" type="text" id="citta_alloggio" 
                        aria-label="citta_alloggio">
                </div>
                <div>
                    <label for="data" class="form-label text-white">Inserisci la data</label>
                    <input class="form-control" v-model="newDay.data" type="text" id="data" 
                        aria-label="data">
                </div>
             

                <button class="btn btn-primary my-3" type="submit">Aggiungi</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">torna alla lista dei giorni</RouterLink>
            </div>

        </div>
</template>

<style lang="scss" scoped></style>

