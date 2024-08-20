<script>
export default {

}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per creare cibi</h1>
        <div class="container my-5 p-0">
            
            <form>
                <div>
                <label for="locale" class="form-label text-white">Inserisci locale</label>
                <input class="form-control" v-model="locale" type="text" id="locale" placeholder="Default input"
                    aria-label="default input example">
            </div>
            <div>
                <label for="piatto" class="form-label text-white">Inserisci piatto</label>
                <input class="form-control" v-model="piatto" type="text" id="piatto" placeholder="Default input"
                    aria-label="default input example">
            </div>
            <div class="mb-3">
                <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
                <textarea class="form-control" v-model="descrizione" id="descrizione" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="prezzo" class="form-label text-white">Inserisci prezzo</label>
                <input class="form-control" type="number" v-model="prezzo" id="prezzo" >
            </div>
            <div class="mb-3">
                <label for="voto" class="form-label text-white">Inserisci voto</label>
                <input class="form-control" type="number" v-model="voto" id="voto" >
            </div>


                <button class="btn btn-primary mb-3" type="submit">Aggiungi</button>
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

