<script>
export default {

}
</script>
<template>
    <div class="container">

        <h1 class="text-primary">Qui la tappa nel dettaglio</h1>
        <RouterLink class="text-white m-3" :to="{name: 'aggiungi-cibo'}">aggiungi cibo alla tappa</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'dettagli-cibo'}">Vedi il cibo nel dettaglio</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'tappe'}">torna alla lista delle tappe</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'aggiungi-tappe'}">aggiungi tappa</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'modifica-tappa'}">modifica tappa</RouterLink>


    </div>
</template>
<style lang="scss" scoped></style>

