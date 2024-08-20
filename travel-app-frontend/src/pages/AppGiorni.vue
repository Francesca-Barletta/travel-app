<script>
export default {

}
</script>
<template>
    <div class="container">

        <h1 class="text-primary">Qui i giorni del viaggio</h1>
        <RouterLink class="text-white m-3" :to="{name: 'dettagli-giorno'}">Vedi giorno nel dettaglio</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'aggiungi-giorni'}">aggiungi giorni</RouterLink>
    </div>
</template>
<style lang="scss" scoped></style>