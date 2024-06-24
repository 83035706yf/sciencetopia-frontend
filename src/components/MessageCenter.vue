<template>
    <v-container class="message-center">
        <v-row>
            <v-col cols="2" class="sidebar">
                <v-card outlined>
                    <v-list>
                        <v-list-item :to="{ name: 'directMessages' }" exact
                            :class="{ 'active': activeTab === 'directMessages' }">
                            <v-list-item-title>私信</v-list-item-title>
                            <div v-if="messageCount > 0" class="alert-badge">
                                {{ messageCount > 99 ? '99+' : messageCount }}
                            </div>
                        </v-list-item>
                        <v-list-item :to="{ name: 'notifications' }" exact
                            :class="{ 'active': activeTab === 'notifications' }">
                            <v-list-item-title>系统消息</v-list-item-title>
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
                                    <v-list-item v-for="conversation in sortedConversations"
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
                            <v-col cols="9" v-if="selectedConversation">
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
                <v-card v-else>
                    <v-card-title>
                        <h2>系统消息</h2>
                    </v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="notification in notifications" :key="notification.id">
                                <div>{{ notification.content }}</div>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { apiClient } from '@/api';
import { connection, initializeSignalRConnection } from '@/services/signalr-service';
import MessageList from '@/components/MessageList.vue';
import { mapState } from 'vuex';

export default {
    components: { MessageList },
    data() {
        return {
            activeTab: 'directMessages',
            conversations: [],
            selectedConversation: null,
            notifications: [],
            userId: null,
            userAvatarUrl: null,
        };
    },
    computed: {
        ...mapState(['messageCount', 'conversationMessageCount']),
        sortedConversations() {
            return this.conversations.slice().sort((a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1];
                const lastMessageB = b.messages[b.messages.length - 1];
                return new Date(lastMessageB.sentTime) - new Date(lastMessageA.sentTime);
            });
        }
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
        this.initializeSignalR();
    },
    methods: {
        updateActiveTab() {
            if (this.$route.name === 'directMessages') {
                this.activeTab = 'directMessages';
                if (this.selectedConversation) {
                    this.markMessagesAsRead(this.selectedConversation.conversationId);
                }
                console.log('Updated active tab to directMessages');
            } else if (this.$route.name === 'notifications') {
                this.activeTab = 'notifications';
                console.log('Updated active tab to notifications');
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
        selectConversation(conversation) {
            this.selectedConversation = conversation;
        },
        isSelectedConversation(conversation) {
            return conversation.conversationId === this.selectedConversation.conversationId;
        },
        getLastMessage(conversation) {
            return conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : null;
        },
        handleReceiveMessage(conversationId, message) {
            const conversation = this.conversations.find((c) => c.conversationId === conversationId);
            if (conversation) {
                conversation.messages.push(message);
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
            console.log('Marked messages as read, conversationId:', conversationId);
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
                        sender: {
                            id: this.userId,
                            avatarUrl: this.userAvatarUrl,
                        }
                    };
                    conversation.messages.push(newMessage);
                    conversation.newMessage = '';
                    this.$refs.messageList.scrollToBottom();
                })
                .catch((err) => console.error('Error sending message:', err));
        },
        initializeSignalR() {
            initializeSignalRConnection(this.handleReceiveMessage, null, null, this.updateConversationDetails);
            console.log('SignalR connection initialized');
        },
        updateConversationDetails(conversationId, lastMessageSentTime) {
            const conversation = this.conversations.find(c => c.conversationId === conversationId);
            if (conversation) {
                conversation.lastMessageSentTime = lastMessageSentTime;
                this.sortConversations();
            } else {
                this.fetchConversations();
            }
            console.log('Updated conversation details:', conversationId, lastMessageSentTime);
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
