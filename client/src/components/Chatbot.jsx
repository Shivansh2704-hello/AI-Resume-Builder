import { useState, useEffect, useRef } from "react";

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I’m your ATS Assistant 🤖. Ask me how to improve your score.", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    
    const currentInput = input; // Store it for the API call
    setInput(""); // Clear immediately for better UX

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: currentInput })
      });

      const data = await res.json();
      const botReply = { text: data.reply, sender: "bot" };

      setMessages((prev) => [...prev, botReply]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "AI is temporarily unavailable. Please try again later.", sender: "bot" }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#2563eb",
          color: "white",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "24px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}
      >
        {open ? "✖" : "🤖"}
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            height: "450px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden",
            border: "1px solid #e5e7eb"
          }}
        >
          <div style={{ backgroundColor: "#2563eb", color: "white", padding: "15px", fontWeight: "bold" }}>
            ATS AI Assistant
          </div>

          <div 
            ref={scrollRef}
            style={{ flex: 1, padding: "15px", overflowY: "auto", backgroundColor: "#f9fafb" }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  marginBottom: "12px"
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === "user" ? "#2563eb" : "#ffffff",
                    color: msg.sender === "user" ? "white" : "#374151",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    border: msg.sender === "user" ? "none" : "1px solid #e5e7eb",
                    display: "inline-block",
                    maxWidth: "85%",
                    fontSize: "0.9rem"
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #e5e7eb" }}>
            <input
              style={{
                flex: 1,
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "20px",
                outline: "none"
              }}
              value={input}
              onKeyDown={handleKeyPress}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for resume tips..."
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                cursor: "pointer",
                fontWeight: "600"
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;