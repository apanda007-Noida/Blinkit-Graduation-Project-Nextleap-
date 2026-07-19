"use client";

import { useState } from "react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! I'm your Blinkit Trust Assistant. Have any questions about our products or authenticity guarantees?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      setMessages([...newMessages, data]);
    } catch (error) {
      setMessages([...newMessages, { role: "assistant", content: "Oops, something went wrong!" }]);
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <button 
        className={`chat-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            Blinkit Trust Assistant
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="chat-message assistant typing">
                Typing...
              </div>
            )}
          </div>
          
          <div className="chat-input-area">
            <input 
              type="text" 
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about authenticity..."
              disabled={isLoading}
            />
            <button className="chat-send-btn" onClick={sendMessage} disabled={isLoading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
