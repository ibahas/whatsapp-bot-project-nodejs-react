import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellIcon } from '@heroicons/react/24/outline';

const NotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
        const fetchUnread = async () => {
            const { data } = await axios.get('/api/notifications/unread-count');
            setUnreadCount(data.count);
        };
        fetchUnread();
    }, []);

    return (
        <div className="relative">
            <button
                onClick={() => setShowList(!showList)}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showList && <NotificationList onClose={() => setShowList(false)} />}
        </div>
    );
};
