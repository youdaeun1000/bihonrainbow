
import React, { useState, useMemo } from 'react';
import { UserProfile, Meeting } from '../types';
import { CATEGORIES } from '../constants';

interface HomeViewProps {
  user: UserProfile | null;
  meetings: Meeting[];
  onSelectMeeting: (id: string) => void;
  onCreateClick: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ user, meetings, onSelectMeeting, onCreateClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 로컬 추천 로직: 사용자의 관심사와 카테고리가 일치하는 모임을 우선 순위로 정렬
  const sortedMeetings = useMemo(() => {
    const filtered = meetings.filter(m => 
      selectedCategory === '전체' || m.category === selectedCategory
    );

    if (!user) return filtered;

    return [...filtered].sort((a, b) => {
      const aMatch = user.interests.some(interest => a.category.includes(interest) || a.title.includes(interest)) ? 1 : 0;
      const bMatch = user.interests.some(interest => b.category.includes(interest) || b.title.includes(interest)) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [user, meetings, selectedCategory]);

  return (
    <div className="flex flex-col gap-10 pt-6 px-6 pb-40 page-enter">
      {/* Welcome Message */}
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
          {user ? `${user.nickname}님, 반가워요!` : '안녕하세요!'} <br/> 
          <span className="text-[#2DD4BF]">오늘 어떤 즐거움을 찾을까요?</span>
        </h2>
        <p className="text-sm text-slate-400 font-light">비 온 뒤 새벽처럼 맑은 일상을 공유해요.</p>
      </header>

      {/* Category Tabs */}
      <section className="sticky top-20 z-10 bg-[#F8FAFC]/80 backdrop-blur-md py-2 -mx-2 px-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-[13px] font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#2DD4BF] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-100 hover:border-teal-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main List */}
      <section className="flex flex-col gap-8">
        {sortedMeetings.map((meeting) => {
          const isRecommended = user && user.interests.some(interest => meeting.category.includes(interest));
          
          return (
            <div 
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 card-shadow transition-transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative aspect-video overflow-hidden">
                 <img src={meeting.imageUrl} alt={meeting.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-teal-600 shadow-sm">
                      {meeting.category}
                    </span>
                    {isRecommended && (
                      <span className="bg-[#2DD4BF] px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                        맞춤 추천
                      </span>
                    )}
                 </div>
                 {meeting.isCertifiedOnly && (
                   <div className="absolute top-4 right-4">
                      <span className="bg-teal-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                        인증멤버전용
                      </span>
                   </div>
                 )}
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-teal-500 transition-colors">{meeting.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {meeting.moodTags?.map(tag => (
                      <span key={tag} className="text-[11px] text-slate-400 font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                         {meeting.date?.split(' ')[0] || meeting.date}
                      </div>
                      <div className="flex items-center gap-1">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                         </svg>
                         {meeting.location?.split(' ')[1] || meeting.location}
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                      {meeting.currentParticipants} / {meeting.capacity} 명
                   </div>
                </div>
              </div>
            </div>
          );
        })}
        {sortedMeetings.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">
             <p className="text-slate-400 text-sm">해당 카테고리의 모임이 아직 없어요.</p>
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <button
        onClick={onCreateClick}
        className="fixed bottom-32 right-6 h-14 px-6 bg-[#2DD4BF] text-white rounded-full shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-bold">모임 제안</span>
      </button>
    </div>
  );
};

export default HomeView;
