<template>
    <div>
        <v-btn @click="fetchStudyPlan">规划器</v-btn>
        <v-card v-if="!loading && studyPlan" class="mx-auto" max-width="500">
            <v-card-title>
                Learning Plan
            </v-card-title>
            <v-card-text>
                {{ studyPlan }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="saveStudyPlan">保存学习计划</v-btn>
            </v-card-actions>
        </v-card>
        <div v-if="loading">Loading...</div>
    </div>
</template>

<script>
import { pyApiClient } from '@/api';
import { apiClient } from '@/api';

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
        },
        async saveStudyPlan() {
            if (this.studyPlan) {
                this.loading = true;
                try {
                    // 假设你的API端点是 '/user/studyplan'
                    const response = await apiClient.post('/user/studyplan', {
                        userId: this.$store.state.user.id, // 假设用户ID存储在Vuex store的state中
                        name: this.selectedNode.name,
                        content: this.studyPlan
                    });
                    if (response.data.success) {
                        // 处理成功保存
                        this.$emit('saved', true);
                        this.$store.dispatch('fetchUserStudyPlans'); // 假设你有一个Vuex action来获取用户的学习计划
                    } else {
                        // 处理错误情况
                        console.error('Failed to save the study plan:', response.data.message);
                    }
                } catch (error) {
                    console.error('Error saving the study plan:', error);
                } finally {
                    this.loading = false;
                }
            } else {
                console.error('No study plan to save');
            }
        }
    }
}
</script>

<style scoped>
/* Your styles here */
</style>
