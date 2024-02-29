import * as signalR from "@microsoft/signalr";

export default {
  connection: null,

  startConnection() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/notificationhub") // Adjust this URL to where your NotificationHub is accessible
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection.start()
      .then(() => console.log("Connected to NotificationHub."))
      .catch(err => console.error("SignalR Connection Error: ", err));

    this.connection.on("ReceiveNotification", (notification) => {
      // Handle the received notification
      // For example, you could store it in VueX or emit an event
      console.log("New notification received: ", notification);
    });
  },

  // Additional methods to interact with the hub can be added here
};
