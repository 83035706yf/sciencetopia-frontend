<template>
  <v-list dense class="message-list" ref="messageList">
    <template v-for="(group, groupIndex) in groupedMessages" :key="groupIndex">
      <div v-if="group.firstMessageSentTime" class="sent-time">
        {{ formatSentTime(group.firstMessageSentTime) }}
      </div>
      <v-list-item v-for="message in group.messages" :key="message.id"
        :class="{ 'my-message': isMyMessage(message), 'their-message': !isMyMessage(message) }">
        <div v-if="message.sender.id !== undefined" class="d-flex align-center">
          <v-btn v-if="!isMyMessage(message)" icon="dots-vertical" variant="text" size="40" @click="navigateToProfile(message.sender.id)">
            <v-avatar>
            <img :src="message.sender.avatarUrl" alt="Avatar" />
          </v-avatar>
          </v-btn>
          <div class="message-bubble" :class="{ 'ml-2': !isMyMessage(message) }">
            {{ message.content }}
          </div>
          <v-avatar v-if="isMyMessage(message)">
            <img :src="userAvatarUrl" alt="Avatar" />
          </v-avatar>
        </div>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    messages: Array,
    userId: String,
    userAvatarUrl: String,
  },
  computed: {
    groupedMessages() {
      console.log(this.messages);
      const groups = [];
      let currentGroup = { messages: [], firstMessageSentTime: null };

      this.messages.forEach((message, index) => {
        const messageTime = new Date(message.sentTime);
        const previousMessageTime = index > 0 ? new Date(this.messages[index - 1].sentTime) : null;

        if (
          previousMessageTime &&
          messageTime - previousMessageTime <= 5 * 60 * 1000
        ) {
          currentGroup.messages.push(message);
        } else {
          if (currentGroup.messages.length) {
            groups.push(currentGroup);
          }
          currentGroup = { messages: [message], firstMessageSentTime: message.sentTime };
        }
      });

      if (currentGroup.messages.length) {
        groups.push(currentGroup);
      }

      return groups;
    },
  },
  methods: {
    ...mapActions(['goToProfile']),  // Map the Vuex action

    isMyMessage(message) {
      return message.sender.id === this.userId;
    },
    markMessagesAsRead() {
      this.$emit('messages-read');
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageList = this.$refs.messageList.$el;
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      });
    },
    formatSentTime(sentTime) {
      const time = new Date(sentTime);
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      if (time.toDateString() === now.toDateString()) {
        return time.toLocaleTimeString();
      } else if (time.toDateString() === yesterday.toDateString()) {
        return '昨天 ' + time.toLocaleTimeString();
      } else {
        return time.toLocaleString();
      }
    },
    async navigateToProfile(userId) {
      this.goToProfile({ userId, router: this.$router });  // Dispatch the action
    },
  },
  watch: {
    messages: {
      handler() {
        this.scrollToBottom();
        this.markMessagesAsRead();
      },
      immediate: true,
      deep: true,
    }
  },
  mounted() {
    this.scrollToBottom();
    this.markMessagesAsRead();
  },
};
</script>

<style scoped>
.message-list {
  height: 550px;
  overflow-y: auto;
}

.their-message .d-flex .message-bubble {
  padding: 8px 12px;
  border-radius: 16px;
  background-color: #1976d2;
  color: white;
  max-width: 80%;
  word-break: break-word;
}

.my-message {
  justify-content: flex-end;
}

.my-message .d-flex .message-bubble {
  padding: 8px 12px;
  border-radius: 16px;
  background-color: green;
  color: white;
  max-width: 80%;
  word-break: break-word;
  margin-right: 8px;
}

.sent-time {
  font-size: 0.8em;
  color: gray;
  text-align: center;
  margin-top: 5px;
}
</style>
