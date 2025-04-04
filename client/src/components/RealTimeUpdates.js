import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io('http://localhost:5000');

const RealTimeUpdates = ({ userId }) => {
    useEffect(() => {
        if (userId) {
            socket.emit('subscribe', userId);

            socket.on('new-notification', (notification) => {
                toast.info(notification.message, {
                    onClick: () => window.location.href = notification.link
                });
            });
        }

        return () => {
            socket.off('new-notification');
        };
    }, [userId]);

    return null;
};