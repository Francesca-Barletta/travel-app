<script>
export default {

}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per modificare il giorno</h1>
        <div class="container my-5 p-0">
            
            <form>

                <div>
                    <label for="nome" class="form-label text-white">Inserisci nome del giorno</label>
                    <input class="form-control" v-model="nome" type="text" id="nome" 
                        aria-label="giorno uno">
                </div>
                <div>
                    <label for="regione" class="form-label text-white">Inserisci regione</label>
                    <input class="form-control" v-model="regione" type="text" id="regione" 
                        aria-label="regione">
                </div>
                <div>
                    <label for="alloggio" class="form-label text-white">Inserisci alloggio</label>
                    <input class="form-control" v-model="alloggio" type="text" id="alloggio" 
                        aria-label="alloggio">
                </div>
                <div>
                    <label for="citta_alloggio" class="form-label text-white">Inserisci la città dell'alloggio</label>
                    <input class="form-control" v-model="citta_alloggio" type="text" id="citta_alloggio" 
                        aria-label="citta_alloggio">
                </div>
             

                <button class="btn btn-primary my-3" type="submit">Aggiungi</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'giorni' }">torna alla lista dei giorni</RouterLink>
            </div>

        </div>
</template>

<style lang="scss" scoped></style>

