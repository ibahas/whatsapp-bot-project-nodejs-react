// components/NotificationHandler.js
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

const NotificationHandler = () => {
    useEffect(() => {
        const socket = io('http://localhost:5000');

        socket.on('new-message', (msg) => {
            if (document.hidden) {
                new Notification('رسالة جديدة', {
                    body: msg.content,
                    icon: '/logo.png'
                });
            }
            toast.info(`رسالة جديدة من ${msg.sender}`);
        });

        return () => socket.disconnect();
    }, []);

    return null;
};