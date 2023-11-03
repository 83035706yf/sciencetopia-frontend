<template>
    <div>
        <h1>学习计划</h1>
        <button v-if="selectedNode && selectedNode.name" @click="fetchStudyPlan">创建学习计划</button>
        <v-card v-if="!loading && studyPlan" class="mx-auto" max-width="500">
            <v-card-title>
                Learning Plan
            </v-card-title>
            <v-card-text>
                {{ studyPlan }}
            </v-card-text>
        </v-card>
        <div v-if="loading">Loading...</div>
    </div>
</template>

<script>
import { pyApiClient } from '@/api';

export default {
    data() {
        return {
            studyPlan: '',
            loading: false  // initially set to false
        };
    },
    computed: {
        selectedNode() {
            return this.$store.state.selectedNode;
        }
    },
    methods: {
        async fetchStudyPlan() {
            if (this.selectedNode) {
                this.loading = true;  // set loading to true when fetching
                try {
                    const response = await pyApiClient.post('/studyplan', {
                        Name: this.selectedNode.name,
                        Description: this.selectedNode.description
                    });
                    this.studyPlan = response.data.StudyPlan;
                } catch (error) {
                    console.error('Error fetching the study plan:', error);
                } finally {
                    this.loading = false;  // set loading to false when done fetching
                }
            } else {
                console.error('No selected node found');
            }
        }
    }
}
</script>

<style scoped>
/* Your styles here */
</style>
