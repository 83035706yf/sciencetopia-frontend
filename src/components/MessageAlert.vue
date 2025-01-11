<template>
  <div
    class="icon-item"
    @click.prevent="directMessages"
    role="button"
    tabindex="0"
    @keydown.enter.prevent="directMessages"
  >
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="icon-btn"
          variant="plain"
          disabled
        >
          <v-icon :size="iconSize">mdi-bell</v-icon>
          <div v-if="messageCount > 0" class="alert-badge">
            {{ messageCount > 99 ? '99+' : messageCount }}
          </div>
          <div v-else-if="notificationCount > 0" class="alert-badge-dot"></div>
        </v-btn>
      </template>

      <!-- 下拉菜单: 仅当已登录(isAuthenticated)时才显示 -->
      <v-list class="header-list st-card" v-if="isAuthenticated">
        <v-list-item variant="plain" @click="directMessages">
          <v-list-item-title>{{ $t('message.privatemessage') }}</v-list-item-title>
        </v-list-item>
        <v-divider color="text" style="margin-top: 5px; margin-bottom: 5px;"></v-divider>
        <v-list-item variant="plain" @click="notifications">
          <v-list-item-title>{{ $t('message.notification') }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <!-- 未登录时，不再显示任何提示卡片，以免悬停出现"请登录以查看信息" -->
    </v-menu>

    <span v-if="!isSmallScreen" class="icon-label">{{ $t('header.messages') }}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "MessageAlert",
  props: {
    isSmallScreen: {
      type: Boolean,
      required: true,
    },
    iconSize: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState(['messageCount', 'notificationCount']),
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    login() {
      this.$router.push({ name: 'login' });
    },
    directMessages() {
      if (!this.isAuthenticated) {
        // 未登录 -> 提示或跳转登录
        alert("请先登录再查看消息列表");
      } else {
        const userId = this.$store.state.currentUserID;
        this.$router.push({ name: 'directMessages', params: { userId } });
      }
    },
    notifications() {
      const userId = this.$store.state.currentUserID;
      this.$router.push({ name: 'notifications', params: { userId } });
    },
  },
};
</script>

<style scoped>
.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer; /* 显示手型指针 */
  position: relative;
}

.icon-item:hover .icon-btn {
  transform: scale(1.05);
  background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:disabled {
  cursor: inherit; /* 禁用按钮的手型指针，避免冲突 */
}

.alert-badge {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #ff6666;
  color: white;
  border-radius: 50%;
  padding: 0.3em;
  font-size: 0.7em;
}

.alert-badge-dot {
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: #ff6666;
  border-radius: 50%;
  width: 10px;
  height: 10px;
}

.icon-label {
  font-size: 14px;
  margin-top: 6px;
  text-align: center;
  white-space: nowrap;
}
</style>
