<script>
import AppHeader from './components/AppHeader.vue'
export default {
 components: {
  AppHeader
 }
}
</script>

<template>
  <div class="d-flex flex-column bg-dark min-vh-100">
    <AppHeader/>
    <main class="d-flex flex-column flex-grow-1">
      <RouterView/>
    </main>
  </div>

</template>

<style lang="scss" scoped>
main{
  background-image: url('../sfondo.jpg');
  background-size: cover;
}

</style>

