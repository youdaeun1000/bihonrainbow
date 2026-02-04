
import React, { useState } from 'react';

const BIHON_VALUES = [
  '나만의 시간 선호', '커리어 집중', '반려동물과 함께', '정서적 독립', '미니멀 라이프', '여행하는 삶', '경제적 자유', '함께 공부하기', '조용한 대화'
];

interface ProfileSetupViewProps {
  onComplete: (data: any) => void;
}

const ProfileSetupView: React.FC<ProfileSetupViewProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [location, setLocation] = useState('서울');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleValue = (val: string) => {
    setSelectedValues(prev => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  return (
    <div className="flex flex-col gap-10 mt-4">
      <div className="text-center">
        <h2 className="serif-font text-2xl font-bold text-slate-800">거의 다 됐습니다</h2>
        <p className="text-slate-400 mt-2 text-xs font-light leading-relaxed">비혼뒤맑음에서 사용할 멋진 프로필을 완성해 주세요.</p>
      </div>

      <div className="flex flex-col gap-8">
        <section className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-sm flex flex-col gap-6">
           <div>
              <label className="block text-[10px] font-black text-teal-600 mb-3 uppercase tracking-widest">Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="어떻게 불러드릴까요?"
                className="w-full px-6 py-4 rounded-3xl bg-teal-50/20 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
              />
           </div>

           <div>
              <label className="block text-[10px] font-black text-teal-600 mb-3 uppercase tracking-widest">Your Location</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['서울', '경기', '인천', '부산', '대구', '기타'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setLocation(loc)}
                    className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all shrink-0 ${location === loc ? 'bg-teal-500 text-white shadow-md' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
           </div>
        </section>

        <section className="bg-white p-8 rounded-[40px] border border-teal-50 shadow-sm flex flex-col gap-6">
           <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-teal-600 uppercase tracking-widest">Bihon Values</label>
              <p className="text-[10px] text-slate-400 font-light">가치관이 닮은 분들과 더 잘 연결됩니다.</p>
           </div>
           <div className="flex flex-wrap gap-2">
             {BIHON_VALUES.map(val => (
               <button
                 key={val}
                 onClick={() => toggleValue(val)}
                 className={`px-4 py-2.5 rounded-2xl text-[10px] font-bold transition-all ${selectedValues.includes(val) ? 'bg-teal-500 text-white shadow-md' : 'bg-white border border-teal-50 text-slate-400 hover:border-teal-100'}`}
               >
                 {val}
               </button>
             ))}
           </div>
        </section>

        <button
          onClick={() => onComplete({ nickname, location, interests: selectedValues })}
          disabled={!nickname.trim()}
          className={`w-full py-5 rounded-[28px] font-bold text-sm tracking-widest transition-all ${!nickname.trim() ? 'bg-slate-100 text-slate-300' : 'bg-teal-500 text-white shadow-xl shadow-teal-500/20 active:scale-95'}`}
        >
          설정 완료
        </button>
      </div>
    </div>
  );
};

export default ProfileSetupView;
