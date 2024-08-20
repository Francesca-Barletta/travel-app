<script>
export default {

}
</script>
<template>
    <div class="container">

        <h1 class="text-primary">Qui le tappe</h1>
        <RouterLink class="text-white m-3" :to="{name: 'dettagli-tappa'}">Vedi la tappa nel dettaglio</RouterLink>
        <RouterLink class="text-white m-3" to="/tappe/create">Aggiungi tappe</RouterLink>
    </div>
</template>
<style lang="scss" scoped></style>

