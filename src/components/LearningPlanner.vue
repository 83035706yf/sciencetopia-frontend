<!-- Planner.vue -->
<template>
  <div>
    <input type="text" v-model="learningObjective" placeholder="输入你的学习目标，订制一个学习计划" />
    <button :disabled="!learningObjective" @click="generateStudyPlan">开始定制</button>
    
    <!-- Loader Spinner -->
    <div v-if="loading" class="loader">AI小助手为您生成学习计划中...</div>

    <study-plan v-if="showStudyPlan" :studyPlan="studyPlanData" @save-plan="savePlan"></study-plan>
  </div>
</template>

<script>
import StudyPlan from './StudyPlan.vue';
import { apiClient, pyApiClient } from '@/api';

export default {
  components: {
    StudyPlan
  },
  data() {
    return {
      learningObjective: '',
      showStudyPlan: false,
      studyPlanData: null,
      loading: false  // Add this to track loading state
    };
  },
  methods: {
    async generateStudyPlan() {
      if (this.learningObjective) {
        this.loading = true;  // Start loading

        console.log('Generating study plan for:', this.learningObjective);

        try {
          const response = await pyApiClient.post('/studyplan', {
            Name: this.learningObjective,
          });

          console.log('Study plan generated:', response);

          if (response.status === 200) {
            this.studyPlanData = response.data.StudyPlan; // Set study plan data from the backend response
            this.showStudyPlan = true; // Display the study plan component
            this.$emit('update:showStudyPlan', true); // Emit an event to the parent component
            console.log('Study plan generated:', this.studyPlanData);
          } else {
            console.error('Failed to fetch the study plan:', response);
          }
        } catch (error) {
          console.error('Error in fetching study plan:', error);
        } finally {
          this.loading = false;  // End loading
        }
      }
    },
    async savePlan() {
      if (this.studyPlanData) {
        this.loading = true;
        try {
          // Construct the studyPlanDTO object
          const studyPlanDTO = {
            studyPlan: { // This matches the 'StudyPlan' property in your StudyPlanDTO class
              title: this.studyPlanData.title, // Assuming this is where the title comes from
              introduction: this.studyPlanData.introduction, // Assuming this is where the introduction comes from
              prerequisite: this.studyPlanData.prerequisite, // Populate this with the prerequisite lessons
              mainCurriculum: this.studyPlanData.mainCurriculum, // Assuming this is your main curriculum data
              advancedTopics: this.studyPlanData.advancedTopics // Assuming this is your advanced topics data
            }
          };
          console.log('Saving study plan:', studyPlanDTO);

          // API endpoint is '/StudyPlan/SaveStudyPlan'
          const response = await apiClient.post('/StudyPlan/SaveStudyPlan', studyPlanDTO);

          if (response.status === 200) {
            // Handle successful save
            alert('学习计划保存成功!');
            // Check if the current route is the user's personal center
            if (this.$route.name === 'personalcenter') {
              // Refresh the page
              this.$router.go(); // This reloads the current route
            }
            // If not on the personal center page, do nothing
          } else {
            // Handle failure
            alert('学习计划保存失败。');
            console.error('Failed to save the study plan:', response);
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data); // Alert the message from backend
          } else {
            alert('学习计划保存失败。');
            console.error('Failed to save the study plan:', error);
          }
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
