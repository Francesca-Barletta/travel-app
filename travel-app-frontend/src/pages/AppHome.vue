<script>
import { getDays } from '../services/days/index';
import { getAuth } from 'firebase/auth';

export default {
    data() {
        return {
            days: [],
            user: null,
            lastVisible: null,
            loading: false,
            hasMore: false,
            pageSize: 8
        };
    },
    async created() {
        try {
            await this.loadDays(); 
        } catch (error) {
            console.error('Error fetching days: ', error);
        }

        const auth = getAuth();
        this.user = auth.currentUser;
        auth.onAuthStateChanged(user => {
            this.user = user;
        });
    },
    methods: {
        async loadDays() {
            if (this.loading) return;

            this.loading = true;
            try {
                const result = await getDays(this.lastVisible, this.pageSize);
                this.days = [...this.days, ...result.days];
                this.lastVisible = result.newLastVisible;

                // console.log('length', result.days.length);
                // console.log('massimo', this.pageSize);

                if (result.days.length < this.pageSize) {
                    this.hasMore = false;
                } else {
                    this.hasMore = !!result.newLastVisible;
                }

            } catch (error) {
                console.error('Error loading days: ', error);
            } finally {
                this.loading = false;
            }
        },
        loadMore() {
            if (this.hasMore) {
                this.loadDays();
            }
        }
    }
}
</script>

<template>
    <div class="container flex-grow-1">
        <div class=" my-5">
            <h1 class="text-primary text-center bg-light mt-2 rounded p-4 shadow">Il mio diario di viaggio</h1>
        </div>
        <div class="container w-100 bg-light rounded p-3 mb-5">

            <div id="carouselExampleControls" class="carousel slide shadow" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <!-- Slide items -->
                    <div v-for="(day, dayIndex) in days" :key="day.id">
                        <div v-for="(photoUrl, photoIndex) in day.photoUrls" :key="photoIndex"
                            :class="['carousel-item', { active: dayIndex === 0 && photoIndex === 0 }]">
                            <img class="d-block w-100" style="aspect-ratio: 16/9; object-fit: cover;" :src="photoUrl"
                                :alt="'Slide ' + (photoIndex + 1)">
                        </div>
                    </div>
                </div>
                <!-- Controls -->
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </a>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>