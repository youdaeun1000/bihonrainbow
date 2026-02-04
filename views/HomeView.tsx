
import React, { useState, useMemo } from 'react';
import { UserProfile, Meeting } from '../types';
import { CATEGORIES } from '../constants';

interface HomeViewProps {
  user: UserProfile | null;
  meetings: Meeting[];
  onSelectMeeting: (id: string) => void;
  onCreateClick: () => void;
}

type SortOrder = 'START_SOON' | 'NEWEST';

const HomeView: React.FC<HomeViewProps> = ({ user, meetings, onSelectMeeting, onCreateClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortOrder, setSortOrder] = useState<SortOrder>('START_SOON');

  const filteredAndSortedMeetings = useMemo(() => {
    let result = meetings.filter(m => 
      selectedCategory === '전체' || m.category === selectedCategory
    );

    // 정렬 로직
    result = [...result].sort((a, b) => {
      if (sortOrder === 'START_SOON') {
        // 시작일 순 (빠른 날짜 우선)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      } else {
        // 올린순 (최신 생성 우선)
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : parseInt(a.id.replace('meeting_', ''));
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : parseInt(b.id.replace('meeting_', ''));
        return timeB - timeA;
      }
    });

    // 맞춤 추천이 있는 경우 상단으로 올림 (동일 조건 내에서)
    if (user) {
      result.sort((a, b) => {
        const aMatch = user.interests.some(interest => a.category.includes(interest) || a.title.includes(interest)) ? 1 : 0;
        const bMatch = user.interests.some(interest => b.category.includes(interest) || b.title.includes(interest)) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return result;
  }, [user, meetings, selectedCategory, sortOrder]);

  return (
    <div className="flex flex-col gap-8 pt-6 px-6 pb-40 page-enter">
      {/* Welcome Message */}
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">
          {user ? `${user.nickname}님, 반가워요!` : '안녕하세요!'} <br/> 
          <span className="text-[#2DD4BF]">오늘 어떤 즐거움을 찾을까요?</span>
        </h2>
        <p className="text-sm text-slate-400 font-light">비 온 뒤 새벽처럼 맑은 일상을 공유해요.</p>
      </header>

      {/* Category Tabs & Sort Toggles */}
      <div className="flex flex-col gap-4 sticky top-20 z-10 bg-[#F8FAFC]/90 backdrop-blur-md py-3 -mx-2 px-2">
        <section className="flex gap-2 overflow-x-auto scrollbar-hide">
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
        </section>

        <section className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSortOrder('START_SOON')}
              className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors ${sortOrder === 'START_SOON' ? 'text-teal-600' : 'text-slate-400'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${sortOrder === 'START_SOON' ? 'bg-teal-500' : 'bg-transparent'}`}></div>
              시작순
            </button>
            <button 
              onClick={() => setSortOrder('NEWEST')}
              className={`text-[11px] font-bold flex items-center gap-1.5 transition-colors ${sortOrder === 'NEWEST' ? 'text-teal-600' : 'text-slate-400'}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${sortOrder === 'NEWEST' ? 'bg-teal-500' : 'bg-transparent'}`}></div>
              올린순
            </button>
          </div>
          <span className="text-[10px] text-slate-300 font-medium">총 {filteredAndSortedMeetings.length}개</span>
        </section>
      </div>

      {/* Main List */}
      <section className="flex flex-col gap-6">
        {filteredAndSortedMeetings.map((meeting) => {
          const isRecommended = user && user.interests.some(interest => meeting.category.includes(interest));
          
          return (
            <div 
              key={meeting.id}
              onClick={() => onSelectMeeting(meeting.id)}
              className="group bg-white rounded-[32px] border border-slate-100 card-shadow transition-transform hover:-translate-y-1 cursor-pointer p-6 flex flex-col gap-4"
            >
              {/* Badge Row */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="bg-teal-50 px-3 py-1 rounded-full text-[10px] font-bold text-teal-600">
                    {meeting.category}
                  </span>
                  {isRecommended && (
                    <span className="bg-[#2DD4BF] px-3 py-1 rounded-full text-[10px] font-bold text-white">
                      맞춤 추천
                    </span>
                  )}
                </div>
                {meeting.isCertifiedOnly && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.052 3.823 9.21 8.684 9.815a.485.485 0 00.632-.423m0-15.62c4.02.582 7.59 3.085 9.155 6.521a12.01 12.01 0 01-3.155 11.205m-4.987-16.1L12 3m0 0l-.013.01c-.137.017-.273.036-.408.057" />
                    </svg>
                    인증전용
                  </span>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-teal-500 transition-colors">
                  {meeting.title}
                </h4>
                <div className="flex flex-wrap gap-2">
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
                       {meeting.date.split(' ')[0]}
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
          );
        })}
        {filteredAndSortedMeetings.length === 0 && (
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
        <svg xmlns="http://www.w3.org/2000/exports" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-bold">모임 제안</span>
      </button>
    </div>
  );
};

export default HomeView;
