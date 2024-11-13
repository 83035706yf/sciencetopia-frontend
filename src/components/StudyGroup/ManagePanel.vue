<template>
  <div class="manage-panel">
    <v-container>
      <v-row>
        <v-col cols="2">
          <!-- Side Navigation List -->
          <v-list>
            <v-list-item v-for="(item, index) in tabs" :key="index" :active="activeTab === index"
              @click="activeTab = index" class="list-item">
                <div style="display: flex; align-items: center;">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-badge style="margin-left: 20px; margin-bottom: 5px;" v-if="item.title === '加入请求' && pendingJoinRequests > 0" color="red"
                  :content="pendingJoinRequests" overlap></v-badge>
                </div>
            </v-list-item>
          </v-list>
        </v-col>

        <v-col cols="10">
          <!-- Tab Content -->
          <v-tab-item v-if="activeTab === 0">
            <GroupOverview :groupId="groupId" />
          </v-tab-item>
          <v-tab-item v-if="isManager && activeTab === 1">
            <MemberManagement :groupId="groupId" />
          </v-tab-item>
          <v-tab-item v-if="isManager && activeTab === 2">
            <JoinRequests :groupId="groupId" />
          </v-tab-item>
          <v-tab-item v-if="isManager && activeTab === 3">
            <ActivityLogs :groupId="groupId" />
          </v-tab-item>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import GroupOverview from './GroupOverview.vue';
import MemberManagement from './MemberManagement.vue';
import JoinRequests from './JoinRequests.vue';
import ActivityLogs from './ActivityLogs.vue';
import { apiClient } from '@/api';

export default {
  props: {
    groupId: String,
    pendingJoinRequests: Number
  },
  data() {
    return {
      isManager: false,
      activeTab: 0, // Default active tab
      tabs: [
        { title: '基础信息', component: GroupOverview },
        { title: '成员管理', component: MemberManagement },
        { title: '加入请求', component: JoinRequests },
        { title: '活动日志', component: ActivityLogs }
      ]
    };
  },
  async mounted() {
    const response = await apiClient.get(`/StudyGroup/GetUserRoleInGroup/${this.groupId}`);
    this.isManager = response.data === 'manager';

    // // Fetch pending join requests if the user is a manager
    // if (this.isManager) {
    //   const joinRequestsResponse = await apiClient.get(`/StudyGroup/GetPendingJoinRequestsCount/${this.groupId}`);
    //   this.pendingJoinRequests = joinRequestsResponse.data;
    // }

    // Filter tabs based on user role
    if (!this.isManager) {
      this.tabs = this.tabs.filter((tab, index) => index === 0);
    }
  },
  components: {
    GroupOverview,
    MemberManagement,
    JoinRequests,
    ActivityLogs
  }
};
</script>

<style scoped>
.manage-panel {
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.list-item {
  cursor: pointer;
  padding: 10px;
}

.list-item.active {
  background-color: #e0e0e0;
}

.v-tab-item {
  padding: 20px;
}
</style>