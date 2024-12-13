<template>
  <div>
    <!-- Personal Information -->
    <!-- <v-card class="st-card"> -->
    <PersonalInformation :userId="userId">
      <v-btn variant="outlined" :style="{ backgroundColor: 'white' }" prepend-icon="mdi-email-outline"
        @click="startOrLoadConversation(userId)">
        <template v-slot:prepend>
          <v-icon color="#ff4d4d"></v-icon>
        </template>
        {{ $t('message.sendmessage') }}
      </v-btn>
    </PersonalInformation>
    <!-- </v-card> -->

    <!-- <v-divider inset color="text" opacity="1"></v-divider> -->

    <!-- Study Plans Section -->
    <v-container>
      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto" style="position: relative;left: 20vw;">
          <div class="split-color-container">
            <h3 class="split-color-text" style="font-size: 48px !important;">
              {{ isCurrentUser ? $t('usercenter.my') : $t('usercenter.their') }}{{ $t('wordbreaker') }}{{
                $t('usercenter.studyplan') }}
            </h3>
          </div>
        </v-col>
        <v-col class="d-flex align-center justify-center">
          <v-tabs class="dot-lattice-container"
            style="min-width: 600px !important;height: 100px; align-items: center; justify-content: center; padding: 10px 0px 10px 10px !important;"
            v-model="activeTab" background-color="primary" dark>
            <v-tab>
              <h3 class="plan-tab-text">{{ $t('studyplan.inprogress') }}</h3>
            </v-tab>
            <v-tab>
              <h3 class="plan-tab-text">{{ $t('studyplan.completed') }}</h3>
            </v-tab>
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
                  <StudyPlan :userId="userId" :studyPlan="item.studyPlan" @resourceUpdated="handleResourceUpdated">
                  </StudyPlan>
                </v-col>
                <v-col cols="1" class="d-flex justify-end pt-4 pr-4">
                  <v-btn small variant="text" color="red" @click="deleteStudyPlan(item.studyPlan.title)">
                    {{ $t('delete') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
        <div v-if="activeStudyPlans.length === 0">
          <v-container>
            <v-card class="d-flex align-center justify-center">
              <v-card-title>
                {{ isCurrentUser
                  ? $t('studyplan.noprogress_my')
                  : $t('studyplan.noprogress_their') }}
              </v-card-title>
            </v-card>
          </v-container>
        </div>
      </v-tab-item>

      <!-- Completed Study Plans -->
      <v-tab-item v-if="activeTab === 1">
        <v-col v-for="item in completedStudyPlans" :key="item.studyPlan.id" cols="12">
          <v-card class="mb-3">
            <v-card-item>
              <v-row>
                <v-col cols="11">
                  <StudyPlan :userId="userId" :studyPlan="item.studyPlan" @resourceUpdated="handleResourceUpdated">
                  </StudyPlan>
                </v-col>
                <v-col cols="1" class="d-flex justify-end pt-4 pr-4">
                  <v-btn small variant="text" color="red" @click="deleteStudyPlan(item.studyPlan.title)">
                    {{ $t('delete') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-item>
          </v-card>
        </v-col>
        <div v-if="completedStudyPlans.length === 0">
          <v-container>
            <v-card class="d-flex align-center justify-center">
              <v-card-title>
                {{ isCurrentUser
                  ? $t('studyplan.nocompleted_my')
                  : $t('studyplan.nocompleted_their') }}
              </v-card-title>
            </v-card>
          </v-container>
        </div>
      </v-tab-item>
    </v-container>

    <!-- <v-divider inset color="text" opacity="1"></v-divider> -->

    <!-- Study Groups Section -->
    <v-container>
      <div class="split-color-container">
        <h3 class="split-color-text" style="font-size: 48px;">
          {{ isCurrentUser ? $t('usercenter.my') : $t('usercenter.their') }}{{ $t('wordbreaker') }}{{
            $t('usercenter.studygroup') }}
        </h3>
      </div>
      <v-spacer style="height: 30px;"></v-spacer>
      <div v-if="studyGroupList.length === 0">
        <v-container>
          <v-card class="d-flex align-center justify-center">
            <v-card-title>
              {{ isCurrentUser
                ? $t('studygroup.nogroup_my')
                : $t('studygroup.nogroup_their') }}
            </v-card-title>
          </v-card>
        </v-container>
      </div>
      <v-row v-else>
        <v-col v-for="group in studyGroupList" :key="group.id" cols="12" sm="6" md="4">
          <v-card class="mb-3 st-card" style="width: 400px; height: 300px;">
            <v-card-title>
              {{ group.name }}
              <v-chip class="ml-auto" color="primary" label>{{ group.role }}</v-chip>
              <v-chip v-if="group.status === 'pending_approval'" class="ml-auto" color="primary" label>
                {{ group.status }}
              </v-chip>
            </v-card-title>
            <v-card-subtitle v-html="group.description"></v-card-subtitle>
            <v-card-actions>
              <v-btn text @click="toGroupPage(group.id)">
                {{ $t('showdetail') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PersonalInformation from "./PersonalInformation.vue";
import StudyPlan from "./StudyPlan.vue";
import { apiClient } from "@/api";

export default {
  components: {
    PersonalInformation,
    StudyPlan,
  },
  props: {
    userId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      studyPlanDataList: [],
      studyGroupList: [],
      activeTab: 0,
      currentUserId: this.$store.state.currentUserID,
    };
  },
  created() {
    this.fetchDataForUser();
  },
  computed: {
    isCurrentUser() {
      return this.userId === this.currentUserId;
    },
    activeStudyPlans() {
      return this.studyPlanDataList.filter((item) => !item.studyPlan.completed);
    },
    completedStudyPlans() {
      return this.studyPlanDataList.filter((item) => item.studyPlan.completed);
    },
  },
  methods: {
    async fetchDataForUser() {
      try {
        const studyPlanResponse = await apiClient.get(`/StudyPlan/FetchStudyPlans`, {
          params: { targetUserId: this.userId },
        });
        this.studyPlanDataList = studyPlanResponse.data;

        const studyGroupResponse = await apiClient.get(`/StudyGroup/GetStudyGroup`, {
          params: { targetUserId: this.userId },
        });
        this.studyGroupList = studyGroupResponse.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async deleteStudyPlan(planTitle) {
      if (confirm(this.$t("studyplan.confirmdelete"))) {
        try {
          const response = await apiClient.delete(`/StudyPlan/DeleteStudyPlan`, {
            params: { studyPlanTitle: planTitle },
          });
          if (response.status === 200) {
            alert(this.$t("studyplan.deletesuccess"));
            this.fetchDataForUser();
          } else {
            throw new Error(this.$t("studyplan.deletefailed"));
          }
        } catch (error) {
          console.error("Error deleting study plan:", error);
          alert(this.$t("studyplan.deletefailed"));
        }
      }
    },
    async handleResourceUpdated() {
      await this.fetchDataForUser();
    },
    toGroupPage(groupId) {
      this.$router.push({ name: "studyGroupPage", params: { groupId } });
    },
    async startOrLoadConversation(otherUserId) {
      const currentUserId = this.currentUserId;

      try {
        const conversationData = await this.$root.$signalRConnection.invoke(
          "GetOrStartConversation",
          currentUserId,
          otherUserId
        );

        this.$router.push({
          name: "directMessages",
          params: { userId: currentUserId },
          query: { conversationId: conversationData.ConversationId },
        });
      } catch (error) {
        console.error("Error starting or loading conversation:", error);
      }
    },
  },
};
</script>
