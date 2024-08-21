<script>
import {getAuth} from 'firebase/auth';
import {updateStop} from '../services/stops/edit';
import {getStopBySlug} from '../services/stops/show';
export default {
        props: ['slug'],
        data() {
            return {
                newStop: {
                    paese:'',
                    attivita: '',
                    descrizione:''
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
            const stopData = await getStopBySlug(this.slug);
            this.newStop = stopData;
        } catch (error) {
            console.error('Error fetching day data: ', error);
        }
        },
        methods: {
            async handleUpdateStop() {
                try {
                await updateStop(this.slug, this.newStop);
                alert('Tappa modificata con successo!');
                this.$router.push({ name: 'dettagli-tappa', params: { slug: this.slug } });
            } catch (error) {
                console.error('Error updating day: ', error);
            }
            }
        }
}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per modificare la tappa</h1>
        <div class="container bg-primary shadow rounded my-5 p-3">
            
            <form @submit.prevent="handleUpdateStop">

                <div>
                    <label for="paese" class="form-label text-white">Inserisci Paese</label>
                    <input class="form-control" v-model="newStop.paese" type="text" id="paese" 
                        aria-label="default input example">
                </div>
                <div>
                    <label for="attivita" class="form-label text-white">Inserisci attività</label>
                    <input class="form-control" v-model="newStop.attivita" type="text" id="attivita" 
                        aria-label="default input example">
                </div>
                <div class="mb-3">
                    <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
                    <textarea class="form-control" v-model="newStop.descrizione" id="descrizione" rows="3"></textarea>
                </div>


                <button class="btn btn-primary mb-3" type="submit">Modifica</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{name: 'dettagli-tappa', params: { slug: this.slug }}">torna al dettaglio tappa</RouterLink>
            </div>

        </div>
</template>
<style lang="scss" scoped></style>

