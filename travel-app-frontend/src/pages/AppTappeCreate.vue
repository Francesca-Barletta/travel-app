<script>
export default {

}
</script>
<template>
    <div class="container my-5 ">

        <h1 class="text-primary text-center">Qui il form per creare tappe</h1>
        <div class="container my-5 p-0">
            
            <form>

                <div>
                    <label for="paese" class="form-label text-white">Inserisci Paese</label>
                    <input class="form-control" v-model="paese" type="text" id="paese" placeholder="Default input"
                        aria-label="default input example">
                </div>
                <div>
                    <label for="attivita" class="form-label text-white">Inserisci attività</label>
                    <input class="form-control" v-model="attivita" type="text" id="attivita" placeholder="Default input"
                        aria-label="default input example">
                </div>
                <div class="mb-3">
                    <label for="descrizione" class="form-label text-white">Inserisci descrizione</label>
                    <textarea class="form-control" v-model="descrizione" id="descrizione" rows="3"></textarea>
                </div>


                <button class="btn btn-primary mb-3" type="submit">Aggiungi</button>
            </form>

       
        </div>

            <div class="mb-3">

                <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Torna alla home</RouterLink>
            </div>

            <div>

                <RouterLink class="btn btn-primary" :to="{ name: 'tappe' }">torna alla lista delle tappe</RouterLink>
            </div>

        </div>
</template>
<style lang="scss" scoped></style>

