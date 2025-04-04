import React, { useState, useEffect } from 'react';

import axios from 'axios';

import Button from '../components/Button';

const ManageNumbers = () => {

    const [numbers, setNumbers] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        fetchNumbers();

    }, []);

    const fetchNumbers = async () => {

        const { data } = await axios.get('/api/numbers');

        setNumbers(data);

    };

    const verifyNumber = async (number) => {

        try {

            await axios.post('/api/numbers/verify', { number });

            alert('الرقم متوفر على واتساب');

        } catch (error) {

            alert('الرقم غير موجود على واتساب');

        }

    };

    const deleteNumber = async (number) => {
        if (window.confirm(`هل تريد حذف الرقم ${number}؟`)) {
            await axios.delete(`/api/numbers/${number}`);
            fetchNumbers();
        }
    };


    const deleteAll = async () => {

        if (window.confirm('هل تريد حذف جميع الأرقام؟')) {

            await axios.delete('/api/numbers');

            fetchNumbers();

        }

    };

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-4">إدارة الأرقام</h1>

            <div className="bg-white p-4 rounded-lg shadow">

                <div className="mb-4">

                    <Button onClick={deleteAll} className="bg-red-600 hover:bg-red-700">

                        حذف الكل

                    </Button>

                </div>

                <table className="w-full">

                    <thead>

                        <tr>

                            <th className="text-left p-2">الرقم</th>

                            <th className="text-left p-2">الحالة</th>

                            <th className="text-left p-2">الإجراءات</th>

                        </tr>

                    </thead>

                    <tbody>

                        {numbers.map((num) => (

                            <tr key={num._id}>

                                <td className="p-2">{num.number}</td>

                                <td className="p-2">{num.isValid ? '✅ صالح' : '❌ غير صالح'}</td>

                                <td className="p-2 space-x-2">

                                    <Button onClick={() => verifyNumber(num.number)}>

                                        تحقق

                                    </Button>

                                    <Button

                                        onClick={() => deleteNumber(num.number)}

                                        className="bg-red-600 hover:bg-red-700"

                                    >

                                        حذف

                                    </Button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default ManageNumbers;

