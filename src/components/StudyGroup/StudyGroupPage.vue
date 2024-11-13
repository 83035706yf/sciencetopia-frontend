<template>
  <div class="group-page">
    <v-tabs v-model="activeTab" @change="onTabChange">
      <v-tab>小组信息</v-tab>
      <v-tab>小组动态</v-tab>
      <v-tab>学习路径</v-tab>
      <v-tab v-if="role === 'manager'">管理面板
        <v-badge style="margin-left: 20px; margin-bottom: 5px;" v-if="pendingJoinRequests > 0" color="red"
          :content="pendingJoinRequests" overlap></v-badge>
      </v-tab>
    </v-tabs>

    <v-tab-item v-if="activeTab === 0">
      <v-card>
        <v-card-title>{{ group.name }}</v-card-title>
        <v-card-subtitle v-html="group.description"></v-card-subtitle>
        <!-- Additional group information -->
        <v-img aspect-ratio="16/9" cover
          :src="group.imageurl ? group.imageurl : require('@/assets/images/default_study_group.png')"></v-img>
        <v-card-text>
          小组成员:
          <v-row>
            <v-col v-for="member in group.memberIds" :key="member.id" cols="auto">
              <v-btn icon="dots-vertical" size="40" @click="navigateToProfile(member.id)">
                <v-avatar size="35">
                  <img :src="member.avatarUrl" alt="用户头像">
                </v-avatar>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <template v-if="isMember">
            <v-btn color="primary" text disabled>已加入</v-btn>

          </template>
          <template v-else>
            <v-btn color="primary" text @click="applyToJoin(group.id)">申请加入</v-btn>
            <v-btn color="primary" text @click="follow(group.id)">关注</v-btn>
          </template>
          <template v-if="isMember & role === 'manager'">
            <v-btn color="red" variant="outlined" @click="promptDissoveGroup(groupId)">解散小组</v-btn>
            <!-- Confirmation Dialog -->
            <v-dialog v-model="DissolveDialog" max-width="600px">
              <v-card>
                <!-- Dialog Title with Warning Icon -->
                <v-card-title class="headline" style="color: red;">
                  <v-icon left color="red">mdi-alert-circle</v-icon> 危险操作
                </v-card-title>

                <!-- Dialog Content -->
                <v-card-text>
                  <p>你确定要解散该学习小组吗？此操作不可撤销。</p>
                  <v-spacer style="height: 20px;"></v-spacer>
                  <p>请输入小组名称以继续:</p>
                  <v-spacer style="height: 10px;"></v-spacer>
                  <v-text-field v-model="enteredGroupName" label="小组名称" variant="outlined" required
                    color="red"></v-text-field>
                </v-card-text>

                <!-- Dialog Actions with Warning Styling -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="confirmDissolveGroup">确定</v-btn>
                  <v-btn color="grey darken-1" text @click="cancelDissolveGroup">取消</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
          <template v-else-if="isMember">
            <v-btn color="red" variant="outlined" @click="promptLeaveGroup(groupId)">退出小组</v-btn>

            <!-- Confirmation Dialog -->
            <v-dialog v-model="leaveDialog" max-width="600px">
              <v-card>
                <!-- Dialog Title with Warning Icon -->
                <v-card-title class="headline" style="color: red;">
                  <v-icon left color="red">mdi-alert-circle</v-icon> 危险操作
                </v-card-title>

                <!-- Dialog Content -->
                <v-card-text>
                  <p>你确定要退出该学习小组吗？此操作不可撤销。</p>
                  <v-spacer style="height: 20px;"></v-spacer>
                  <p>请输入小组名称以继续:</p>
                  <v-spacer style="height: 10px;"></v-spacer>
                  <v-text-field v-model="enteredGroupName" label="小组名称" variant="outlined" required
                    color="red"></v-text-field>
                </v-card-text>

                <!-- Dialog Actions with Warning Styling -->
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="confirmLeaveGroup">确定</v-btn>
                  <v-btn color="grey darken-1" text @click="cancelLeaveGroup">取消</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-card-actions>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 1">
      <v-card>
        <v-card-title>小组动态</v-card-title>
        <v-card-text>
          <p>学习小组的动态空间。</p>
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 2">
      <v-card>
        <v-card-title>学习路径共享</v-card-title>
        <v-card-text>
          <p>学习小组共享的学习路径。</p>
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item v-if="activeTab === 3 && role === 'manager'">
      <ManagePanel :groupId="groupId" :pendingJoinRequests="pendingJoinRequests" />
    </v-tab-item>
  </div>
</template>

<script>
import { apiClient } from '@/api';
import ManagePanel from './ManagePanel.vue';
import { mapActions } from 'vuex';

export default {
  props: {
    groupId: Number
  },
  data() {
    return {
      group: {}, // Group details fetched based on groupId
      role: '', // Role of the current user in the group
      isMember: false, // Whether the current user is a member
      activeTab: 0, // Track the active tab
      leaveDialog: false, // Show confirmation dialog when leaving group
      DissolveDialog: false, // Show confirmation dialog when dissolving group
      enteredGroupName: '', // Entered group name for confirmation
      pendingJoinRequests: 0 // Number of pending join requests
    };
  },
  methods: {
    ...mapActions(['goToProfile']), // Map the Vuex action

    async navigateToProfile(userId) {
      this.goToProfile({ userId, router: this.$router });  // Dispatch the action
    },
    
    // Fetch group details from the backend
    async fetchGroupDetails(groupId) {
      try {
        const response = await apiClient.get(`/StudyGroup/GetStudyGroupById/${groupId}`);
        this.group = response.data;
        this.isMember = this.group.memberIds.some(memberId => memberId.id === this.$store.state.currentUserID);
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    },
    // Fetch user role in the group from the backend
    async fetchUserRole(groupId) {
      try {
        const response = await apiClient.get(`/StudyGroup/GetUserRoleInGroup/${groupId}`);
        this.role = response.data;

        // Fetch pending join requests if the user is a manager
        if (this.role === 'manager') {
          console.log('Fetching pending join requests...');
          const joinRequestsResponse = await apiClient.get(`/StudyGroup/GetPendingJoinRequestsCount/${this.groupId}`);
          this.pendingJoinRequests = joinRequestsResponse.data;
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    },
    onTabChange(tabIndex) {
      this.activeTab = tabIndex;
      if (this.activeTab === 3 && this.role === 'manager') {
        this.$router.push({ name: 'managePanel', params: { groupId: this.groupId } });
      }
    },
    // Triggered when the user clicks the "Leave Group" button
    promptLeaveGroup() {
      this.leaveDialog = true; // Show the confirmation dialog
    },

    // Triggered when the user confirms the leave action
    async confirmLeaveGroup() {
      // Validate the entered group name
      if (this.enteredGroupName !== this.group.name) {
        this.$toast.error('小组名称不正确，请重新输入。');
        return;
      }

      // Proceed with the API call to leave the group
      try {
        await apiClient.post('/StudyGroup/LeaveStudyGroup', {
          userId: this.$store.state.currentUserID, // Replace with the actual user ID from the store
          groupId: this.groupId,
        });
        this.$toast.success('已成功退出学习小组。');
        this.leaveDialog = false; // Close the dialog
        // Optionally redirect or update UI after leaving the group
      } catch (error) {
        console.error('Error leaving group:', error);
        this.$toast.error('退出小组失败，请稍后再试。');
      }
    },

    // Triggered when the user cancels the leave action
    cancelLeaveGroup() {
      this.leaveDialog = false; // Close the dialog
      this.enteredGroupName = ''; // Reset the input field
    },

    promptDissoveGroup() {
      // Show a confirmation dialog before dissolving the group
      this.DissolveDialog = true;
    },

    // Triggered when the user confirms the dissolve action
    async confirmDissolveGroup() {
      // Validate the entered group name
      if (this.enteredGroupName !== this.group.name) {
        this.$toast.error('小组名称不正确，请重新输入。');
        return;
      }

      // Proceed with the API call to dissolve the group
      try {
        await apiClient.post('/StudyGroup/DissolveStudyGroup', {
          userId: this.$store.state.currentUserID, // Replace with the actual user ID from the store
          groupId: this.groupId,
        });
        this.$toast.success('学习小组已成功解散。');
        this.DissolveDialog = false; // Close the dialog
        // Optionally redirect or update UI after dissolving the group
      } catch (error) {
        console.error('Error dissolving group:', error);
        this.$toast.error('解散小组失败，请稍后再试。');
      }
    },

    // Triggered when the user cancels the dissolve action
    cancelDissolveGroup() {
      this.DissolveDialog = false; // Close the dialog
      this.enteredGroupName = ''; // Reset the input field
    },
  },
  async mounted() {
    // Fetch group details and user role from the backend on component mount
    this.fetchGroupDetails(this.groupId);
    this.fetchUserRole(this.groupId);
  },
  components: {
    ManagePanel
  }
};
</script>

<style scoped>
.v-img {
  max-width: 1600px;
  max-height: 500px;
}
</style>
