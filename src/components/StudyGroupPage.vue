<template>
  <div class="group-page">
    <v-tabs v-model="activeTab">
      <v-tab>小组信息</v-tab>
      <v-tab>小组动态</v-tab>
      <v-tab>学习路径</v-tab>
      <v-tab v-if="group.role='manager'">管理</v-tab>
    </v-tabs>

    <v-tab-item v-if="activeTab === 0">
      <v-card>
        <v-card-title>{{ group.name }}</v-card-title>
        <v-card-subtitle>{{ group.description }}</v-card-subtitle>
        <!-- Additional group information -->
        <v-img
          aspect-ratio="16/9"
          cover
          :src="group.imageurl ? group.imageurl : require('@/assets/images/default_study_group.png')"
        ></v-img>
        <v-card-text>
          小组成员:
          <v-row>
            <v-col v-for="member in group.members" :key="member.id" cols="auto">
              <v-btn icon="dots-vertical" size="40">
                <v-avatar size="35">
                  <img :src="member.avatarUrl" alt="用户头像">
                </v-avatar>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="group.isMember" color="primary" text disabled>已加入</v-btn>
          <template v-else>
            <v-btn color="primary" text @click="applyToJoin(group.id)">申请加入</v-btn>
            <v-btn color="primary" text @click="follow(group.id)">关注</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 1">
      <v-card>
        <v-card-title>小组动态</v-card-title>
        <!-- Admin board content goes here -->
        <v-card-text>
          <p>学习小组的动态空间。</p>
          <!-- Add your admin board controls and details here -->
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 2">
      <v-card>
        <v-card-title>学习路径共享</v-card-title>
        <!-- Admin board content goes here -->
        <v-card-text>
          <p>学习小组共享的学习路径。</p>
          <!-- Add your admin board controls and details here -->
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 3 && group.role === 'manager'">
      <v-card>
        <v-card-title>管理面板</v-card-title>
        <!-- Admin board content goes here -->
        <v-card-text>
          <p>管理小组成员、设置权限等。</p>
          <!-- Add your admin board controls and details here -->
        </v-card-text>
      </v-card>
    </v-tab-item>
  </div>
</template>
  
<script>
import { apiClient } from '@/api';

export default {
  props: {
    groupId: Number
  },
  data() {
    return {
      group: {}, // Group details fetched based on groupId
      activeTab: 0 // Track the active tab
    };
  },
  methods: {
    // Fetch group details from the backend
    async fetchGroupDetails(groupId) {
      try {
        const response = await apiClient.get(`/StudyGroup/GetStudyGroupById/${groupId}`);
        const group = response.data;
        const members = await Promise.all(group.memberIds.map(async memberId => ({
          id: memberId.id,
          avatarUrl: await this.$store.dispatch('fetchAvatarUrl', memberId.id)
        })));
        const isMember = group.memberIds.some(memberId => memberId.id === this.$store.state.currentUserID);
        this.group = { ...group, members, isMember }; // Replace memberIds with members including avatars
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    },
    goToAdminBoard(groupId) {
      // Logic to navigate to the admin board page
      this.$router.push({ name: 'adminBoardPage', params: { groupId } });
    },
  },
  mounted() {
    // Fetch group details from the backend on component mount
    this.fetchGroupDetails(this.groupId);
  }
};
</script>
  
<style scoped>
.v-img {
  max-width: 1600px;
  max-height: 500px;
}
</style>