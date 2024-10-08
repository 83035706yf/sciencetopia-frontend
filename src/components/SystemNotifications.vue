<template>
  <v-card class="system-notifications">
    <v-card-title>系统消息</v-card-title>
    <v-card-text>
      <v-accordion>
        <v-accordion-item v-for="(groupedNotifications, type) in groupedNotificationsByType" :key="type">
          <template v-slot:title>
            {{ getTypeLabel(type) }}
          </template>
          <v-list class="notification-list">
            <v-list-item v-for="notification in groupedNotifications" :key="notification.id">
              <v-list-item-content>
                <v-list-item-title class="notification-bubble">{{ notification.content }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatDate(notification.createdAt) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-accordion-item>
      </v-accordion>
    </v-card-text>
  </v-card>
</template>

<script>
import { apiClient } from '@/api';
import { DateTime } from 'luxon';

export default {
  data() {
    return {
      notifications: [],
      userId: this.$store.state.currentUserID, // Assuming the user ID is stored in Vuex state
    };
  },
  computed: {
    groupedNotificationsByType() {
      return this.notifications.reduce((acc, notification) => {
        if (!acc[notification.type]) {
          acc[notification.type] = [];
        }
        acc[notification.type].push(notification);
        return acc;
      }, {});
    }
  },
  async mounted() {
    await this.fetchNotifications();
    this.setupSignalRListener();
  },
  methods: {
    async fetchNotifications() {
      try {
        const response = await apiClient.get(`/Notification/GetNotificationsForUser/${this.userId}`);
        this.notifications = response.data;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    },
    setupSignalRListener() {
      const connection = this.$root.$signalRConnection;
      if (connection) {
        connection.on('ReceiveNotification', (notification) => {
          this.notifications.push(notification);
        });
      } else {
        console.error('SignalR connection is not defined');
      }
    },
    formatDate(date) {
      return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
    },
    getTypeLabel(type) {
      // Map type to a human-readable label (customize as needed)
      const typeLabels = {
        JoinRequest: '加入请求',
        SystemAlert: '系统警报',
        // Add more types as needed
      };
      return typeLabels[type] || '未知类型';
    }
  }
};
</script>

<style scoped>
.system-notifications {
  margin: auto;
}

.v-list-item-title {
  font-weight: bold;
}

.v-list-item-subtitle {
  font-size: 0.8em;
  color: gray;
}

.v-accordion-item {
  margin-bottom: 10px;
}

.notification-list {
  height: 1000px;
  overflow-y: auto;
}

.notification-bubble {
  padding: 8px 12px;
  border-radius: 16px;
  background-color: #D3D3D3;
  max-width: 80%;
  word-break: break-word;
}
</style>