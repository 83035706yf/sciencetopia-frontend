<template>
    <div class="create-studygroup">
      <h2>创建学习小组</h2>
      <form @submit.prevent="createGroup">
        <input v-model="groupName" placeholder="小组名称" />
        <textarea v-model="groupDescription" placeholder="小组描述"></textarea>
        <button type="submit">创建</button>
      </form>
    </div>
  </template>
  
  <script>
import { apiClient } from '@/api';

  export default {
    name: 'CreateStudyGroup',

    data() {
      return {
        groupName: '',
        groupDescription: ''
      };
    },
    methods: {
      async createGroup() {
        try {
          const payload = {
            name: this.groupName,
            description: this.groupDescription
          };
          await apiClient.post('/StudyGroup/CreateStudyGroup', payload);
          // 创建成功后的处理，例如跳转到小组列表或显示成功消息
        } catch (error) {
          console.error("创建学习小组失败:", error);
        }
      }
    }
  };
  </script>
  