<script>
import { getAuth } from 'firebase/auth';
import { updateStop, getDaysForStops } from '../services/stops/edit';
import { getStopBySlug } from '../services/stops/show';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default {
  props: ['slug'],
  data() {
    return {
      newStop: {
        paese: '',
        attivita: '',
        descrizione: '',
        day_id: '',
        cibi: [],
        photoUrls: [],
      },
      days: [],
      photoFiles: [],
      loadingDays: false,
      loadingStop: true,
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
      // Carica i giorni disponibili per associarli alle tappe
      this.days = await getDaysForStops();

      // Carica i dettagli della tappa usando lo slug
      const stopData = await getStopBySlug(this.slug);
      if (stopData) {
        this.newStop = {
          ...stopData,
          photoUrls: stopData.photoUrls || [],
        };
      } else {
        console.error('Tappa non trovata');
        // Reindirizza se la tappa non è trovata
        this.$router.push({ name: 'tappe' }); 
      }
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    } finally {
      this.loadingDays = false;
      this.loadingStop = false;
    }
  },
  methods: {
    async handleUpdateStop() {
      try {
        if (!Array.isArray(this.newStop.photoUrls)) {
                this.newStop.photoUrls = [];
                }
                const newPhotoUrls = await this.uploadPhotos();
                this.newStop.photoUrls = [...this.newStop.photoUrls, ...newPhotoUrls];

        await updateStop(this.slug, this.newStop);
        alert('Tappa modificata con successo!');
        this.$router.push({ name: 'dettagli-tappa', params: { slug: this.slug } });
      } catch (error) {
        console.error('Errore durante la modifica della tappa:', error);
      }
    },
    onFileChange(e) {
      this.photoFiles = Array.from(e.target.files);
     
    },
    async uploadPhotos() {
      
      const photoUrls = [];
      for (const file of this.photoFiles) {
        const storageRef = ref(storage, `stops/${this.newStop.paese}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadURL);
      }
      return photoUrls;
    },
    removePhoto(index) {
      // Rimuove la foto dall'array
            this.newStop.photoUrls.splice(index, 1); 
        },
    },
    computed: {

    createObjectURL() {
      return (file) => URL.createObjectURL(file);
    }
  }
}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Modifica una tappa</h1>
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
                <div class="mb-3">
                    <label for="day_id" class="form-label text-white">Seleziona Giorno</label>
                    <select class="form-control" v-model="newStop.day_id">
                        <option v-for="day in days" :key="day.id" :value="day.id">
                            {{ day.titolo }}
                        </option>
                    </select>
                </div>
                 <!-- Visualizzazione delle foto esistenti -->
                 <div v-if="Array.isArray(newStop.photoUrls) && newStop.photoUrls.length > 0"  class="mb-3">
                        <h3 class="text-white">Foto esistenti:</h3>
                        <div class="d-flex flex-wrap">
                            <div v-for="(url, index) in newStop.photoUrls" :key="index" class="p-2 position-relative">
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


                <button class="btn btn-light mb-3" type="submit">Modifica</button>
            </form>


        </div>

        <div class="mb-3 d-flex justify-content-between">

            <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
       
            <RouterLink class="btn btn-primary" :to="{name: 'dettagli-tappa', params: { slug: this.slug }}">Torna al
                dettaglio tappa</RouterLink>
        </div>

    </div>
</template>
<style lang="scss" scoped></style>

