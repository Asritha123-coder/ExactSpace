# 💬 ChatSpace – Real-Time Group Chat Application

ChatSpace is a real-time group chat application built using React.js, Node.js, Express.js, and Socket.IO. Users can join a shared group conversation using a simple email-based login, exchange messages instantly, and like or unlike messages.

## ✨ Features

- **Simple Login:** Users join the chat using their registered email address.
- **Fixed User Identity:** Each email is associated with a predefined username.
- **Group Messaging:** Multiple users can participate in the same group conversation.
- **Real-Time Communication:** Messages are instantly broadcast to all connected users using Socket.IO.
- **Message Likes:** Users can like and unlike individual messages.
- **Live Like Updates:** Like counts update across connected users.
- **Message History:** Newly connected users receive messages currently stored by the server.
- **Logout:** Users can leave the group chat.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- CORS

## 📂 Project Structure

```text
chat-app/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── server/
│   ├── index.js
│   └── package.json
├── index.html
├── package.json
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Asritha123-coder/ExactSpace.git
```

### 2. Navigate to the Chat App

```bash
cd ExactSpace/chat-app
```

### 3. Install frontend dependencies

```bash
npm install
npm install socket.io-client
```

### 4. Set up the backend

Open a new terminal inside the `chat-app` directory:

```bash
cd server
npm install
```

### 5. Start the backend server

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal inside the `chat-app` directory:

```bash
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:5173
```

## 👥 Demo Login Credentials

Use any of the following email addresses to join the group chat.

| Email | Username |
|---|---|
| alan@gmail.com | Alan |
| bob@gmail.com | Bob |
| carol@gmail.com | Carol |
| dean@gmail.com | Dean |
| elin@gmail.com | Elin |

## ⚡ How It Works

1. A user enters a registered email address on the login screen.
2. The backend maps the email to its corresponding username.
3. The user joins the shared group chat.
4. When a user sends a message, Socket.IO broadcasts it to all connected users.
5. Users can like or unlike messages.
6. Updated like counts are broadcast to everyone in the group.

## 🔌 Socket.IO Events

| Event | Description |
|---|---|
| `chat:history` | Sends existing messages to a newly connected user. |
| `message:send` | Sends a new message to the server. |
| `message:new` | Broadcasts a new message to all users. |
| `message:like` | Likes or unlikes a message. |
| `message:updated` | Broadcasts updated message information. |
| `chat:error` | Sends an error message to the client. |

