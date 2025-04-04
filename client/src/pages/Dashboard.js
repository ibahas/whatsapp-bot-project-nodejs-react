import React from 'react';
import Button from '../components/Button';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مرحبا بك في لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* بطاقة إرسال رسالة */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">إرسال رسالة</h2>
          <Button onClick={() => alert('فتح نموذج الإرسال')}>
            إرسال الآن
          </Button>
        </div>
        {/* بطاقة الأرقام المؤرشفة */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">الأرقام المؤرشفة</h2>
          <Button onClick={() => alert('فتح الأرشيف')}>
            عرض الأرشيف
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;