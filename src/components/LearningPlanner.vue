<!-- Planner.vue -->
<template>
    <div>
      <input type="text" v-model="learningObjective" placeholder="输入你的学习目标，订制一个学习计划" />
      <button :disabled="!learningObjective" @click="generateStudyPlan">开始定制</button>
      <study-plan v-if="showStudyPlan" :studyPlan="studyPlanData" @save-plan="savePlan"></study-plan>
    </div>
  </template>
  
  <script>
  import StudyPlan from './StudyPlan.vue';
  import studyPlanData from '@/data/mockStudyPlan.json';
  import { apiClient } from '@/api';
  
  export default {
    components: {
      StudyPlan
    },
    data() {
      return {
        learningObjective: '',
        showStudyPlan: false,
        studyPlanData: studyPlanData
      };
    },
    methods: {
      generateStudyPlan() {
        if (this.learningObjective) {
          this.showStudyPlan = true;
          this.$emit('update:showStudyPlan', true); // Emit an event
        }
      },
      async savePlan() {
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
  };
  </script>
