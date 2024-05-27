const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
const TOKEN = process.env.TOKEN;
const channelID = process.env.CHANNEL_ID;
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.content.startsWith("!s") && message.channel.id === channelID) {
    const extractedContent = message.content.replace("!s", "");
    console.log(extractedContent);
    io.emit("message", { text: extractedContent, type: "bot" });
  }
});
io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("message", (msg) => {
    console.log("Received message:", msg);
    const channel = client.channels.cache.get(channelID);
    if (channel) {
      // Send the received message to the Discord channel
      channel
        .send(msg)
        .then(() => {
          console.log("Message sent successfully");
          io.emit("message", { text: msg, type: "user" });
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    } else {
      console.error("Channel not found");
    }
  });
});
client.login(TOKEN).catch((error) => {
  console.error("Error logging in:", error);
});
app.get("/", (req, res) => {
  res.send("i love ayaka");
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Love ayaka on port ${PORT}`);
});
