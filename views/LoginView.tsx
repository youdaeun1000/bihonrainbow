
import React, { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

interface LoginViewProps {
  onComplete: (user: any) => void;
  onCancel: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onComplete, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onComplete(result.user);
    } catch (e: any) {
      console.error(e);
      setError('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-8 px-6 pb-20 page-enter">
      <div className="text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
           </svg>
        </div>
        <h2 className="serif-font text-2xl font-bold text-slate-800 tracking-tight">반갑습니다.</h2>
        <p className="text-slate-400 mt-3 text-xs font-light leading-relaxed">
          35세 이상 비혼 커뮤니티 입장을 위해<br/>구글 계정으로 간편하게 로그인을 진행합니다.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-lg shadow-teal-900/5 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="p-5 bg-teal-50/30 rounded-3xl border border-teal-50 flex items-center gap-4">
            <span className="text-xl">🛡️</span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              성숙한 신뢰 관계 형성을 위해<br/>
              <span className="text-teal-600 font-bold">탈퇴 시 1개월간 재가입이 제한</span>됩니다.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full bg-white border border-slate-200 hover:border-teal-200 text-slate-700 font-bold py-5 rounded-[28px] transition-all shadow-sm active:scale-[0.97] text-sm tracking-tight flex items-center justify-center gap-3 ${
              isLoading ? 'bg-slate-50 opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 계속하기
              </>
            )}
          </button>
          
          {error && <p className="text-rose-500 text-[10px] font-bold text-center mt-2">{error}</p>}
        </div>

        <button
          onClick={onCancel}
          className="text-center text-slate-300 text-[10px] font-bold tracking-widest uppercase hover:text-slate-400"
        >
          둘러보기로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default LoginView;
