<template>
    <v-card class="member-management">
      <v-card-title>成员管理</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="member in members" :key="member.id">
            <v-list-item-avatar>
              <img :src="member.avatarUrl" alt="用户头像">
            </v-list-item-avatar>
            <v-list-item-content>{{member}}
              <v-list-item-title>{{ member.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ member.role }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="promoteToManager(member.id)">👆</v-btn>
              <v-btn icon @click="demoteToMember(member.id)">👇</v-btn>
              <v-btn icon @click="removeMember(member.id)">❎</v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </template>
  
  <script>
  import { apiClient } from '@/api';
  
  export default {
    props: {
      groupId: String
    },
    data() {
      return {
        members: []
      };
    },
    async mounted() {
      const response = await apiClient.get(`/StudyGroup/GetStudyGroupMembers/${this.groupId}`);
      this.members = response.data;
    },
    methods: {
      async promoteToManager(memberId) {
        await apiClient.post(`/StudyGroupManage/PromoteToManager/${this.groupId}`, { memberId });
        this.fetchMembers();
      },
      async demoteToMember(memberId) {
        await apiClient.post(`/StudyGroupManage/DemoteToMember/${this.groupId}`, { memberId });
        this.fetchMembers();
      },
      async removeMember(memberId) {
        await apiClient.post(`/StudyGroupManage/RemoveMember/${this.groupId}`, { memberId });
        this.fetchMembers();
      },
      async fetchMembers() {
        const response = await apiClient.get(`/StudyGroup/GetStudyGroupMembers/${this.groupId}`);
        this.members = response.data;
      }
    }
  };
  </script>
  
  <style scoped>
  .member-management {
    max-width: 800px;
    margin: auto;
  }
  </style>
  