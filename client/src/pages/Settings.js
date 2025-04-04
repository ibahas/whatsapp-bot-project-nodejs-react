import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';

const Settings = () => {
    const [user, setUser] = useState({});
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await axios.get('/api/user/me', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(data);
            setPhone(data.phone);
        };
        fetchUser();
    }, []);

    const handleUpdate = async () => {
        await axios.patch('/api/user/update', { phone }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('تم التحديث بنجاح!');
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">الإعدادات</h2>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1">رقم الهاتف:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <Button onClick={handleUpdate} className="w-full">
                    حفظ التغييرات
                </Button>
            </div>
        </div>
    );
};

export default Settings;