<template>
    <v-card class="group-settings">
      <v-card-title>小组设置</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="groupName" label="小组名称"></v-text-field>
          <v-textarea v-model="groupDescription" label="小组描述"></v-textarea>
          <v-file-input v-model="groupImage" label="小组图片" accept="image/*"></v-file-input>
          <v-btn color="primary" @click="saveSettings">保存设置</v-btn>
        </v-form>
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
        groupName: '',
        groupDescription: '',
        groupImage: null
      };
    },
    async mounted() {
      const response = await apiClient.get(`/StudyGroup/GetStudyGroupById/${this.groupId}`);
      const group = response.data;
      this.groupName = group.name;
      this.groupDescription = group.description;
    },
    methods: {
      async saveSettings() {
        const formData = new FormData();
        formData.append('name', this.groupName);
        formData.append('description', this.groupDescription);
        if (this.groupImage) {
          formData.append('image', this.groupImage);
        }
  
        await apiClient.post(`/StudyGroupManage/UpdateGroupSettings/${this.groupId}`, formData);
        alert('设置已保存');
      }
    }
  };
  </script>
  
  <style scoped>
  .group-settings {
    max-width: 800px;
    margin: auto;
  }
  </style>
  