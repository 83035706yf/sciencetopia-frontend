<template>
  <div>
    <!-- Personal Information -->
    <PersonalInformation :userId="userId">
      <v-btn variant="outlined" :style="{ backgroundColor: 'white' }" prepend-icon="mdi-email-outline"
        @click="startOrLoadConversation(userId)">
        <template v-slot:prepend>
          <v-icon color="#ff4d4d"></v-icon>
        </template>
        {{ $t('message.sendmessage') }}
      </v-btn>
    </PersonalInformation>

    <!-- Study Plans Section -->
    <v-container>
      <v-row class="d-flex align-center">
        <v-col cols="auto">
          <h3>{{ isCurrentUser ? $t('usercenter.my') : $t('usercenter.their') }}{{ $t('wordbreaker') }}{{ $t('usercenter.studyplan') }}</h3>
        </v-col>
        <v-col>
          <v-tabs v-model="activeTab" background-color="primary" dark>
            <v-tab>{{ $t('studyplan.inprogress') }}</v-tab>
            <v-tab>{{ $t('studyplan.completed') }}</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <!-- Active Study Plans -->
      <v-tab-item v-if="activeTab === 0">
        <v-col v-for="item in activeStudyPlans" :key="item.studyPlan.id" cols="12">
          <v-card class="mb-3">
            <v-card-item>
              <v-row>
                <v-col cols="11">
                  <study-plan :userId="userId" :studyPlan="item.studyPlan"
                    @resourceUpdated="handleResourceUpdated"></study-plan>
                </v-col>
                <v-col cols="1" class="d-flex justify-end pt-4 pr-4">
                  <v-btn small variant="text" color="red" @click="deleteStudyPlan(item.studyPlan.title)">{{ $t('delete') }}</v-btn>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
        <p v-if="activeStudyPlans.length === 0">{{ isCurrentUser ? '你还没有进行中的学习计划' : 'TA还没有进行中的学习计划' }}</p>
      </v-tab-item>

      <!-- Completed Study Plans -->
      <v-tab-item v-if="activeTab === 1">
        <v-col v-for="item in completedStudyPlans" :key="item.studyPlan.id" cols="12">
          <v-card class="mb-3">
            <v-card-item>
              <v-row>
                <v-col cols="11">
                  <study-plan :userId="userId" :studyPlan="item.studyPlan"
                    @resourceUpdated="handleResourceUpdated"></study-plan>
                </v-col>
                <v-col cols="1" class="d-flex justify-end pt-4 pr-4">
                  <v-btn small variant="text" color="red" @click="deleteStudyPlan(item.studyPlan.title)">{{ $t('delete') }}</v-btn>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
        <div v-if="completedStudyPlans.length === 0">
          <p>{{ isCurrentUser ? '你还没有完成的学习计划' : 'TA还没有完成的学习计划' }}</p>
        </div>
      </v-tab-item>
    </v-container>

    <!-- Study Groups Section -->
    <v-container>
      <h3>{{ isCurrentUser ? $t('usercenter.my') : $t('usercenter.their') }}{{ $t('wordbreaker') }}{{ $t('usercenter.studygroup') }}</h3>
      <v-spacer style="height: 10px;"></v-spacer>
      <p v-if="studyGroupList.length === 0">{{ isCurrentUser ? '你还没有加入任何学习小组哦！' : 'TA还没有加入任何学习小组哦！' }}</p>
      <v-row v-else>
        <v-col v-for="group in studyGroupList" :key="group.id" cols="12" sm="6" md="4">
          <v-card class="mb-3">
            <v-card-title>
              {{ group.name }}
              <v-chip class="ml-auto" color="primary" label>{{ group.role }}</v-chip>
              <v-chip v-if="group.status === 'pending_approval'" class="ml-auto" color="primary" label>{{ group.status
                }}</v-chip>
            </v-card-title>
            <v-card-subtitle v-html="group.description"></v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="toGroupPage(group.id)">{{ $t('showdetail') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Scroll to Top Button -->
    <ScrollToTopButton />
  </div>
</template>

<script>
import PersonalInformation from './PersonalInformation.vue';
import StudyPlan from './StudyPlan.vue';
import { apiClient } from '@/api';
import ScrollToTopButton from "@/components/ScrollToTopButton.vue";

export default {
  components: {
    PersonalInformation,
    StudyPlan,
    ScrollToTopButton
  },
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      studyPlanDataList: [],
      studyGroupList: [],
      activeTab: 0,
      currentUserId: this.$store.state.currentUserID  // Get the current user's ID from Vuex store
    };
  },
  created() {
    this.fetchDataForUser(); // Fetch data for the current or other user based on userId
  },
  computed: {
    isCurrentUser() {
      return this.userId === this.currentUserId;
    },
    activeStudyPlans() {
      // Filter active (incomplete) study plans
      return this.studyPlanDataList.filter(item => !item.studyPlan.completed);
    },
    completedStudyPlans() {
      // Filter completed study plans
      return this.studyPlanDataList.filter(item => item.studyPlan.completed);
    }
  },
  watch: {
    userId: 'fetchDataForUser'  // Watch for changes in userId to fetch data for the correct user
  },
  methods: {
    async fetchDataForUser() {
      try {
        const studyPlanResponse = await apiClient.get(`/StudyPlan/FetchStudyPlans`, { params: { targetUserId: this.userId } });
        this.studyPlanDataList = studyPlanResponse.data;

        const studyGroupResponse = await apiClient.get(`/StudyGroup/GetStudyGroup`, { params: { targetUserId: this.userId } });
        this.studyGroupList = studyGroupResponse.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    async deleteStudyPlan(planTitle) {
      if (confirm('确定要删除这个学习计划吗?')) {
        try {
          const response = await apiClient.delete(`/StudyPlan/DeleteStudyPlan`, { params: { studyPlanTitle: planTitle } });
          if (response.status === 200) {
            alert('Study plan deleted successfully.');
            this.fetchDataForUser(); // Refresh the list of study plans
          } else {
            throw new Error('Failed to delete study plan.');
          }
        } catch (error) {
          console.error('Error deleting study plan:', error);
          alert('Error deleting study plan.');
        }
      }
    },

    async handleResourceUpdated() {
      await this.fetchDataForUser();
    },

    toGroupPage(groupId) {
      this.$router.push({ name: 'studyGroupPage', params: { groupId } });
    },

    async startOrLoadConversation(otherUserId) {
      const currentUserId = this.currentUserId;

      try {
        // Call the SignalR hub to get or create a conversation
        const conversationData = await this.$root.$signalRConnection.invoke("GetOrStartConversation", currentUserId, otherUserId);

        // Navigate to MessageCenter with the conversation ID in the query
        this.$router.push({
          name: 'directMessages',
          params: { userId: currentUserId },
          query: { conversationId: conversationData.ConversationId }
        });
      } catch (error) {
        console.error("Error starting or loading conversation:", error);
      }
    }
  }
};
</script>

<style scoped>
.v-chip {
  margin-left: auto;
  margin-right: 16px;
  font-weight: bold;
}

.d-flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.pt-4 {
  padding-top: 16px;
}

.pr-4 {
  padding-right: 16px;
}

.mb-3 {
  margin-bottom: 16px;
}
</style>
