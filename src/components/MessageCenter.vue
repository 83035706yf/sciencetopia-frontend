<template>
    <v-container class="message-center">
        <v-row>
            <v-col cols="2">
                <v-card outlined>
                    <v-list>
                        <v-list-item @click="activeTab = 'directMessages'"
                            :class="{ 'active': activeTab === 'directMessages' }">
                            <v-list-item-title>私信</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="activeTab = 'notifications'"
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
                            <!-- Left part: List of conversations -->
                            <v-col cols="3">
                                <v-list dense>
                                    <v-list-item v-for="conversation in conversations" :key="conversation.conversationId"
                                        @click="selectConversation(conversation)"
                                        :class="{ 'grey-background': conversation.conversationId === selectedConversation.conversationId }">
                                        <v-list-item-content>
                                            <v-avatar>
                                                <img :src="conversation.messages[0].sender.avatarUrl" alt="Avatar">
                                            </v-avatar>
                                            <v-list-item-title>{{ conversation.messages[0].sender.userName
                                            }}</v-list-item-title>
                                            <v-list-item-subtitle>{{ conversation.messages.length > 0 ?
                                                conversation.messages[conversation.messages.length - 1].content : null
                                            }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>

                            <!-- Divider -->
                            <v-divider vertical></v-divider>

                            <!-- Right part: Conversation messages -->
                            <v-col cols="9">
                                <div v-if="selectedConversation">
                                    <v-list dense>
                                        <v-list-item v-for="message in selectedConversation.messages" :key="message.id"
                                            :class="{ 'my-message': isMyMessage(message), 'their-message': !isMyMessage(message) }">
                                            <v-list-item-content v-if="message.sender.id !== undefined"
                                                class="d-flex align-center">
                                                <v-avatar v-if="!isMyMessage(message)">
                                                    <img :src="message.sender.avatarUrl" alt="Avatar">
                                                </v-avatar>
                                                <div class="message-bubble" :class="{ 'ml-2': !isMyMessage(message) }">
                                                    {{ message.content }}
                                                </div>
                                                <v-avatar v-if="isMyMessage(message)">
                                                    <img :src="this.$store.state.avatarUrl" alt="Avatar">
                                                </v-avatar>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>

                                    <v-textarea variant="outlined" v-model="selectedConversation.newMessage" label="编辑消息..." outlined
                                        dense></v-textarea>
                                    <v-card-actions class="justify-end">
                                        <v-btn variant="text" @click="sendMessage(selectedConversation)">发送</v-btn>
                                    </v-card-actions>
                                </div>
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
                                <v-list-item-content>
                                    {{ notification.content }}
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { HubConnectionBuilder } from '@microsoft/signalr';
import { apiClient } from '@/api';

export default {
    data() {
        return {
            activeTab: 'directMessages',
            conversations: [], // Initially empty, will be filled with fetched data
            selectedConversation: null, // Placeholder for selected conversation details
            notifications: [], // Initially empty, will be filled with fetched data
            connection: null,
            userId: null, // Placeholder for actual user ID
        };
    },
    created() {
        this.fetchConversations(); // Method to fetch conversation data
        this.initializeSignalRConnection(); // Method to initialize SignalR connection
    },
    methods: {
        async fetchConversations() {
            // Placeholder: Fetch conversations and their messages from your API
            // Update this.conversations with the fetched data
            // Also, set this.userId to the actual user ID
            const userId = this.$store.state.currentUserID;
            const response = await apiClient.get(`Message/GetMessageByReceiver/${userId}`);
            this.conversations = response.data;
            this.selectedConversation = this.conversations[0];
        },

        selectConversation(conversation) {
            console.log(conversation);
            this.selectedConversation = conversation;
        },

        isMyMessage(message) {
            return message.sender.id === this.$store.state.currentUserID;
        },
        initializeSignalRConnection() {
            this.connection = new HubConnectionBuilder()
                .withUrl('http://localhost:5085/chathub')
                .build();

            this.connection.on('ReceiveMessage', (conversationId, message) => {
                const conversation = this.conversations.find((c) => c.id === conversationId);
                if (conversation) {
                    conversation.messages.push(message);
                } else {
                    // Handle new conversation or fetch missing conversation details
                    this.fetchConversations(); // Optionally refetch conversations to get the new one
                }
            });

            this.connection.start().catch((err) => console.error('SignalR Connection Error:', err));
        },
        sendMessage(conversation) {
            if (conversation.newMessage.trim() === '') return;

            const receiverId = conversation.messages[0].sender.id; // Assuming you have partnerId in your conversation object
            this.connection
                .invoke('SendMessage', conversation.conversationId, this.$store.state.currentUserID, receiverId, conversation.newMessage)
                .then(() => {
                    conversation.messages.push({
                        id: Date.now().toString(), // Temporary ID; the server should generate a real ID
                        senderName: 'You',
                        content: conversation.newMessage,
                        sender: {
                            avatarUrl: this.$store.state.avatarUrl
                        },
                    });
                    conversation.newMessage = '';
                })
                .catch((err) => console.error('Error sending message:', err));
        },
    },
};
</script>

<style scoped>
.message-center {
    display: flex;
}

.grey-background {
    background-color: #eeeeee;
    /* This is approximately the color for 'grey lighten-2' */
}


.their-message .d-flex .message-bubble {
    padding: 8px 12px;
    border-radius: 16px;
    background-color: #1976D2;
    color: white;
    max-width: 80%;
    word-break: break-word;
    /* Ensure text wraps inside the bubble */
}

.my-message {
    justify-content: flex-end;
    /* Align my messages to the right */
}

.my-message .d-flex .message-bubble {
    padding: 8px 12px;
    border-radius: 16px;
    background-color: green;
    color: white;
    max-width: 80%;
    word-break: break-word;
    /* Ensure text wraps inside the bubble */
}

.active {
    background-color: #f0f0f0;
}

.v-card {
    margin-bottom: 1rem;
}

.v-card-title {
    background-color: #f0f0f0;
    padding: 1rem;
}

.v-card-text {
    padding: 1rem;
}</style>
  