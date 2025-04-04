import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from './Button';

const NumberList = () => {
    const [numbers, setNumbers] = useState([]);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchNumbers();
    }, []);

    const fetchNumbers = async () => {
        const { data } = await axios.get('/api/numbers');
        setNumbers(data);
    };

    // الواجهة
    const handleFileUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post('/api/upload', formData);
        socket.current.emit('send-message', {
            to: contact,
            message: data.url,
            type: 'file'
        });
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axios.post('/api/numbers/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        setNumbers(data.numbers);
    };

    const deleteNumber = async (numberId) => {
        await axios.delete(`/api/numbers/${numberId}`);
        fetchNumbers();
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">إدارة الأرقام</h2>

            <div className="mb-4">
                <input type="file" accept=".xlsx,.csv" onChange={handleFileUpload} />
                <Button onClick={handleSubmit} className="ml-2">
                    رفع الملف
                </Button>
            </div>

            <div className="space-y-2">
                {numbers.map((num) => (
                    <div key={num._id} className="flex items-center justify-between p-2 border rounded">
                        <span>{num.number} - {num.isValid ? '✅' : '❌'}</span>
                        <Button onClick={() => deleteNumber(num._id)} variant="danger">
                            حذف
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NumberList;