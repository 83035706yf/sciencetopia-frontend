<template>
  <div class="alert-container">
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <!-- {{ this.$store.state.messageCount }} -->
        <v-btn class="header-btn two-rows-btn" variant="plain" @click="directMessages" v-bind="props">
          <div class="btn-content">
            <img v-if="!scrolledPastHeader" width="40" height="40" src="https://img.icons8.com/pastel-glyph/64/secured-letter--v1.png" alt="letter"/>
            <img v-else width="36" height="36" src="https://img.icons8.com/pastel-glyph/64/secured-letter--v1.png" alt="letter" /> <span v-if="!scrolledPastHeader" class="btn-title">{{ $t('header.messages')
              }}</span>
            <div v-if="messageCount > 0" class="alert-badge">
              {{ messageCount > 99 ? '99+' : messageCount }}
            </div>
            <div v-else-if="notificationCount > 0" class="alert-badge-dot"></div>
          </div>
        </v-btn>
        <!-- <v-btn @click="directMessages" icon="dots-vertical" variant="text" class="profile-icon" v-bind="props">
          <i class="fas fa-envelope"></i>
          <div v-if="messageCount > 0" class="alert-badge">
            {{ messageCount > 99 ? '99+' : messageCount }}
          </div>
          <div v-else-if="notificationCount > 0" class="alert-badge-dot"></div>
        </v-btn> -->
      </template>

      <v-list class="header-list st-card" v-if="isAuthenticated">
        <v-list-item variant="plain" @click="directMessages">
          <v-list-item-title>{{ $t('message.privatemessage') }}</v-list-item-title>
        </v-list-item>
        <v-divider color="text" style="margin-top: 5px; margin-bottom: 5px;"></v-divider>
        <v-list-item variant="plain" @click="notifications">
          <v-list-item-title>{{ $t('message.notification') }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card class="header-list" v-else>
        <v-card-title>
          <v-list>
            <v-list-item-title>{{ $t('please') }} <v-btn @click="login" variant="outlined">{{
              $t('header.login') }}</v-btn> {{
                  $t('header.toseemessage') }}</v-list-item-title>
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
  props: {
    scrolledPastHeader: Boolean,
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
@import '../assets/css/header.css';

.alert-container {
  position: relative;
  margin: 1vh 1vw 1vh 1vw;
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

.two-rows-btn {
  display: flex;
  flex-direction: column;
  /* Arrange content vertically */
  align-items: center;
  /* Center align items horizontally */
  justify-content: center;
  /* Center content vertically */
  text-align: center;
  /* Center align text */
  padding: 10px;
  /* Add some spacing inside the button */
}

.btn-content {
  display: flex;
  flex-direction: column;
  /* Arrange icon and title in two rows */
  align-items: center;
  /* Center align both rows */
}
</style>