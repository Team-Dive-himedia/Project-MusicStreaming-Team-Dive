import React, { useState } from "react";
import styles from "../css/chatModal.module.css";

const ChatModal = ({ onClose }) => {
  const [messages, setMessages] = useState([{ sender: "ai", text: "질문해봐" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ 메시지 전송 함수
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setLoading(true);
  
    try {
      console.log("📡 Spring Boot 서버로 요청 보내는 중...");
  
      const response = await fetch("http://localhost:8070/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("📩 Spring Boot 응답:", data);
  
      let replyText = data.generated_text || "응답이 없습니다.";
  
      setMessages([...newMessages, { sender: "ai", text: replyText }]);
    } catch (error) {
      console.error("❌ 오류 발생:", error);
      setMessages([...newMessages, { sender: "ai", text: "오류가 발생했습니다. 콘솔을 확인해주세요." }]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.chatContent}>
          <h2>AI Chat</h2>
          <div className={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <p key={idx}>
                <strong>{msg.sender === "user" ? "User" : "AI"}: </strong>
                {msg.text.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
            ))}
            {loading && <p>⏳ AI 응답 중...</p>}
          </div>
          <div className={styles.inputArea}>
            <input
              type="text"
              placeholder="메시지를 입력하세요..."
              className={styles.chatInput}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
