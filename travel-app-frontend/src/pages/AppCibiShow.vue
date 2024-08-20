<script>
export default {

}
</script>
<template>
    <div class="container">

        <h1 class="text-primary">Qui i dettagli del cibo</h1>
        <RouterLink class="text-white m-3" :to="{name: 'modifica-cibo'}">modifica il cibo</RouterLink>
        <RouterLink class="text-white m-3" :to="{name: 'dettagli-tappa'}">torna indietro</RouterLink>
    </div>
</template>
<style lang="scss" scoped></style>

