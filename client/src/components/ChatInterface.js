// components/ChatInterface.js
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageBubble from './MessageBubble';

const ChatInterface = ({ contact }) => {
    const [messages, setMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');
    const socket = useRef();
    const chatEndRef = useRef(null);

    useEffect(() => {
        socket.current = io('http://localhost:5000');

        socket.current.emit('join-chat', contact);

        socket.current.on('message', (msg) => {
            setMessages(prev => [...prev, { ...msg, direction: 'in' }]);
        });

        socket.current.on('message-status', (update) => {
            setMessages(prev => prev.map(msg =>
                msg.id === update.msgId ? { ...msg, status: update.status } : msg
            ));
        });

        return () => socket.current.disconnect();
    }, [contact]);

    const sendMessage = async () => {
        if (!inputMsg.trim()) return;

        const newMsg = {
            id: Date.now(),
            content: inputMsg,
            direction: 'out',
            status: 'sent'
        };

        setMessages(prev => [...prev, newMsg]);
        socket.current.emit('send-message', {
            to: contact,
            message: inputMsg
        });

        setInputMsg('');
    };
    // الواجهة
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef();

    const handleTyping = () => {
        socket.current.emit('typing', contact);
        setIsTyping(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    };
    return (
        <div className="chat-container">
            <div className="messages-area">
                {messages.map(msg => (
                    <MessageBubble
                        key={msg.id}
                        message={msg.content}
                        status={msg.status}
                        direction={msg.direction}
                    />
                ))}
                <div ref={chatEndRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="اكتب رسالتك..."
                />
                <button onClick={sendMessage}>
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};