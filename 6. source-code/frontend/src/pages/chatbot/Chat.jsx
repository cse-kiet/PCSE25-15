import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../context/AuthContext";
import { useMessageStore } from "../../hooks/useMessageStore";
import { useStressScore } from "../../hooks/useStressScore";

const MESSAGES_PER_PAGE = 20;

function ChatApp() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const chatContainerRef = useRef();
  const inputRef = useRef();
  const isFetchingRef = useRef(false);
  const { authUser } = useContext(AuthContext);
  const { storeMessage, getMessages, clearSession } = useMessageStore();
  const { storeStressScore } = useStressScore();

  // Generate or retrieve session ID when component mounts
  useEffect(() => {
    if (!authUser) return;

    // Generate a unique session ID for this chat session
    const newSessionId = `${authUser._id}_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setSessionId(newSessionId);

    fetchMessages(1);
  }, [authUser]);

  const fetchMessages = async (pageNum) => {
    if (!authUser || !hasMore || isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      const data = await getMessages(pageNum, MESSAGES_PER_PAGE);

      if (data.length < MESSAGES_PER_PAGE) setHasMore(false);

      // Transform database messages to match chat format
      const transformedMessages = data.map((msg) => ({
        role: msg.role || (msg.sender === "user" ? "user" : "model"),
        message: msg.message || msg.content,
        createdAt: msg.createdAt,
        _id: msg._id,
      }));

      setChatHistory((prev) => [...transformedMessages.reverse(), ...prev]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    if (chatContainerRef.current.scrollTop < 50 && hasMore) {
      fetchMessages(page);
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      await sendStressScore();
      await sendMessage();
    }
  };

  const sendStressScore = async () => {
    try {
      const response = await fetch("http://localhost:8080/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue }),
      });
      const { label, score } = await response.json();
      await storeStressScore(label, score);
    } catch (err) {
      console.error("Stress score error:", err);
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message || !sessionId) return;

    const userMsg = {
      role: "user",
      message,
      createdAt: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, userMsg]);

    try {
      // Store user message in DB
      await storeMessage(message, "user", sessionId);

      // Send message to Gemini with session context
      const response = await fetch("http://localhost:5000/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();
      const botResponse = {
        role: "model",
        message: data.text || "No response.",
        createdAt: new Date().toISOString(),
      };

      setChatHistory((prev) => [...prev, botResponse]);

      // Store model response in DB
      await storeMessage(botResponse.message, "model", sessionId);
    } catch (err) {
      console.error("Send error:", err);

      // Show error message to user
      const errorMsg = {
        role: "model",
        message: "Sorry, I encountered an error. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }

    setInputValue("");
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const clearChat = async () => {
    if (!sessionId) return;

    try {
      // Clear session from Gemini backend
      await fetch(`http://localhost:5000/api/gemini/chat/${sessionId}`, {
        method: "DELETE",
      });

      // Clear session from message store
      await clearSession(sessionId);

      // Generate new session ID
      const newSessionId = `${authUser._id}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setSessionId(newSessionId);

      // Clear local chat history
      setChatHistory([]);

      console.log("Chat session cleared");
    } catch (error) {
      console.error("Failed to clear chat session:", error);
    }
  };

  if (!authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">
          Please log in to access the chat.
        </h1>
        <p className="text-gray-600 mb-4">
          You need to be logged in to use this feature.
        </p>
        <Link to="/login" className="text-blue-500 hover:underline text-lg">
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-3xl mt-20 mb-8 justify-center items-center p-4 bg-orange-50 rounded-lg shadow-md mx-auto">
      <div className="flex justify-between items-center w-full mb-4">
        <div className="text-2xl font-bold text-center flex-1">SAM</div>
        <button
          onClick={clearChat}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Clear Chat
        </button>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="flex flex-col overflow-y-auto h-80 p-4"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          <div className="p-3 bg-orange-100 rounded-lg mb-2 self-start">
            <strong>model: </strong> Hello! How can I help you today?
          </div>

          {chatHistory.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`p-3 rounded-lg mb-2 flex flex-col ${
                msg.role === "model"
                  ? "bg-orange-100 self-start"
                  : "bg-blue-100 self-end"
              }`}
            >
              <div>
                <strong>{msg.role}: </strong>{" "}
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </div>
              <div className="text-xs text-gray-500 self-end">
                {formatTime(msg.createdAt)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!sessionId}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            onClick={sendMessage}
            disabled={!sessionId || !inputValue.trim()}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>

      {sessionId && (
        <div className="text-xs text-gray-400 mt-2">
          Session ID: {sessionId.split("_").pop()}
        </div>
      )}
    </div>
  );
}

export default ChatApp;
