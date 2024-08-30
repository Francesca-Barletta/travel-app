
<script>
import { createFood, getStopBySlug } from '../services/foods/create';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

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
        stop_id: '',
        photoUrls: [],
      },
      photoFiles: [],
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
  onFileChange(e) {
    this.photoFiles = Array.from(e.target.files);
    console.log('Photo files:', this.photoFiles); // Debug: verifica i file caricati
  },
  createObjectURL(file) {
    return URL.createObjectURL(file); // Questa funzione crea un URL per l'anteprima dell'immagine
  },
  async uploadPhotos() {
  console.log('Uploading photos:', this.photoFiles);
  const photoUrls = [];

  for (const [index, file] of this.photoFiles.entries()) {
    try {
      // Usa solo il nome del locale per il percorso
      const storageRef = ref(storage, `foods/${this.newFood.locale}/${file.name || 'image'}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      photoUrls.push(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', file, error);
    }
  }

  return photoUrls;
},
  async addFood() {
    try {
      this.newFood.photoUrls = await this.uploadPhotos(); // Assicurati che photoUrls sia popolato
      await createFood(this.newFood);
      alert('Cibo aggiunto con successo!');
      this.$router.push({ name: 'dettagli-tappa', params: { slug: this.slug } });
    } catch (error) {
      console.error('Error adding food: ', error);
    }
  },
},

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
            <div class="mb-3">
          <label for="photos" class="form-label text-white">Carica foto</label>
          <input class="form-control" type="file" id="photos" @change="onFileChange" multiple>
        </div>
        <div v-if="photoFiles.length > 0">
          <h3 class="text-white">Anteprima delle immagini:</h3>
          <div class="d-flex flex-wrap">
            <div v-for="(file, index) in photoFiles" :key="index" class="p-2">
              <img :src="createObjectURL(file)" alt="Preview" class="img-thumbnail" style="max-width: 100px;">
            </div>
          </div>
        </div>




                <button class="btn btn-light mb-3" type="submit">Aggiungi</button>
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

