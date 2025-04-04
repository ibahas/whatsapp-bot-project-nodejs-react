import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LinkNumber = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // هنا سيتم إظهار QR code للربط
    // يمكنك استخدام WebSocket أو polling لمراقبة حالة الربط
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ربط رقم الواتساب</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        <p>افتح الواتساب على هاتفك وامسح QR code:</p>
        {/* سيتم عرض QR هنا */}
      </div>
    </div>
  );
};

export default LinkNumber;