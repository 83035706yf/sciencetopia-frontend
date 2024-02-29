<template>
  <div class="group-page">
    <h2>{{ group.name }}</h2>
    <p>{{ group.description }}</p>
    <!-- Additional group information -->
    <v-img aspect-ratio="16/9" cover
      :src="group.imageurl ? group.imageurl : require('@/assets/images/default_study_group.png')"></v-img>
    <v-card-text>小组成员:
      <v-col v-for="member in group.members" :key="member.id">
        <v-btn icon="dots-vertical" size="40">
          <v-avatar size="35">
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
      group: {} // Group details fetched based on groupId
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
    }
  },
  mounted() {
    // Fetch group details from the backend on component mount
    this.fetchGroupDetails(this.groupId);
  }
};
</script>
  