
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const SERVER_URL = "http://localhost:5000";

function App() {
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState("");

  // Connect to the group chat after login
  useEffect(() => {
    if (!currentUser) return;

    const chatSocket = io(SERVER_URL);
    setSocket(chatSocket);

    chatSocket.on("chat:history", (history) => {
      setMessages(history);
    });

    chatSocket.on("message:new", (message) => {
      setMessages((previous) => [...previous, message]);
    });

    chatSocket.on("message:updated", (updatedMessage) => {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === updatedMessage.id
            ? updatedMessage
            : message
        )
      );
    });

    chatSocket.on("chat:error", (message) => {
      setError(message);
    });

    return () => {
      chatSocket.disconnect();
    };
  }, [currentUser]);

  // Login using email
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setMessages([]);
      setCurrentUser(data.user);
    } catch {
      setError("Unable to connect to server. Start the backend.");
    }
  };

  // Send a message
  const handleSend = (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !socket) return;

    socket.emit("message:send", {
      email: currentUser.email,
      text: newMessage.trim(),
    });

    setNewMessage("");
  };

  // Like or unlike a message
  const handleLike = (messageId) => {
    socket?.emit("message:like", {
      messageId,
      email: currentUser.email,
    });
  };

  // Logout
  const handleLogout = () => {
    socket?.disconnect();
    setSocket(null);
    setCurrentUser(null);
    setMessages([]);
    setNewMessage("");
    setEmail("");
    setError("");
  };

  // Login page
  if (!currentUser) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="logo">💬</div>

          <h1>Welcome to ChatSpace</h1>
          <p>Sign in to join your group conversation.</p>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" className="login-button">
              Join Chat
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <div className="demo-users">
            <strong>Demo accounts</strong>
            <p>alan@gmail.com</p>
            <p>bob@gmail.com</p>
            <p>carol@gmail.com</p>
            <p>dean@gmail.com</p>
            <p>elin@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }

  // Group chat page
  return (
    <div className="chat-page">
      <div className="chat-container">

        <header className="chat-header">
          <div>
            <h2>💬 ChatSpace</h2>
            <p>Group conversation</p>
          </div>

          <div className="user-info">
            <span className="online-dot"></span>
            <strong>{currentUser.username}</strong>

            <button
              onClick={handleLogout}
              className="logout-button"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="messages-area">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <h3>Welcome to the group!</h3>
              <p>Start the conversation by sending a message.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isMine =
                message.email === currentUser.email;

              const liked =
                message.likes.includes(currentUser.email);

              return (
                <div
                  className={`message-row ${
                    isMine ? "my-message" : ""
                  }`}
                  key={message.id}
                >
                  <div className="message-content">
                    <div className="message-author">
                      {message.username}
                      {isMine && <span> (You)</span>}
                    </div>

                    <div className="message-bubble">
                      {message.text}
                    </div>

                    <div className="message-actions">
                      <button
                        className={`like-button ${
                          liked ? "liked" : ""
                        }`}
                        onClick={() => handleLike(message.id)}
                      >
                        {liked ? "❤️" : "🤍"}
                      </button>

                      <span>{message.likes.length}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>

        <form className="message-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={!newMessage.trim()}
          >
            Send ➤
          </button>
        </form>

        {error && <p className="error chat-error">{error}</p>}
      </div>
    </div>
  );
}

export default App;
