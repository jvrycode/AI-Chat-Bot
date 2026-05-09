import React, { useRef, useEffect } from 'react';
import ChatMessage, { Message } from './ChatMessage';
import './ChatContainer.css';

interface ChatContainerProps {
    messages: Message[];
    onEditMessage?: (messageId: string, newContent: string) => void;
    isAITyping?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onEditMessage, isAITyping = false }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="messages-wrapper">
                {messages.length === 0 ? (
                    <div className="empty-state">
                        <h2>What would you like to accomplish today?</h2>
                    </div>
                ) : (
                    messages.map((message) => (
                        <ChatMessage key={message.id} message={message} onEdit={onEditMessage} />
                    ))
                )}
                {isAITyping && (
                    <div className="chat-message assistant fade-in-slide-up">
                        <div className="message-content typing-indicator-container">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatContainer;
