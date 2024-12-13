<template>
  <!-- <v-divider color="text" :thickness="2" opacity="1" style="margin: 0; padding: 0;"></v-divider> -->
  <GlobalLoader />
  <v-container v-if="!isLoading">
    <div v-if="groups.length === 0">
      <p class="pb-6">
        暂时没有学习小组，去
        <button @click="toCreateGroupPage">创建</button>
        第一个吧！
      </p>
    </div>
    <div v-else class="group-list">
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="group in groups" :key="group.id">
          <v-card class="mx-auto st-card" max-width="344">
            <v-card-title>
              <button @click="toGroupPage(group.id)">{{ group.name }}</button>
            </v-card-title>
            <v-card-text>
              <div>{{ group.description }}</div>
            </v-card-text>
            <v-img aspect-ratio="16/9" cover
              :src="group.imageurl ? group.imageurl : require('@/assets/images/default_study_group.png')"></v-img>
            <v-card-text>
              小组成员:
              <v-col v-for="member in group.members" :key="member.id">
                <v-btn icon="dots-vertical" class="default-avatar" size="40" @click="navigateToProfile(member.id)">
                  <v-avatar size="38">
                    <img :src="member.avatarUrl" alt="用户头像">
                  </v-avatar>
                </v-btn>
              </v-col>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="group.isMember" color="primary" text disabled>已加入</v-btn>
              <template v-else>
                <v-btn color="primary" text @click="applyToJoin(group.id)">申请加入</v-btn>
                <v-btn color="primary" text @click="follow(group.id)">关注</v-btn>
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-btn variant="contained" @click="toCreateGroupPage">创建新学习小组</v-btn>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { apiClient } from '@/api';
import { useGlobalLoading } from '../GlobalLoader.vue';
import { mapActions } from 'vuex';

export default {
  name: 'StudyGroupList',
  setup() {
    const { isLoading, showLoading, hideLoading } = useGlobalLoading();

    return {
      isLoading,
      showLoading,
      hideLoading
    };
  },
  data() {
    return {
      groups: [] // This will be filled with data fetched from the backend
    };
  },
  methods: {
    ...mapActions(['goToProfile']),  // Map the Vuex action

    async fetchGroups() {
      this.showLoading(); // Show loading spinner
      try {
        const response = await apiClient.get('/StudyGroup/GetAllStudyGroups');
        const groupsWithAvatars = await Promise.all(
          response.data.map(async (group) => {
            const members = await Promise.all(
              group.memberIds.map(async (memberId) => ({
                id: memberId.id,
                avatarUrl: await this.$store.dispatch('fetchAvatarUrl', memberId.id)
              }))
            );
            const isMember = group.memberIds.some(
              (memberId) => memberId.id === this.$store.state.currentUserID
            );
            console.log('isMember:', isMember);
            return { ...group, members, isMember }; // Replace memberIds with members including avatars
          })
        );
        this.groups = groupsWithAvatars;
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        this.hideLoading(); // Hide loading spinner
      }
    },
    toCreateGroupPage() {
      // Logic to navigate to the create group page
      this.$router.push('/createstudygroup');
    },
    toGroupPage(groupId) {
      // Logic to navigate to the group page
      this.$router.push({ name: 'studyGroupPage', params: { groupId } });
    },
    applyToJoin(groupId) {
      // API call to apply for joining a group
      apiClient
        .post('/StudyGroup/ApplyToJoin', { studyGroupId: groupId })
        .then((response) => {
          console.log('Applied to join group:', response.data);
          alert('Application submitted successfully');

          // Fetch manager IDs from the new API
          apiClient.get(`/StudyGroup/GetGroupManagers/${groupId}`)
            .then(managerResponse => {
              const managerIds = managerResponse.data;

              // Notify the managers via SignalR
              const connection = this.$root.$signalRConnection;
              if (connection) {
                const content = `User ${this.$store.state.currentUserID} has requested to join the group ${groupId}.`;
                const type = 'JoinRequest';
                const data = JSON.stringify({ StudyGroupId: groupId });

                connection.invoke('SendNotificationToUsers', managerIds, content, type, data)
                  .then(() => {
                    console.log('Notification sent to managers');
                  })
                  .catch((error) => {
                    console.error('Error sending notification:', error);
                  });
              }
            })
            .catch((error) => {
              console.error('Error fetching manager IDs:', error);
            });
        })
        .catch((error) => {
          console.error('Error applying to join group:', error);
          alert('Failed to submit application');
        });
    },
    async navigateToProfile(userId) {
      this.goToProfile({ userId, router: this.$router });  // Dispatch the action
    },
  },
  mounted() {
    // Fetch groups from the backend on component mount
    this.fetchGroups();
  }
};
</script>

<style scoped>
@import "../../assets/css/avatar.css";
</style>