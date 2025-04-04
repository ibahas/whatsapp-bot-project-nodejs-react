import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm, SocialAuth, QRAuth } from '../../components/auth';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            {isLogin ? 'مرحبًا بعودتك! 👋' : 'انضم إلينا الآن 🚀'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'سجّل الدخول لمواصلة العمل' : 'ابدأ رحلتك معنا مجانًا'}
          </p>
        </div>

        <SocialAuth />

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500">أو</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <AuthForm isLogin={isLogin} />

        <QRAuth />

        <p className="text-center mt-6">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'سجّل الآن' : 'سجّل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
};