<template>
  <v-card class="member-management">
    <v-card-title>成员管理</v-card-title>
    <v-card-text>
      <v-simple-table class="full-width-table">
        <thead>
          <tr>
            <th>头像</th>
            <th>用户名</th>
            <th>角色</th>
            <th class="actions-column">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="member in members" :key="member.id">
            <td>
              <v-btn icon="dots-vertical" size="40">
                <v-avatar size="35">
                  <img :src="member.avatarUrl" alt="用户头像">
                </v-avatar>
              </v-btn>
            </td>
            <td>{{ member.userName }}</td>
            <td>{{ member.role }}</td>
            <td class="actions-column">
              <v-tooltip text="提升为管理员" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props" @click="promoteToManager(member.id)">👆</v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="设为普通成员" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props" @click="demoteToMember(member.id)">👇</v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="移除成员" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn icon v-bind="props" @click="removeMember(member.id)">❎</v-btn>
                </template>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-card-actions>
        <v-btn color="primary" @click="inviteMember">邀请成员</v-btn>
      </v-card-actions>
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
    await this.fetchMembers();
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
    },
    inviteMember() {
      // Logic to invite member
    },
  }
};
</script>

<style scoped>
@import "../../assets/css/table.css";

.member-management {
  width: 100%;
  /* Ensure the card takes the full width of its container */
  max-width: 1200px;
  margin: auto;
}
</style>
