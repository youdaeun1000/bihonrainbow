
import React, { useState, useEffect } from 'react';
import { auth, createRecaptcha, signInWithPhoneNumber } from '../firebase';

interface PhoneAuthViewProps {
  onComplete: (firebaseUser: any) => void;
  onCancel: () => void;
}

const PhoneAuthView: React.FC<PhoneAuthViewProps> = ({ onComplete, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendCode = async () => {
    if (!phoneNumber.match(/^010\d{8}$/)) {
      setError('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const appVerifier = createRecaptcha('recaptcha-container');
      const formattedPhone = `+82${phoneNumber.substring(1)}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setTimer(180); // 3분 타이머
    } catch (e: any) {
      console.error(e);
      setError('인증번호 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('인증번호 6자리를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await confirmationResult.confirm(verificationCode);
      onComplete(result.user);
    } catch (e: any) {
      console.error(e);
      setError('인증번호가 일치하지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 mt-8 px-6 pb-20 page-enter">
      <div id="recaptcha-container"></div>
      
      <div className="text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
           </svg>
        </div>
        <h2 className="serif-font text-2xl font-bold text-slate-800 tracking-tight">반갑습니다.</h2>
        <p className="text-slate-400 mt-3 text-xs font-light leading-relaxed">
          35세 이상 비혼 커뮤니티 입장을 위해<br/>휴대폰 번호로 본인 인증을 진행합니다.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-lg shadow-teal-900/5 flex flex-col gap-8">
        {!confirmationResult ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest px-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="01012345678"
                className="w-full px-6 py-4 rounded-3xl bg-teal-50/30 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
              />
            </div>
            
            <button
              onClick={handleSendCode}
              disabled={isLoading || phoneNumber.length < 10}
              className={`w-full bg-[#2DD4BF] text-white font-bold py-5 rounded-[28px] transition-all shadow-lg active:scale-[0.97] text-sm tracking-tight flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-300`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : '인증번호 가기'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Verification Code</label>
                <span className="text-[10px] font-bold text-rose-500">
                  {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                </span>
              </div>
              <input
                type="tel"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="인증번호 6자리"
                className="w-full px-6 py-4 rounded-3xl bg-teal-50/30 border border-transparent text-slate-800 text-center tracking-[0.5em] focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-bold"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className={`w-full bg-[#2DD4BF] text-white font-bold py-5 rounded-[28px] transition-all shadow-lg active:scale-[0.97] text-sm tracking-tight flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-300`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : '인증 완료'}
              </button>
              <button 
                onClick={() => setConfirmationResult(null)}
                className="text-[11px] font-bold text-slate-400 py-2 hover:text-slate-600"
              >
                번호 다시 입력하기
              </button>
            </div>
          </div>
        )}
        
        {error && <p className="text-rose-500 text-[10px] font-bold text-center mt-1">{error}</p>}

        <button
          onClick={onCancel}
          className="text-center text-slate-300 text-[10px] font-bold tracking-widest uppercase hover:text-slate-400"
        >
          둘러보기로 돌아가기
        </button>
      </div>
      
      <div className="p-5 bg-teal-50/30 rounded-3xl border border-teal-50 flex items-center gap-4">
        <span className="text-xl">🛡️</span>
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
          성숙한 신뢰 관계 형성을 위해<br/>
          <span className="text-teal-600 font-bold">탈퇴 시 1개월간 재가입이 제한</span>됩니다.
        </p>
      </div>
    </div>
  );
};

export default PhoneAuthView;
