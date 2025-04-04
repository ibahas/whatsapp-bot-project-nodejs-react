import React, { useState } from 'react';
import * as XLSX from 'xlsx';

import Button from '../components/Button';

import axios from 'axios';

// داخل handleFileUpload
const reader = new FileReader();
reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const numbers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        .flat()
        .filter(num => num.toString().match(/^\d+$/));
    setNumbers(numbers);
};
reader.readAsArrayBuffer(file);

const SendMessage = () => {

    const [message, setMessage] = useState('');

    const [numbers, setNumbers] = useState([]);

    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {

        const file = e.target.files[0];

        // هنا يمكنك إضافة تحليل ملف Excel باستخدام مكتبة مثل xlsx

        // مثال مبسط لقراءة ملف نصي:

        const reader = new FileReader();

        reader.onload = (e) => {

            const numbers = e.target.result.split('\n').map(num => num.trim());

            setNumbers(numbers);

        };

        reader.readAsText(file);

    };

    const sendMessage = async () => {

        try {

            await axios.post('/api/messages/send', {

                message,

                numbers,

                buttons: [] // يمكن إضافة أزرار هنا

            });

            alert('تم إرسال الرسائل بنجاح!');

        } catch (error) {

            alert('حدث خطأ أثناء الإرسال');

        }

    };

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">إرسال رسائل</h1>

            <div className="bg-white p-4 rounded-lg shadow">

                <textarea

                    className="w-full p-2 mb-4 border rounded"

                    placeholder="نص الرسالة"

                    value={message}

                    onChange={(e) => setMessage(e.target.value)}

                />

                <div className="mb-4">

                    <input

                        type="file"

                        accept=".xlsx,.csv,.txt"

                        onChange={handleFileUpload}

                    />

                    <p className="text-sm text-gray-500 mt-1">

                        يمكنك تحميل ملف Excel/CSV/TXT يحتوي على أرقام (رقم واحد في كل سطر)

                    </p>

                </div>

                <Button onClick={sendMessage}>إرسال الآن</Button>

            </div>

        </div>

    );

};

export default SendMessage;

