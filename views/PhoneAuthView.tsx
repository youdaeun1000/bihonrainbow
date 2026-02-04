
import React, { useState } from 'react';

interface PhoneAuthViewProps {
  onComplete: (data: { age: number }) => void;
  onCancel: () => void;
}

const PhoneAuthView: React.FC<PhoneAuthViewProps> = ({ onComplete, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = () => {
    setIsLoading(true);
    // 휴대폰 인증 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      onComplete({ age: 38 }); // 예시 데이터
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-10 mt-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-teal-100">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
           </svg>
        </div>
        <h2 className="serif-font text-2xl font-bold text-slate-800">본인확인이 필요합니다</h2>
        <p className="text-slate-400 mt-3 text-xs font-light leading-relaxed">
          35세 이상 비혼 커뮤니티 유지를 위해<br/>최초 1회 휴대폰 본인확인을 진행합니다.
        </p>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-lg shadow-teal-900/5 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="p-5 bg-teal-50/30 rounded-3xl border border-teal-50 flex items-center gap-4">
            <span className="text-xl">🛡️</span>
            <p className="text-[11px] text-slate-500 font-medium">주민번호를 직접 입력받지 않으며,<br/>통신사를 통한 안전한 인증을 제공합니다.</p>
          </div>
          
          <button
            onClick={handleAuth}
            disabled={isLoading}
            className={`w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-5 rounded-[28px] transition-all shadow-xl shadow-teal-500/20 active:scale-[0.97] text-sm tracking-widest flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : '휴대폰 본인확인 시작'}
          </button>
        </div>

        <button
          onClick={onCancel}
          className="text-center text-slate-300 text-[10px] font-bold tracking-widest uppercase hover:text-slate-400"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default PhoneAuthView;
