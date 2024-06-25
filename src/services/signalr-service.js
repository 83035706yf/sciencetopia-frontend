import { HubConnectionBuilder } from '@microsoft/signalr';
import store from '@/store';

let connection = null;

const initializeSignalRConnection = (onReceiveMessage, onUpdateMessages, onUpdateConversationMessages) => {
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
      console.log('onReceiveMessage:', onReceiveMessage, 'Received message:', message, 'conversationId:', conversationId);
    });

    connection.on('updateMessages', (messageCount) => {
      // Update message count in Vuex store
      store.dispatch('updateMessageCount', messageCount);
      if (onUpdateMessages) {
        onUpdateMessages(messageCount);
      }
      console.log('Updated message count:', messageCount);
    });

    connection.on('updateConversationMessages', (conversationId, conversationMessageCount) => {
      // Update message count in Vuex store
      store.dispatch('updateConversationMessageCount', {conversationId, conversationMessageCount});
      if (onUpdateConversationMessages) {
        onUpdateConversationMessages(conversationId, conversationMessageCount);
      }
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
