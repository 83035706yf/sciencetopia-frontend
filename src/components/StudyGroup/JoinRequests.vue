<template>
    <v-card class="join-requests">
      <v-card-title>加入请求</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="request in requests" :key="request.id">
            <v-list-item-avatar>
              <img :src="request.avatarUrl" alt="用户头像">
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ request.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ request.requestDate }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="primary" @click="approveRequest(request.id)">同意</v-btn>
              <v-btn color="secondary" @click="rejectRequest(request.id)">拒绝</v-btn>
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
        requests: []
      };
    },
    async mounted() {
      const response = await apiClient.get(`/StudyGroup/GetJoinRequests/${this.groupId}`);
      this.requests = response.data;
    },
    methods: {
      async approveRequest(requestId) {
        await apiClient.post(`/StudyGroupManage/ApproveJoinRequest/${this.groupId}`, { requestId });
        this.fetchRequests();
      },
      async rejectRequest(requestId) {
        await apiClient.post(`/StudyGroupManage/RejectJoinRequest/${this.groupId}`, { requestId });
        this.fetchRequests();
      },
      async fetchRequests() {
        const response = await apiClient.get(`/StudyGroup/GetJoinRequests/${this.groupId}`);
        this.requests = response.data;
      }
    }
  };
  </script>
  
  <style scoped>
  .join-requests {
    max-width: 800px;
    margin: auto;
  }
  </style>
  