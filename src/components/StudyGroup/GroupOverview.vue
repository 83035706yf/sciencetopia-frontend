<template>
    <v-card class="group-overview">
      <v-card-title>{{ group.name }}</v-card-title>
      <v-card-subtitle>{{ group.description }}</v-card-subtitle>
      <v-img :src="group.imageUrl || defaultImage" aspect-ratio="16/9"></v-img>
      <v-card-actions>
        <v-btn color="primary" @click="inviteMember">邀请成员</v-btn>
        <v-btn color="secondary" @click="editGroup">编辑小组</v-btn>
      </v-card-actions>
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
        group: {},
        defaultImage: require('@/assets/images/default_study_group.png')
      };
    },
    async mounted() {
      const response = await apiClient.get(`/StudyGroup/GetStudyGroupById/${this.groupId}`);
      this.group = response.data;
    },
    methods: {
      inviteMember() {
        // Logic to invite member
      },
      editGroup() {
        // Logic to edit group
      }
    }
  };
  </script>
  
  <style scoped>
  .group-overview {
    max-width: 800px;
    margin: auto;
  }
  </style>
  