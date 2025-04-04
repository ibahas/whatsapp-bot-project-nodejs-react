import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import axios from 'axios';

const StatsDashboard = () => {
    const [stats, setStats] = useState({
        campaigns: 0,
        messagesSent: 0,
        engagementRate: 0,
        data: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await axios.get('/api/stats');
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-blue-600 font-bold">عدد الحملات</h3>
                    <p className="text-3xl">{stats.campaigns}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-green-600 font-bold">الرسائل المرسلة</h3>
                    <p className="text-3xl">{stats.messagesSent}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-purple-600 font-bold">معدل التفاعل</h3>
                    <p className="text-3xl">{stats.engagementRate}%</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <BarChart width={800} height={300} data={stats.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
            </div>
        </div>
    );
};