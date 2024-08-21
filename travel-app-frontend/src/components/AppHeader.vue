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
    <nav class=" bg-primary d-flex justify-content-between">

        
        <RouterLink class="text-white m-3" to="/"><h3 class="text-white">Le mie vacanze</h3></RouterLink>
    <div class="d-flex ">
        <RouterLink class="text-white m-3" to="/giorni">giorni</RouterLink>
      
        <RouterLink class="text-white m-3" to="/tappe">tappe</RouterLink>
    </div>
    <div v-if="user">
        <button @click="logout">Logout</button>
    </div>
    <div v-else>
        <RouterLink class="text-white m-3" to="/login">Login</RouterLink>
    </div>
    </nav>
</template>

<style lang ="scss" scoped>

</style>


