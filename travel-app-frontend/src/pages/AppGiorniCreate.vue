<script>
import { createDay } from '../services/days/create';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export default {
  data() {
    return {
      newDay: {
        titolo: '',
        regione: '',
        alloggio: '',
        citta_alloggio: '',
        data: '',
        tappe: [],
        photoUrls: [],
      },
      photoFiles: [],
    };
  },
  methods: {
    onFileChange(e) {
      this.photoFiles = Array.from(e.target.files);
    
    },
    async uploadPhotos() {
  
      const photoUrls = [];
      for (const file of this.photoFiles) {
        const storageRef = ref(storage, `days/${this.newDay.titolo}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadURL);
      }
      return photoUrls;
    },
    async addDay() {
      try {
        if (this.photoFiles.length > 0) {
          this.newDay.photoUrls = await this.uploadPhotos();
        }
        await createDay(this.newDay);
        alert('Giorno aggiunto con successo!');
        this.newDay = {
          titolo: '',
          regione: '',
          alloggio: '',
          citta_alloggio: '',
          data: '',
          tappe: [],
          photoUrls: [],
        };
        this.photoFiles = [];
      } catch (error) {
        console.error('Error adding day: ', error);
      }
    }
  },
  computed: {
 
    createObjectURL() {
      return (file) => URL.createObjectURL(file);
    }
  }
};
</script>

<template>
  <div class="container my-5 ">

    <h1 class="text-primary text-center">Crea un nuovo giorno!</h1>
    <div class="container bg-primary shadow rounded my-5 p-3">

      <form @submit.prevent="addDay">

        <div class="mb-3">
          <label for="titolo" class="form-label text-white">Inserisci nome del giorno</label>
          <input class="form-control" v-model="newDay.titolo" type="text" id="titolo" aria-label="giorno uno">
        </div>
        <div class="mb-3">
          <label for="regione" class="form-label text-white">Inserisci regione</label>
          <input class="form-control" v-model="newDay.regione" type="text" id="regione" aria-label="regione">
        </div>
        <div class="mb-3">
          <label for="alloggio" class="form-label text-white">Inserisci alloggio</label>
          <input class="form-control" v-model="newDay.alloggio" type="text" id="alloggio" aria-label="alloggio">
        </div>
        <div class="mb-3">
          <label for="citta_alloggio" class="form-label text-white">Inserisci la città dell'alloggio</label>
          <input class="form-control" v-model="newDay.citta_alloggio" type="text" id="citta_alloggio"
            aria-label="citta_alloggio">
        </div>
        <div class="mb-3">
          <label for="data" class="form-label text-white">Inserisci la data</label>
          <input class="form-control" v-model="newDay.data" type="text" id="data" aria-label="data">
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


        <button class="btn btn-light my-3" type="submit">Aggiungi</button>
      </form>


    </div>

    <div class="mb-3 d-flex justify-content-between">

      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>

      <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">Torna alla lista dei giorni</RouterLink>
    </div>

  </div>
</template>

<style lang="scss" scoped></style>

