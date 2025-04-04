import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CreateCampaign = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [buttons, setButtons] = useState([]);
    const [scheduledDate, setScheduledDate] = useState(null);

    const addButton = () => {
        setButtons([...buttons, { text: '', id: `btn_${Date.now()}` }]);
    };

    const handleSubmit = async () => {
        await axios.post('/api/campaigns', {
            name,
            message,
            buttons,
            scheduledAt: scheduledDate
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        alert('تم إنشاء الحملة بنجاح!');
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">إنشاء حملة جديدة</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="اسم الحملة"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <textarea
                    placeholder="نص الرسالة"
                    className="w-full p-2 border rounded h-32"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className="space-y-2">
                    {buttons.map((btn, index) => (
                        <div key={btn.id} className="flex gap-2">
                            <input
                                type="text"
                                placeholder="نص الزر"
                                className="flex-1 p-2 border rounded"
                                value={btn.text}
                                onChange={(e) => {
                                    const newButtons = [...buttons];
                                    newButtons[index].text = e.target.value;
                                    setButtons(newButtons);
                                }}
                            />
                        </div>
                    ))}
                    <Button onClick={addButton} variant="secondary">
                        إضافة زر +
                    </Button>
                </div>

                <div>
                    <label className="block mb-2">جدولة الإرسال:</label>
                    <Calendar
                        onChange={setScheduledDate}
                        value={scheduledDate}
                        minDate={new Date()}
                    />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                    حفظ الحملة
                </Button>
            </div>
        </div>
    );
};

export default CreateCampaign;