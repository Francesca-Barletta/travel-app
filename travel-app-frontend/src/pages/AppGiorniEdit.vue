<script>
import { getAuth } from 'firebase/auth';
import { updateDay } from '../services/days/edit';
import { getDayBySlug } from '../services/days/show'; // Importa la funzione per ottenere i dettagli
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default {
    props: ['slug'], 
    data() {
        return {
            newDay: {
                titolo: '',
                regione: '',
                alloggio: '',
                citta_alloggio: '',
                data: '',
                photoUrls: [],
            },
            photoFiles: [],
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
            this.newDay = {

                ...dayData,
                photoUrls: dayData.photoUrls || [],
            };
        } catch (error) {
            console.error('Error fetching day data: ', error);
        }
    },
    methods: {
        async handleUpdateDay() {
            try {
                if (!Array.isArray(this.newDay.photoUrls)) {
                this.newDay.photoUrls = [];
                }
                const newPhotoUrls = await this.uploadPhotos();
                this.newDay.photoUrls = [...this.newDay.photoUrls, ...newPhotoUrls];
        

                await updateDay(this.slug, this.newDay);
                alert('Giorno modificato con successo!');
                this.$router.push({ name: 'dettagli-giorno', params: { slug: this.slug } });
            } catch (error) {
                console.error('Error updating day: ', error);
            }
        },
        onFileChange(e) {
      this.photoFiles = Array.from(e.target.files);
      console.log('Photo files:', this.photoFiles); // Debug: verifica i file caricati
    },
    async uploadPhotos() {
      console.log('Uploading photos:', this.photoFiles); // Debug: verifica i file prima dell'upload
      const photoUrls = [];
      for (const file of this.photoFiles) {
        const storageRef = ref(storage, `days/${this.newDay.titolo}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadURL);
      }
      return photoUrls;
    },
    removePhoto(index) {
            this.newDay.photoUrls.splice(index, 1); // Rimuove la foto dall'array
        },
    },
    computed: {
    // Computed property to access URL.createObjectURL
    createObjectURL() {
      return (file) => URL.createObjectURL(file);
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

                    <div class="mb-3">
                        <label for="titolo" class="form-label text-white">Inserisci nome del giorno</label>
                        <input class="form-control" v-model="newDay.titolo" type="text" id="titolo"
                            aria-label="giorno uno">
                    </div>
                    <div class="mb-3">
                        <label for="regione" class="form-label text-white">Inserisci regione</label>
                        <input class="form-control" v-model="newDay.regione" type="text" id="regione"
                            aria-label="regione">
                    </div>
                    <div class="mb-3">
                        <label for="alloggio" class="form-label text-white">Inserisci alloggio</label>
                        <input class="form-control" v-model="newDay.alloggio" type="text" id="alloggio"
                            aria-label="alloggio">
                    </div>
                    <div class="mb-3">
                        <label for="citta_alloggio" class="form-label text-white">Inserisci la città
                            dell'alloggio</label>
                        <input class="form-control" v-model="newDay.citta_alloggio" type="text" id="citta_alloggio"
                            aria-label="citta_alloggio">
                    </div>
                    <div class="mb-3">
                        <label for="data" class="form-label text-white">Inserisci la data</label>
                        <input class="form-control" v-model="newDay.data" type="text" id="data" aria-label="data">
                    </div>
                    <!-- Visualizzazione delle foto esistenti con opzione di rimozione -->
                    <div v-if="Array.isArray(newDay.photoUrls) && newDay.photoUrls.length > 0"  class="mb-3">
                        <h3 class="text-white">Foto esistenti:</h3>
                        <div class="d-flex flex-wrap">
                            <div v-for="(url, index) in newDay.photoUrls" :key="index" class="p-2 position-relative">
                                <img :src="url" alt="Foto esistente" class="img-thumbnail" style="width: 100px; height: 60px;">
                                <button @click="removePhoto(index)" type="button" class="btn btn-danger btn-sm position-absolute" style="top: 0; right: 0;">
                                    &times;
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Caricamento nuove foto -->
                    <div class="mb-3">
                        <label for="photos" class="form-label text-white">Carica nuove foto</label>
                        <input class="form-control" type="file" id="photos" @change="onFileChange" multiple>
                    </div>

                    <!-- Anteprima delle nuove foto -->
                    <div v-if="photoFiles.length > 0">
                        <h3 class="text-white">Anteprima delle nuove immagini:</h3>
                        <div class="d-flex flex-wrap">
                            <div v-for="(file, index) in photoFiles" :key="index" class="p-2">
                                <img :src="createObjectURL(file)" alt="Preview" class="img-thumbnail" style="width: 100px; height: 60px;">
                            </div>
                        </div>
                    </div>


                    <button class="btn btn-light my-3" type="submit">Modifica</button>
                </form>


            </div>

            <div class="mb-3 d-flex justify-content-between">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>

                <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">torna alla lista dei giorni</RouterLink>
            </div>

        </div>
    </div>
</template>

<style lang="scss" scoped></style>

