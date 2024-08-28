<script>
import {getAuth} from 'firebase/auth';
import {updateStop} from '../services/stops/edit';
import {getFoodBySlug} from '../services/foods/show';
export default {
        props: ['slug'],
        data() {
            return {
                newFood: {
                    locale:'',
                    piatto: '',
                    descrizione:'',
                    prezzo: 0,
                    voto:0
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
            const foodData = await getFoodBySlug(this.slug);
            this.newFood = foodData;
        } catch (error) {
            console.error('Error fetching food data: ', error);
        }
        },
        methods: {
            async handleUpdateFood() {
                try {
                await updateStop(this.slug, this.newFood);
                alert('Cibo modificato con successo!');
                this.$router.push({ name: 'dettagli-cibo', params: { slug: this.slug } });
            } catch (error) {
                console.error('Error updating food: ', error);
            }
            }
        }
}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per modificare cibi</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="handleUpdateFood">
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
            <div class="mb-3">
                <label for="day_id" class="form-label">Seleziona tappa</label>
                <select class="form-control" v-model="newFood.day_id">
                    <option v-for="stop in stops" :key="stop.id" :value="stop.id">
                        {{ stop.paese }}
                    </option>
                </select>
            </div>


                <button class="btn btn-primary mb-3" type="submit">Modifica</button>
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

