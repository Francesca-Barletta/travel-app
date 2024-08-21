  <script>
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: ''
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
      }
    }
  };
  </script>

  <template>
    <div>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="email">Email:</label>
        <input type="email" v-model="email" />
        <label for="password">Password:</label>
        <input type="password" v-model="password" />
        <button type="submit">Login</button>
        <p v-if="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <style lang="scss" scoped></style>
  