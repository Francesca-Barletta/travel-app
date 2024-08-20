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
    <main>
      <RouterView/>
    </main>
  </div>

</template>

<style lang ="scss" scoped>

</style>

