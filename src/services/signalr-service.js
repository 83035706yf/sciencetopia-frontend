import { HubConnectionBuilder } from '@microsoft/signalr';
import store from '@/store';

let connection = null;

const initializeSignalRConnection = (onReceiveMessage, onUpdateMessages, onUpdateConversationMessages, onUpdateConversationDetails) => {
  if (!connection || connection.state === 'Disconnected') {
    connection = new HubConnectionBuilder()
      .withUrl('http://localhost:5085/chathub')
      .build();

    connection.on('ReceiveMessage', (conversationId, message) => {
      // Update message count in Vuex store
      store.dispatch('incrementMessageCount');
      if (onReceiveMessage) {
        onReceiveMessage(conversationId, message);
      }
    });

    connection.on('updateMessages', (messageCount) => {
      // Update message count in Vuex store
      store.dispatch('updateMessageCount', messageCount);
      if (onUpdateMessages) {
        onUpdateMessages(messageCount);
      }
    });

    connection.on('updateConversationMessages', (conversationId, conversationMessageCount) => {
      // Update message count in Vuex store
      store.dispatch('updateConversationMessageCount', {conversationId, conversationMessageCount});
      if (onUpdateConversationMessages) {
        onUpdateConversationMessages(conversationId, conversationMessageCount);
      }
    });

    connection.on('updateConversationDetails', (conversationId, lastMessageSentTime) => {
      if (onUpdateConversationDetails) {
        onUpdateConversationDetails(conversationId, lastMessageSentTime);
        console.log('Conversation details update received:', conversationId, lastMessageSentTime, 'onUpdateConversationDetails:', onUpdateConversationDetails);
      }
      console.log('Conversation details update received:', conversationId, lastMessageSentTime);
    });

    connection
      .start()
      .then(() => console.log('Connected to SignalR Hub'))
      .catch(err => console.error('SignalR Connection Error:', err));
  }
};

const startConnection = () => {
  if (connection && connection.state === 'Disconnected') {
    connection
      .start()
      .then(() => console.log('SignalR Connection Started'))
      .catch(err => console.error('SignalR Connection Error:', err));
  }
};

const stopConnection = () => {
  if (connection && connection.state !== 'Disconnected') {
    connection
      .stop()
      .then(() => console.log('SignalR Connection Stopped'))
      .catch(err => console.error('SignalR Disconnection Error:', err));
  }
};

export { initializeSignalRConnection, startConnection, stopConnection, connection };
