<script>
import { getAuth } from 'firebase/auth';
import { updateFood, getFoodBySlug } from '../services/foods/edit';
import slugify from 'slugify'; 
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
                photoUrls: [],
            },
            oldSlug: this.slug,
            photoFiles: [],
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
                    voto: foodData.voto,
                    photoUrls: foodData.photoUrls || [],
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
                if (!Array.isArray(this.newFood.photoUrls)) {
                this.newFood.photoUrls = [];
                }
                const newPhotoUrls = await this.uploadPhotos();
                this.newFood.photoUrls = [...this.newFood.photoUrls, ...newPhotoUrls];
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
        },
        onFileChange(e) {
      this.photoFiles = Array.from(e.target.files);
      console.log('Photo files:', this.photoFiles); // Debug: verifica i file caricati
    },
    async uploadPhotos() {
      console.log('Uploading photos:', this.photoFiles); // Debug: verifica i file prima dell'upload
      const photoUrls = [];
      for (const file of this.photoFiles) {
        const storageRef = ref(storage, `foods/${this.newFood.paese}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        photoUrls.push(downloadURL);
      }
      return photoUrls;
    },
    removePhoto(index) {
            this.newFood.photoUrls.splice(index, 1); // Rimuove la foto dall'array
        },
    },
    computed: {
    // Computed property to access URL.createObjectURL
    createObjectURL() {
      return (file) => URL.createObjectURL(file);
    }
  }
    
}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Modifica cibo</h1>
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
            <!-- Visualizzazione delle foto esistenti con opzione di rimozione -->
            <div v-if="Array.isArray(newFood.photoUrls) && newFood.photoUrls.length > 0" class="mb-3">
                        <h3 class="text-white">Foto esistenti:</h3>
                        <div class="d-flex flex-wrap">
                            <div v-for="(url, index) in newFood.photoUrls" :key="index" class="p-2 position-relative">
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

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'dettagli-tappa' }">torna al dettaglio della tappa</RouterLink>
            </div>

        </div>
</template>
<style lang="scss" scoped></style>

