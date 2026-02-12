
import React, { useState } from 'react';

interface DocumentUploadViewProps {
  onComplete: (isCertified: boolean) => void;
  onSkip: () => void;
}

const DocumentUploadView: React.FC<DocumentUploadViewProps> = ({ onComplete, onSkip }) => {
  const [checks, setChecks] = useState({
    isAgeOver35: false,
    isSingle: false,
    isBihon: false,
  });

  const allChecked = checks.isAgeOver35 && checks.isSingle && checks.isBihon;

  const toggleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleComplete = () => {
    if (allChecked) {
      onComplete(true);
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-4 page-enter">
      <div className="text-center px-6">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">신뢰를 위한 자율 선언</h2>
        <p className="text-slate-400 mt-2 text-xs font-light leading-relaxed">
          '비혼뒤맑음'은 서로의 삶을 존중하는<br/>
          성숙한 비혼 커뮤니티를 지향합니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-[40px] border border-slate-100 card-shadow flex flex-col gap-6 mx-2">
        {/* Beta Notice Box */}
        <div className="bg-[#F0F7FF] p-5 rounded-3xl border border-[#E0F2FE] flex flex-col gap-3 text-left">
          <div className="flex items-start gap-2">
             <div className="mt-0.5 text-[#3B82F6]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
             </div>
             <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-bold text-slate-800">커뮤니티 가이드라인</span>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  아래 세 가지 핵심 요건을 모두 충족하시는 분들만<br/> 
                  <span className="text-[#2DD4BF] font-bold">비혼뒤맑음</span>의 정식 멤버로 활동하실 수 있습니다.
                </p>
             </div>
          </div>
        </div>

        {/* Declaration Checks */}
        <div className="flex flex-col gap-3">
          {/* 35세 이상 체크박스 */}
          <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${checks.isAgeOver35 ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
            <input type="checkbox" checked={checks.isAgeOver35} onChange={() => toggleCheck('isAgeOver35')} className="hidden" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${checks.isAgeOver35 ? 'bg-[#2DD4BF]' : 'bg-slate-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-[13px] font-bold ${checks.isAgeOver35 ? 'text-slate-800' : 'text-slate-400'}`}>저는 35세 이상의 성인입니다.</span>
            </div>
          </label>

          {/* 미혼 체크박스 */}
          <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${checks.isSingle ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
            <input type="checkbox" checked={checks.isSingle} onChange={() => toggleCheck('isSingle')} className="hidden" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${checks.isSingle ? 'bg-[#2DD4BF]' : 'bg-slate-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-[13px] font-bold ${checks.isSingle ? 'text-slate-800' : 'text-slate-400'}`}>저는 법적으로 미혼 상태입니다.</span>
            </div>
          </label>

          {/* 비혼 체크박스 */}
          <label className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${checks.isBihon ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
            <input type="checkbox" checked={checks.isBihon} onChange={() => toggleCheck('isBihon')} className="hidden" />
            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${checks.isBihon ? 'bg-[#2DD4BF]' : 'bg-slate-200'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`text-[13px] font-bold ${checks.isBihon ? 'text-slate-800' : 'text-slate-400'}`}>저는 비혼주의자이며 비혼 라이프를 지향합니다.</span>
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleComplete}
            disabled={!allChecked}
            className={`w-full py-5 rounded-full font-bold text-[13px] tracking-tight transition-all shadow-lg ${!allChecked ? 'bg-slate-100 text-slate-300' : 'bg-[#2DD4BF] text-white hover:bg-[#28c1ad] active:scale-95'}`}
          >
            선언 완료하고 시작하기
          </button>
          
          <button
            onClick={onSkip}
            className="text-center text-slate-400 text-[11px] font-bold py-2 hover:text-slate-600 transition-colors"
          >
            나중에 하기 (일부 기능 제한)
          </button>
        </div>
      </div>

      <div className="px-10 py-4 flex gap-3 items-start justify-center text-center">
         <p className="text-[10px] text-slate-400 font-light leading-relaxed">
           '비혼뒤맑음'은 거짓 없는 정보를 바탕으로<br/>
           성숙한 커뮤니티 문화를 만들어갑니다.
         </p>
      </div>
    </div>
  );
};

export default DocumentUploadView;
