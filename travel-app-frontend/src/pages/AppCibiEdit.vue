<script>
import { getAuth } from 'firebase/auth';
import { updateFood, getFoodBySlug } from '../services/foods/edit';
import slugify from 'slugify'; 
export default {
    props: ['slug'],
    data() {
        return {
            newFood: {
                locale: '',
                piatto: '',
                descrizione: '',
                prezzo: 0,
                voto: 0
            },
            oldSlug: this.slug
        };
    },
    async created() {
        const auth = getAuth();
        this.user = auth.currentUser;
        if (!this.user) {
            this.$router.push({ name: 'login' });
            return;
        }

        try {
            const foodData = await getFoodBySlug(this.slug);
            if (foodData) {
                this.newFood = {
                    locale: foodData.locale,
                    piatto: foodData.piatto,
                    descrizione: foodData.descrizione,
                    prezzo: foodData.prezzo,
                    voto: foodData.voto
                };
            } else {
                alert('Cibo non trovato!');
                this.$router.push({ name: 'home' });
            }
        } catch (error) {
            console.error('Error fetching food data: ', error);
            alert('Errore nel recupero dei dati del cibo.');
            this.$router.push({ name: 'home' });
        }
    },
    methods: {
        async handleUpdateFood() {
            try {
                // Aggiungi un campo per gestire il nuovo slug
                const newSlug = slugify(this.newFood.locale, { lower: true, strict: true });

                // Se lo slug è cambiato, aggiorna il documento con il nuovo slug
                if (this.oldSlug !== newSlug) {
                    await updateFood(this.oldSlug, { ...this.newFood, slug: newSlug });
                } else {
                    await updateFood(this.oldSlug, this.newFood);
                }

                alert('Cibo modificato con successo!');

                // Reindirizza l'utente alla pagina con il nuovo slug
                this.$router.push({ name: 'dettagli-cibo', params: { slug: newSlug } });
            } catch (error) {
                console.error('Error updating food: ', error);
                alert('Errore nell\'aggiornamento del cibo.');
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
          

                <button class="btn btn-light mb-3" type="submit">Modifica</button>
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

