<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      passwordVisible: false
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push({ name: 'home' });
      } catch (e) {
        this.error = 'Login failed: ' + e.message;
      }
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    }
  }
};
</script>

<template>
  <h1 class="text-center text-light my-5">Login</h1>
  <div class="d-flex justify-content-center w-75 m-auto p-4 align-items- gap-4 m-5 bg-primary rounded shadow">
    <form @submit.prevent="login" class="w-75">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label text-light">Email:</label>
        <input type="email"  autocomplete="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="email">
      </div>
      <div class="mb-3 position-relative">
        <label for="exampleInputPassword1" class="form-label text-light">Password:</label>
        <input :type="passwordVisible ? 'text' : 'password'" class="form-control"   autocomplete="current-password"  id="exampleInputPassword1" v-model="password">
        <!-- Icona per mostrare/nascondere la password -->
        <span @click="togglePasswordVisibility" class="position-absolute" style="cursor: pointer;">
          <i :class="passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'" style="font-size: 1.2rem;"></i>
        </span>
      </div>
      <button type="submit" class="btn btn-light">Accedi</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

  
<style lang="scss" scoped>

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
  right: 10px;
  top:35px;
}
</style>
  