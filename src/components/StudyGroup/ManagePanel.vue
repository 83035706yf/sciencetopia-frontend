<template>
  <v-container class="manage-panel">
    <v-row>
      <v-col cols="2">
        <!-- Side Navigation List -->
        <v-list variant="plain" class="tab-list">
          <v-list-item
            color="secondary"
            v-for="(item, index) in tabs"
            :key="index"
            :active="activeTab === index"
            @click="activeTab = index"
            class="list-item"
          >
            <div style="display: flex; align-items: center; margin-left: 6vw">
              <v-list-item-title style="font-size: 1.2rem">{{
                item.title
              }}</v-list-item-title>
              <v-badge
                style="margin-left: 20px; margin-bottom: 5px"
                v-if="item.title === '加入请求' && pendingJoinRequests > 0"
                color="red"
                :content="pendingJoinRequests"
                overlap
              ></v-badge>
            </div>
          </v-list-item>
        </v-list>
      </v-col>

      <v-col cols="10">
        <!-- Tab Content -->
        <div v-if="activeTab === 0" class="tab-content">
          <GroupOverview :groupId="groupId" />
        </div>
        <div v-if="isManager && activeTab === 1" class="tab-content">
          <MemberManagement :groupId="groupId" />
        </div>
        <div v-if="isManager && activeTab === 2" class="tab-content">
          <JoinRequests :groupId="groupId" />
        </div>
        <div v-if="isManager && activeTab === 3" class="tab-content">
          <ActivityLogs :groupId="groupId" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import GroupOverview from './GroupOverview.vue'
import MemberManagement from './MemberManagement.vue'
import JoinRequests from './JoinRequests.vue'
import ActivityLogs from './ActivityLogs.vue'
import { apiClient } from '@/api'

export default {
  props: {
    groupId: String,
    pendingJoinRequests: Number,
  },
  data() {
    return {
      isManager: false,
      activeTab: 0, // Default active tab
      tabs: [
        { title: '基础信息', component: GroupOverview },
        { title: '成员管理', component: MemberManagement },
        { title: '加入请求', component: JoinRequests },
        { title: '活动日志', component: ActivityLogs },
      ],
    }
  },
  async mounted() {
    const response = await apiClient.get(
      `/StudyGroup/GetUserRoleInGroup/${this.groupId}`
    )
    this.isManager = response.data === 'manager'

    // // Fetch pending join requests if the user is a manager
    // if (this.isManager) {
    //   const joinRequestsResponse = await apiClient.get(`/StudyGroup/GetPendingJoinRequestsCount/${this.groupId}`);
    //   this.pendingJoinRequests = joinRequestsResponse.data;
    // }

    // Filter tabs based on user role
    if (!this.isManager) {
      this.tabs = this.tabs.filter((tab, index) => index === 0)
    }
  },
  components: {
    GroupOverview,
    MemberManagement,
    JoinRequests,
    ActivityLogs,
  },
}
</script>

<style scoped>
.manage-panel {
  display: flex;
  flex-direction: row;
  /* background-color: #F4EEE1; */
  height: 84vh;
  position: relative;
  top: -3vh;
  /* box-shadow: 0px 4px 8px 4px rgba(0, 0, 0, 0.05) !important; */
}

.tab-list {
  background-color: #f4eee1;
  padding: 0;
  box-shadow: -8px 4px 8px 0px rgba(0, 0, 0, 0.05) !important;
  height: 100%;
  overflow-y: auto;
}

.tab-content {
  background-color: #f4eee1;
  padding: 0;
  box-shadow: 8px 4px 8px 0px rgba(0, 0, 0, 0.05) !important;
  height: 100%;
  overflow-y: auto;
}

.list-item {
  cursor: pointer;
  padding: 10px;
  padding-bottom: 8px;
  opacity: 1 !important;
  position: relative;
  /* transform: rotate(-30deg); */
  max-width: 300px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px !important;
    /* Adjust thickness of underline */
    background-color: #ec0017 !important;
    /* Underline color */
    transform: scaleX(0) !important;
    /* Initially hidden */
    transform-origin: left !important;
    /* Animate from left to right */
    transition: transform 0.3s ease-in-out !important;
  }
}

.list-item.active {
  background-color: #e0e0e0;
}

.v-tab-item {
  padding: 20px;
}
</style>
