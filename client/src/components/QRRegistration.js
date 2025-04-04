// components/QRRegistration.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const QRRegistration = () => {
    const [qrCode, setQrCode] = useState('');
    const [clientId, setClientId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const initRegistration = async () => {
            const { data } = await axios.get('/api/auth/qr-session');
            setQrCode(data.qrImage);
            setClientId(data.clientId);
        };
        initRegistration();
    }, []);

    useEffect(() => {
        if (!clientId) return;

        const checkAuth = setInterval(async () => {
            const { data } = await axios.get(`/api/auth/check-auth/${clientId}`);
            if (data.status === 'authenticated') {
                clearInterval(checkAuth);
                navigate('/dashboard');
            }
        }, 3000);

        return () => clearInterval(checkAuth);
    }, [clientId]);

    return (
        <div className="qr-registration-container">
            <h2>مسح الكود بواتسابك:</h2>
            <img src={qrCode} alt="Registration QR Code" />
            <p>واتساب → الإعدادات → الأجهزة المرتبطة → إربط جهازًا</p>
        </div>
    );
};