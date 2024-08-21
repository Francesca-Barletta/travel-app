<script>
import { getAuth } from 'firebase/auth';
import { updateDay } from '../services/days/edit';
import { getDayBySlug } from '../services/days/show'; // Importa la funzione per ottenere i dettagli

export default {
    props: ['slug'], 
    data() {
        return {
            newDay: {
                titolo: '',
                regione: '',
                alloggio: '',
                citta_alloggio: '',
                data: ''
            }
        };
    },
    async created() {
        const auth = getAuth();
        this.user = auth.currentUser;
        if(!this.user) {
            this.$router.push({name:'login'});
            return;
        }
        try {
            const dayData = await getDayBySlug(this.slug);
            this.newDay = dayData;
        } catch (error) {
            console.error('Error fetching day data: ', error);
        }
    },
    methods: {
        async handleUpdateDay() {
            try {
                await updateDay(this.slug, this.newDay);
                alert('Giorno modificato con successo!');
                this.$router.push({ name: 'dettagli-giorno', params: { slug: this.slug } });
            } catch (error) {
                console.error('Error updating day: ', error);
            }
        }
    }
};
</script>
<template>
    <div v-if="user">
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per modificare il giorno</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="handleUpdateDay">

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
             

                <button class="btn btn-primary my-3" type="submit">Modifica</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">torna alla lista dei giorni</RouterLink>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped></style>

