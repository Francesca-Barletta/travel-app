<script>
import {getAuth, signOut} from 'firebase/auth';
 export default {
    data() {
        return {
            user: null
        }
    },
    created(){
        const auth = getAuth();
        this.user = auth.currentUser;
        auth.onAuthStateChanged(user => {
            this.user = user
        });
    },
    methods: {
        async logout() {
            const auth = getAuth();
            try{
                await signOut(auth);
                this.$router.push('/login');
            }catch (error) {
                console.error('logout failed:', error);
            }
        }
    }

}
</script>

<template>
    <nav class=" bg-primary d-flex justify-content-between align-items-center py-2 px-4 g-3">


        <RouterLink class="text-white m-3 text-decoration-none" to="/">
            <h3 class="text-white">Diario di viaggio</h3>
        </RouterLink>
        <div class="d-flex gap-2 me-3">
            <RouterLink class="btn btn-light" to="/giorni">Giorni</RouterLink>

            <RouterLink class="btn btn-light" to="/tappe">Tappe</RouterLink>
      
            <button v-if="user" @click="logout" class="btn btn-outline-light">Logout</button>

            <RouterLink v-else class="btn btn-outline-light" to="/login">Login</RouterLink>
        </div>
    </nav>
</template>

<style lang ="scss" scoped>

</style>


