// components/ChatWindow.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ChatWindow = ({ chatId }) => {
    const [messages, setMessages] = useState([]);
    const socket = useRef(io('http://localhost:5000'));

    useEffect(() => {
        socket.current.emit('join-chat', chatId);

        socket.current.on('new-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => socket.current.disconnect();
    }, [chatId]);

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b">
                <h2>الدردشة مع العميل</h2>
                <span className="text-green-500">● متصل الآن</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg._id}
                        message={msg}
                    />
                ))}
            </div>

            {/* Input Area */}
            <ChatInput socket={socket} chatId={chatId} />
        </div>
    );
};