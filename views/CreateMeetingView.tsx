
import React, { useState } from 'react';
import { UserProfile, Meeting } from '../types';
import { CATEGORIES } from '../constants';

interface CreateMeetingViewProps {
  user: UserProfile;
  onComplete: (meeting: Meeting) => void;
  onBack: () => void;
}

const CreateMeetingView: React.FC<CreateMeetingViewProps> = ({ user, onComplete, onBack }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [description, setDescription] = useState('');
  const [isCertifiedOnly, setIsCertifiedOnly] = useState(false);
  const [moodTags, setMoodTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location || !description) {
      setError('모든 필수 항목을 입력해 주세요.');
      return;
    }

    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title,
      category,
      date: `${date} ${time}`,
      location,
      capacity,
      currentParticipants: 1,
      description,
      host: user.nickname,
      hostId: user.id,
      isCertifiedOnly,
      imageUrl: `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600&seed=${Date.now()}`,
      moodTags: moodTags.split(',').map(tag => tag.trim().replace('#', '')).filter(t => t !== '')
    };

    onComplete(newMeeting);
  };

  return (
    <div className="flex flex-col gap-10 pt-6 px-6 pb-40 page-enter">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">즐거운 일상 제안하기</h2>
        <p className="text-sm text-slate-400 font-light">함께하고 싶은 소소한 취미를 멤버들과 공유해 보세요.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="flex flex-col gap-8 bg-white p-6 rounded-[32px] border border-slate-100 card-shadow">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">모임 제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 주말 산책 같이 하실 분?"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium appearance-none"
              >
                {CATEGORIES.filter(c => c !== '전체').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">모집 인원</label>
              <input
                type="number"
                min={2}
                max={15}
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-xs font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">만남 장소</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 여의나루역 2번 출구 앞"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">무드 태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={moodTags}
              onChange={(e) => setMoodTags(e.target.value)}
              placeholder="#편안한, #수다, #주말아침"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 uppercase tracking-widest">모임 상세 내용</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="어떤 활동을 하는지, 준비물은 무엇인지 자세히 적어주세요!"
              className="w-full px-4 py-4 rounded-2xl bg-slate-50 border border-transparent text-slate-800 focus:outline-none focus:bg-white focus:border-teal-200 transition-all min-h-[140px] text-sm font-light leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-100">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] font-bold text-teal-700">인증 멤버 전용</span>
              <span className="text-[10px] text-teal-600 font-medium">인증된 멤버들만 참여를 신청할 수 있습니다.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isCertifiedOnly}
                onChange={(e) => setIsCertifiedOnly(e.target.checked)}
              />
              <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-500"></div>
            </label>
          </div>
        </div>

        {error && <p className="text-rose-500 text-xs font-bold text-center animate-pulse">{error}</p>}

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onBack}
            className="flex-1 py-4 text-sm font-bold text-slate-400 border border-slate-100 bg-white rounded-full hover:bg-slate-50 transition-all"
          >
            뒤로 가기
          </button>
          <button 
            type="submit"
            className="flex-[2] py-4 bg-[#2DD4BF] text-white rounded-full font-bold text-sm shadow-lg hover:bg-[#28c1ad] active:scale-95 transition-all"
          >
            모임 등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeetingView;
