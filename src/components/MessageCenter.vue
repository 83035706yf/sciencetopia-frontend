<template>
    <div class="image-background" style="position: absolute;">
    </div>
    <v-container class="message-center">
        <v-row>
            <v-col cols="auto" class="sidebar">
                <v-card outlined style="height: 100%;">
                    <v-list variant="plain">
                        <v-list-item :to="{ name: 'directMessages', params: { userId: userId } }" exact
                            :class="{ 'active': activeTab === 'directMessages' }">
                            <v-list-item-title>{{ $t('message.privatemessage') }}</v-list-item-title>
                            <div v-if="messageCount > 0" class="alert-badge">
                                {{ messageCount > 99 ? '99+' : messageCount }}
                            </div>
                        </v-list-item>
                        <v-list-item :to="{ name: 'notifications', params: { userId: userId } }" exact
                            :class="{ 'active': activeTab === 'notifications' }">
                            <v-list-item-title>{{ $t('message.notification') }}</v-list-item-title>
                            <div v-if="notificationCount > 0" class="alert-badge">
                                {{ notificationCount > 99 ? '99+' : notificationCount }}
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col cols="auto" style="width: 85%;">
                <v-card v-if="activeTab === 'directMessages'" class="message-card" style="height: 100%;">
                    <v-card-text>
                        <v-row>
                            <v-col cols="auto" style="width: 30%;">
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
                            <v-divider vertical color="text" opacity="0.2"></v-divider>
                            <v-col cols="auto" style="width: 70%; height: 86vh;" v-if="selectedConversation">
                                <v-card class="d-flex align-center justify-center"
                                    style=" max-height: 36px; border-bottom: 2px solid rgba(48, 78, 117, 0.1); border-radius: 5px 5px 0 0 !important;">
                                    <v-card-title>{{ selectedConversation.partnerName }}</v-card-title>
                                </v-card>
                                <MessageList ref="messageList" :messages="selectedConversation.messages"
                                    :userId="userId" :userAvatarUrl="userAvatarUrl" />
                                <v-divider color="text" opacity="0.2"></v-divider>
                                <button class="image-picker-btn">
                                    <img width="24" height="24" src="https://img.icons8.com/fluency/48/full-image.png"
                                        alt="full-image" />
                                </button>
                                <button class="emoji-picker-btn" @click="toggleEmojiPicker">
                                    😊
                                </button>

                                <div v-if="showEmojiPicker">
                                    <emoji-picker class="light emoji-picker" @emoji-click="onEmojiClick"></emoji-picker>
                                </div>

                                <v-textarea style="height: 25vh" variant="solo-filled"
                                    v-model="selectedConversation.newMessage" :label="$t('message.editing')" outlined
                                    dense></v-textarea>
                                <v-card-actions class="justify-end">
                                    <v-btn variant="plain" style="position: absolute; top: 83vh"
                                        @click="sendMessage(selectedConversation)">{{ $t('message.send') }}</v-btn>
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
import 'emoji-picker-element';

export default {
    components: { MessageList, SystemNotifications }, // Include the new component
    data() {
        return {
            activeTab: 'directMessages',
            conversations: [],
            selectedConversation: null,
            userId: null,
            userAvatarUrl: null,
            showEmojiPicker: false, // Controls the visibility of the emoji picker
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
        toggleEmojiPicker() {
            this.showEmojiPicker = !this.showEmojiPicker; // Toggle emoji picker visibility
            if (this.showEmojiPicker) {
                document.addEventListener('click', this.closeEmojiPickerOnOutsideClick);
            } else {
                document.removeEventListener('click', this.closeEmojiPickerOnOutsideClick);
            }
        },
        onEmojiClick(event) {
            const emoji = event.detail.unicode; // Get the selected emoji
            if (this.selectedConversation && typeof this.selectedConversation.newMessage === 'string') {
                // 确保 newMessage 是一个字符串
                this.selectedConversation.newMessage += emoji; // 拼接表情
            } else if (this.selectedConversation) {
                // 如果 newMessage 未初始化，则赋值表情
                this.selectedConversation.newMessage = emoji;
            }
        },
        closeEmojiPickerOnOutsideClick(event) {
            const emojiPicker = document.querySelector('.emoji-picker');
            if (emojiPicker && !emojiPicker.contains(event.target) && !event.target.closest('button')) {
                this.showEmojiPicker = false;
                document.removeEventListener('click', this.closeEmojiPickerOnOutsideClick);
            }
        },
    },
};
</script>

<style scoped>
@import '../assets/css/image-background.css';

.message-center {
    display: flex;
    width: 61.8vw;
    height: 87vh;
    padding: 0;
    backdrop-filter: blur(10px); /* 磨砂效果 */
    -webkit-backdrop-filter: blur(10px); /* 兼容 Safari */
    /* background-image: url('../assets/images/design.png');
    background-size: cover; */
}

.sidebar {
    height: 100%;
    width: 15%;
    overflow-y: auto;
    padding-right: 0;
}

.sidebar .v-card {
    background-color: rgba(48, 78, 117, 0.1);
}

.sidebar .v-list {
    background-color: unset;
    /* background-color: rgba(48, 78, 117, 0.1); */
}

.message-card {
    background-color: rgba(255, 255, 255, 0.8);
}

.grey-background {
    background: radial-gradient(circle, #00FFF7 40%, transparent 40%) !important;
    /* Button background */
    background-size: 5px 5px !important;
    /* color: white; */
}

.active {
    background: rgba(0, 255, 247, 0.7);
    background-size: 5px 5px !important;
    color: #000 !important;
    opacity: 1 !important;
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

.emoji-picker {
    position: absolute;
    bottom: 300px;
    z-index: 10;
    max-height: 300px;
}

.emoji-picker-btn {
    font-size: 1.2rem;
    /* Adjust size as needed */
    line-height: 1;
    /* Ensure proper alignment */
    padding-bottom: 10px;
    padding-left: 5px;
}

.image-picker-btn {
    font-size: 1.2rem;
    /* Adjust size as needed */
    line-height: 1;
    /* Ensure proper alignment */
    padding-bottom: 10px;
    padding-left: 5px;
}
</style>