import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    await axios.post('/api/auth/send-otp', { phone });
    setStep(2);
  };

  const handleVerifyOTP = async () => {
    const { data } = await axios.post('/api/auth/verify-otp', { phone, otp });
    localStorage.setItem('token', data.token);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {step === 1 ? (
          <>
            <input
              type="tel"
              placeholder="رقم الواتساب"
              className="w-full p-2 mb-4 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={handleSendOTP}>إرسال رمز التحقق</Button>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="أدخل الرمز"
              className="w-full p-2 mb-4 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button onClick={handleVerifyOTP}>تحقق</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;