<template>
    <div>
        <h1>学习计划</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>{{ studyPlan }}</div>
    </div>
</template>

<script>
import { pyApiClient } from '@/api';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    data() {
        return {
            studyPlan: '',
            loading: true
        };
    },
    setup() {
        const store = useStore();
        const selectedNode = computed(() => store.state.selectedNode);
        return { selectedNode };
    },
    async created() {
        if (this.selectedNode) {
            try {
                const response = await pyApiClient.post('/studyplan', {
                    Name: this.selectedNode.name,
                    Description: this.selectedNode.description
                });
                this.studyPlan = response.data.StudyPlan;
            } catch (error) {
                console.error('Error fetching the study plan:', error);
            } finally {
                this.loading = false;
            }
        } else {
            console.error('No selected node found');
            this.loading = false;
        }
    }
}
</script>

<style scoped>
/* Your styles here */
</style>
