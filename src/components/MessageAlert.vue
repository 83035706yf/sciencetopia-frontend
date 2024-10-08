<template>
  <div class="alert-container">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <!-- {{ this.$store.state.messageCount }} -->
        <v-btn @click="directMessages" icon="dots-vertical" variant="text" class="profile-icon" v-bind="props">
          <i class="fas fa-envelope"></i>
          <div v-if="messageCount > 0" class="alert-badge">
            {{ messageCount > 99 ? '99+' : messageCount }}
          </div>
          <div v-else-if="notificationCount > 0" class="alert-badge-dot"></div>
        </v-btn>
      </template>

      <v-list v-if="isAuthenticated">
        <v-list-item @click="directMessages">
          <v-list-item-title>私信</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="notifications">
          <v-list-item-title>系统消息</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card v-else>
        <v-card-title>
          <v-list>
          <v-list-item-title>请 <v-btn @click="login" variant="outlined">登录</v-btn> 以查看消息</v-list-item-title>
        </v-list>
        </v-card-title>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['messageCount', 'notificationCount']),
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    login() {
      this.$router.push({ name: 'login' });  // 跳转到LogIn组件
    },
    directMessages() {
      if (!this.isAuthenticated) {
        return; // Do nothing if user is not authenticated
      } else {
        this.$router.push({ name: 'directMessages' }); // Navigate to DirectMessages tab}
      }
    },
    notifications() {
      this.$router.push({ name: 'notifications' }); // Navigate to Notifications tab
    },
  },
};
</script>

<style scoped>
.alert-container {
  position: relative;
  margin: 10px;
}

.profile-icon {
  position: relative;
}

.alert-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff6666;
  /* Milder red color */
  color: white;
  border-radius: 50%;
  padding: 0.3em 0.3em;
  font-size: 0.7em;
}

.alert-badge-dot {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #ff6666;
  /* Milder red color */
  color: white;
  border-radius: 50%;
  padding: 0.3em 0.3em;
  font-size: 0.7em;
  width: 10px;
  height: 10px;
}
</style>