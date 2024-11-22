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
          <v-list-item-title>{{ $t('message.privatemessage')}}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="notifications">
          <v-list-item-title>{{ $t('message.notification')}}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card v-else>
        <v-card-title>
          <v-list>
          <v-list-item-title>{{ $t('please')}} <v-btn @click="login" variant="outlined">{{ $t('header.login')}}</v-btn> {{ $t('header.toseemessage')}}</v-list-item-title>
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
        const userId = this.$store.state.currentUserID;  // Get the userId from Vuex store
        this.$router.push({ name: 'directMessages', params: { userId: userId } }); // Navigate to DirectMessages tab}
      }
    },
    notifications() {
      const userId = this.$store.state.currentUserID;  // Get the userId from Vuex store
      this.$router.push({ name: 'notifications', params: { userId: userId } }); // Navigate to Notifications tab
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