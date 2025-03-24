import React, { useState, useEffect, useRef } from "react";
import "./Chatbox.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        // Tự động cuộn xuống khi có tin nhắn mới
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage = { text: input, type: "user" };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch("http://localhost:5000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                throw new Error(`Server lỗi: ${response.status}`);
            }

            const data = await response.json();
            const botMessage = { text: data.response, type: "bot" };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Lỗi khi gọi API chatbot:", error);
            setMessages((prevMessages) => [...prevMessages, { text: "Chatbot đang gặp sự cố!", type: "bot" }]);
        }

        setInput("");
    };

    return (
        <>
            <div className="chatbox" style={{ display: isOpen ? "block" : "none" }}>
                <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
                    Chatbot <i className="fa-solid fa-chevron-down"></i>
                </div>
                <div className="chat-body" ref={chatBodyRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.type === "user" ? "user-message" : "bot-message"}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Nhập tin nhắn..."
                    />
                    <button className="send-button" onClick={sendMessage}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            {!isOpen && (
                <div className="chat-icon" onClick={() => setIsOpen(true)}>
                    <img src="https://static.vecteezy.com/system/resources/previews/021/495/949/original/messenger-logo-icon-free-png.png" alt="Chat" />
                </div>
            )}
        </>
    );
};

export default Chatbot;
