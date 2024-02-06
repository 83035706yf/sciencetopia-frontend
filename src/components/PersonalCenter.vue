<template>
  <div>
    <!-- 其他的个人中心内容 -->
    <PersonalInformation></PersonalInformation>

    <!-- 已收藏的知识网络图 -->
    <v-container class="knowledgegraph-container">
      <h3>我的收藏</h3>
      <v-row>
        <v-col cols="6" class="knowledge-graph">
          <FavoriteKnowledgeGraph />
        </v-col>
        <v-col cols="6">
          <NodeInfo></NodeInfo>
        </v-col>
      </v-row>
    </v-container>

    <!-- 已制定的学习计划 -->
    <v-container>
      <h3>我的学习计划</h3>
      <p v-if="studyPlanDataList.length === 0">你还没有创建任何学习计划</p>
      <v-col v-else v-for="item in studyPlanDataList" :key="item.studyPlan.title" cols="12">
        <v-card class="mb-3">
          <v-card-item>
            <v-row>
              <v-col cols="11">
                <study-plan :studyPlan="item.studyPlan"></study-plan>
              </v-col>
              <v-col cols="1" class="d-flex justify-end pt-4 pr-4">
                <v-btn small variant="text" color="red" @click="deleteStudyPlan(item.studyPlan.title)">删除</v-btn>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>
    </v-container>

    <!-- 已加入的学习小组 -->
    <v-container>
      <h3>我的学习小组</h3>
      <p>你还没有加入任何学习小组哦！</p>
    </v-container>
  </div>
</template>
  
<script>
import FavoriteKnowledgeGraph from './FavoriteKnowledgeGraph.vue';
import PersonalInformation from './PersonalInformation.vue';
import StudyPlan from './StudyPlan.vue';
import { apiClient } from '@/api';
import NodeInfo from './NodeInfo.vue';

export default {
  components: {
    FavoriteKnowledgeGraph,
    PersonalInformation,
    StudyPlan,
    NodeInfo
  },
  data() {
    return {
      studyPlanDataList: []
    }
  },
  created() {
    this.fetchStudyPlans();
  },
  methods: {
    async fetchStudyPlans() {
      try {
        const response = await apiClient.get('/StudyPlan/FetchStudyPlan');
        this.studyPlanDataList = response.data;
      } catch (error) {
        console.error('Error fetching study plans:', error);
        // Handle error as needed (e.g., show a notification to the user)
      }
    },

    async deleteStudyPlan(planTitle) {
      if (confirm('Are you sure you want to delete this study plan?')) {
        try {
          const response = await apiClient.delete(`/StudyPlan/DeleteStudyPlan`, { params: { studyPlanTitle: planTitle } });
          if (response.status === 200) {
            alert('Study plan deleted successfully.');
            this.fetchStudyPlans(); // Refresh the list of study plans
          } else {
            throw new Error('Failed to delete study plan.');
          }
        } catch (error) {
          console.error('Error deleting study plan:', error);
          alert('Error deleting study plan.');
        }
      }
    }
  }
}
</script>

<style scoped>
/* @import "../assets/css/layout.css"; */
@import "../assets/css/knowledge-graph.css";
/* #cy {
  width: 800px;
  height: 500px;
  border: 1px solid #ccc;
} */

/* #cy canvas {
  position: relative !important;
  margin: auto !important;
} */
</style>