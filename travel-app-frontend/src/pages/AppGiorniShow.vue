<script>
export default {

}
</script>
<template>
    <div class="container">

        <h1 class="text-primary">Qui il giorno nel dettaglio</h1>
        <RouterLink class="text-white m-3" :to="{name: 'modifica-giorno'}">modifica il giorno</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'giorni'}">torna alla lista di giorni</RouterLink>
    </div>
</template>
<style lang="scss" scoped></style>

