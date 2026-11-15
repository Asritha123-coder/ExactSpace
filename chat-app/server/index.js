
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Fixed email-to-username mapping
const users = {
  "alan@gmail.com": "Alan",
  "bob@gmail.com": "Bob",
  "carol@gmail.com": "Carol",
  "dean@gmail.com": "Dean",
  "elin@gmail.com": "Elin"
};

// Temporary message storage
const messages = [];

// Login API
app.post("/login", (req, res) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!users[email]) {
    return res.status(401).json({
      error: "Email not registered. Please use a demo email."
    });
  }

  res.json({
    user: {
      email,
      username: users[email]
    }
  });
});

// Socket.IO group chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send previous messages to new users
  socket.emit("chat:history", messages);

  // Receive and broadcast a message
  socket.on("message:send", (data) => {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    const text = String(data.text || "").trim();

    if (!users[email] || !text) {
      socket.emit("chat:error", "Invalid user or message.");
      return;
    }

    const message = {
      id: randomUUID(),
      email,
      username: users[email],
      text: text.slice(0, 2000),
      likes: [],
      createdAt: new Date().toISOString()
    };

    messages.push(message);

    // Send message to all connected users
    io.emit("message:new", message);
  });

  // Like or unlike a message
  socket.on("message:like", (data) => {
    const email = String(data.email || "")
      .trim()
      .toLowerCase();

    if (!users[email]) return;

    const message = messages.find(
      (item) => item.id === data.messageId
    );

    if (!message) return;

    if (message.likes.includes(email)) {
      message.likes = message.likes.filter(
        (userEmail) => userEmail !== email
      );
    } else {
      message.likes.push(email);
    }

    // Update likes for everyone
    io.emit("message:updated", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("ChatSpace server is running!");
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
