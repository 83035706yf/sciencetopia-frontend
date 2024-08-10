<template>
    <div class="manage-panel">
      <v-container>
        <v-row>
          <v-col cols="2">
            <!-- Side Navigation List -->
            <v-list>
              <v-list-item
                v-for="(item, index) in tabs"
                :key="index"
                :active="activeTab === index"
                @click="activeTab = index"
                class="list-item"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
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
              <GroupSettings :groupId="groupId" />
            </v-tab-item>
            <v-tab-item v-if="isManager && activeTab === 4">
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
  import GroupSettings from './GroupSettings.vue';
  import ActivityLogs from './ActivityLogs.vue';
  import { apiClient } from '@/api';
  
  export default {
    props: {
      groupId: String
    },
    data() {
      return {
        isManager: false,
        activeTab: 0, // Default active tab
        tabs: [
          { title: '小组概览', component: GroupOverview },
          { title: '成员管理', component: MemberManagement },
          { title: '加入请求', component: JoinRequests },
          { title: '小组设置', component: GroupSettings },
          { title: '活动日志', component: ActivityLogs }
        ]
      };
    },
    async mounted() {
      const response = await apiClient.get(`/StudyGroup/GetUserRoleInGroup/${this.groupId}`);
      this.isManager = response.data === 'manager';
      // Filter tabs based on user role
      if (!this.isManager) {
        this.tabs = this.tabs.filter((tab, index) => index === 0);
      }
    },
    components: {
      GroupOverview,
      MemberManagement,
      JoinRequests,
      GroupSettings,
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
  