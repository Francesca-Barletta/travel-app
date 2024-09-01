<script>
import { getAuth } from 'firebase/auth';
import { createStop, getDaysForStops } from '../services/stops/create';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default {
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
      console.error('Errore durante il recupero dei giorni:', error);
    } finally {
      this.loadingDays = false;
    }
  },
  methods: {
    async addStop() {
      try {
        this.newStop.photoUrls = await this.uploadPhotos(); 
        await createStop(this.newStop);
        alert('Tappa aggiunta con successo!');
        this.newStop = {
          paese: '',
          attivita: '',
          descrizione: '',
          day_id: '',
          cibi: [],
          photoUrls: [],
        };
      } catch (error) {
        console.error('Errore durante l\'aggiunta della tappa:', error);
      }
    },
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
      const storageRef = ref(storage, `stops/${this.newStop.paese}/${file.name || 'image'}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      photoUrls.push(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', file, error);
    }
  }

  return photoUrls;
},
  }
};
</script>
<template>
  <div class="container my-5 ">

    <h1 class="text-primary text-center">Aggiungi una tappa</h1>
    <div class="container bg-primary shadow rounded my-5 p-3">

      <form @submit.prevent="addStop">

        <div>
          <label for="paese" class="form-label text-white">Inserisci Paese</label>
          <input class="form-control" v-model="newStop.paese" type="text" id="paese" placeholder="Default input"
            aria-label="default input example" required>
        </div>
        <div>
          <label for="attivita" class="form-label text-white">Inserisci attività</label>
          <input class="form-control" v-model="newStop.attivita" type="text" id="attivita" placeholder="Default input"
            aria-label="default input example" required>
        </div>
        <div class="mb-3">
          <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
          <textarea class="form-control" v-model="newStop.descrizione" id="descrizione" rows="3"></textarea>
        </div>
        <div class="mb-3">
          <label for="day_id" class="form-label text-white">Seleziona Giorno</label>
          <select class="form-control" v-model="newStop.day_id" required>
            <option v-for="day in days" :key="day.id" :value="day.id">
              {{ day.titolo }}
            </option>
          </select>
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

        </div>


        <button class="btn btn-light mb-3" type="submit">Aggiungi</button>
      </form>


    </div>

    <div class="mb-3 d-flex justify-content-between">

      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>


      <RouterLink class="btn btn-primary" :to="{ name: 'tappe' }">torna alla lista delle tappe</RouterLink>
    </div>

  </div>
</template>
<style lang="scss" scoped></style>

