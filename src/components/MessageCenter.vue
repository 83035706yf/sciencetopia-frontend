<template>
    <v-container class="message-center">
        <v-row>
            <v-col cols="2" class="sidebar">
                <v-card outlined>
                    <v-list>
                        <v-list-item :to="{ name: 'directMessages', params: { userId: userId } }" exact
                            :class="{ 'active': activeTab === 'directMessages' }">
                            <v-list-item-title>私信</v-list-item-title>
                            <div v-if="messageCount > 0" class="alert-badge">
                                {{ messageCount > 99 ? '99+' : messageCount }}
                            </div>
                        </v-list-item>
                        <v-list-item :to="{ name: 'notifications', params: { userId: userId } }" exact
                            :class="{ 'active': activeTab === 'notifications' }">
                            <v-list-item-title>系统消息</v-list-item-title>
                            <div v-if="notificationCount > 0" class="alert-badge">
                                {{ notificationCount > 99 ? '99+' : notificationCount }}
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="10">
                <v-card v-if="activeTab === 'directMessages'">
                    <v-card-text>
                        <v-row>
                            <v-col cols="3">
                                <v-list dense>
                                    <v-list-item v-for="conversation in conversations"
                                        :key="conversation.conversationId" @click="selectConversation(conversation)"
                                        :class="{ 'grey-background': isSelectedConversation(conversation) }">
                                        <div>
                                            <v-avatar>
                                                <img :src="conversation.partnerAvatarUrl" alt="Avatar" />
                                            </v-avatar>
                                            <v-list-item-title>{{ conversation.partnerName }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ getLastMessage(conversation)
                                                }}</v-list-item-subtitle>
                                            <div v-if="conversationMessageCount[conversation.conversationId] > 0"
                                                class="alert-badge">
                                                {{ conversationMessageCount[conversation.conversationId] }}
                                            </div>
                                        </div>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                            <v-divider vertical></v-divider>
                            <v-col cols="8" v-if="selectedConversation">
                                <MessageList ref="messageList" :messages="selectedConversation.messages"
                                    :userId="userId" :userAvatarUrl="userAvatarUrl" />
                                <v-divider></v-divider>
                                <v-textarea v-model="selectedConversation.newMessage" label="编辑消息..." outlined
                                    dense></v-textarea>
                                <v-card-actions class="justify-end">
                                    <v-btn @click="sendMessage(selectedConversation)">发送</v-btn>
                                </v-card-actions>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <SystemNotifications v-else />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { apiClient } from '@/api';
import { connection } from '@/services/signalr-service';
import MessageList from '@/components/MessageList.vue';
import SystemNotifications from '@/components/SystemNotifications.vue'; // Import the new component
import { mapState } from 'vuex';
import { DateTime } from 'luxon';

export default {
    components: { MessageList, SystemNotifications }, // Include the new component
    data() {
        return {
            activeTab: 'directMessages',
            conversations: [],
            selectedConversation: null,
            userId: null,
            userAvatarUrl: null,
        };
    },
    computed: {
        ...mapState(['messageCount', 'conversationMessageCount', 'notificationCount']),
    },
    watch: {
        $route(to) {
            if (to.name === 'directMessages') {
                this.activeTab = 'directMessages';
                if (this.selectedConversation) {
                    this.markMessagesAsRead(this.selectedConversation.conversationId);
                }
            } else if (to.name === 'notifications') {
                this.activeTab = 'notifications';
                // if (this.notificationCount > 0) {
                this.markNotificationsAsRead();
                // }
            }
        },
        '$route.query.conversationId': {
            immediate: true,
            handler(newConversationId) {
                if (newConversationId) {
                    this.loadConversation(newConversationId);
                }
            }
        },
        selectedConversation(conversation) {
            if (conversation) {
                this.markMessagesAsRead(conversation.conversationId);
            }
        },
    },
    created() {
        this.fetchConversations();
        this.updateActiveTab();
        this.setupSignalREvents();
    },
    methods: {
        setupSignalREvents() {
            const connection = this.$root.$signalRConnection;
            if (connection) {
                connection.on('ReceiveMessage', this.handleReceiveMessage);
            } else {
                console.error('SignalR connection is not defined');
            }
        },
        updateActiveTab() {
            if (this.$route.name === 'directMessages') {
                this.activeTab = 'directMessages';
                if (this.selectedConversation) {
                    this.markMessagesAsRead(this.selectedConversation.conversationId);
                }
            } else if (this.$route.name === 'notifications') {
                this.activeTab = 'notifications';
            }
        },
        async fetchConversations() {
            const userId = this.$store.state.currentUserID;
            const response = await apiClient.get(`Message/GetGroupedMessagesByUser/${userId}`);
            this.conversations = response.data;
            this.selectedConversation = this.conversations[0];
            this.userId = userId;
            this.userAvatarUrl = this.$store.state.avatarUrl;
        },
        async loadConversation(conversationId, partnerId = null, partnerName = '') {
            try {
                // Fetch the full conversation details from the backend
                const response = await apiClient.get(`/Message/GetConversation/${conversationId}`);

                // If the backend returns data, use it; otherwise, initialize a new conversation
                this.selectedConversation = response.data || {
                    conversationId: conversationId,
                    messages: [],
                    partnerId: partnerId,       // Use the partnerId passed in
                    partnerName: partnerName    // Use the partnerName passed in
                };
            } catch (error) {
                console.error("Unable to retrieve conversation data. Initializing new conversation.");

                // Initialize an empty conversation structure as a fallback
                this.selectedConversation = {
                    conversationId: conversationId,
                    messages: [],
                    partnerId: partnerId,
                    partnerName: partnerName
                };
            }
        },
        selectConversation(conversation) {
            this.selectedConversation = conversation;
        },
        isSelectedConversation(conversation) {
            return conversation.conversationId === this.selectedConversation.conversationId;
        },
        getLastMessage(conversation) {
            return conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : null;
        },
        async handleReceiveMessage(conversationId, message) {
            if (!conversationId) {
                console.error('conversationId is undefined or null');
                return;
            }
            const conversation = this.conversations.find((c) => c.conversationId === conversationId);
            if (conversation) {
                if (message.sender.id !== this.userId) {
                    conversation.messages.push(message);
                    this.sortConversations(conversationId);
                }
                if (this.isSelectedConversation(conversation)) {
                    await this.markMessagesAsRead(conversationId);
                }
            } else {
                this.fetchConversations();
            }
        },
        async markMessagesAsRead(conversationId) {
            await apiClient.post('Message/MarkAsRead', {
                conversationId,
                userId: this.userId,
            });
            const conversation = this.conversations.find(c => c.conversationId === conversationId);
            if (conversation) {
                conversation.messages.forEach(message => {
                    message.isRead = true;
                });
            }
            connection.invoke('MarkMessagesAsRead', conversationId, this.userId);
        },
        sendMessage(conversation) {
            if (conversation.newMessage.trim() === '') return;

            const receiverId = conversation.partnerId;
            connection
                .invoke('SendMessage', conversation.conversationId, this.userId, receiverId, conversation.newMessage)
                .then(() => {
                    const newMessage = {
                        id: Date.now().toString(),
                        senderName: 'You',
                        content: conversation.newMessage,
                        sentTime: DateTime.utc().toISO(),
                        sender: {
                            id: this.userId,
                            avatarUrl: this.userAvatarUrl,
                        }
                    };
                    conversation.messages.push(newMessage);
                    conversation.newMessage = '';
                    this.$refs.messageList.scrollToBottom();
                    this.sortConversations(conversation.conversationId);
                })
                .catch((err) => console.error('Error sending message:', err));
        },
        sortConversations(conversationId) {
            const conversationIndex = this.conversations.findIndex(c => c.conversationId === conversationId);
            if (conversationIndex !== -1) {
                const conversation = this.conversations.splice(conversationIndex, 1)[0];
                this.conversations.unshift(conversation);
            }
        },
        async markNotificationsAsRead() {
            await apiClient.post(`Notification/MarkAsReadByUser/${this.userId}`);
            connection.invoke('MarkAllNotificationsAsRead', this.userId);
            // console.log('Marked all notifications as read');
        },
    },
};
</script>

<style scoped>
.message-center {
    display: flex;
}

.sidebar {
    height: 100%;
    overflow-y: auto;
}

.grey-background {
    background-color: #eeeeee;
}

.active {
    background-color: #f0f0f0;
}

.alert-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #ff6666;
    color: white;
    border-radius: 50%;
    padding: 0.3em 0.8em;
    font-size: 0.7em;
}
</style>