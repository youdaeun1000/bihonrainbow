
import React from 'react';
import { Meeting, UserProfile } from '../types';

interface MeetingDetailViewProps {
  user: UserProfile | null;
  meeting: Meeting;
  isJoined: boolean;
  onJoin: (id: string) => void;
  onBlockHost: () => void;
  onBack: () => void;
}

const MeetingDetailView: React.FC<MeetingDetailViewProps> = ({ user, meeting, isJoined, onJoin, onBack }) => {
  if (!meeting) return null;

  return (
    <div className="flex flex-col pb-48 page-enter">
      {/* Hero Image */}
      <div className="relative h-[320px] overflow-hidden">
        <img src={meeting.imageUrl} alt={meeting.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10"></div>
        <button 
          onClick={onBack}
          className="absolute top-8 left-6 bg-white/30 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/50 transition-all active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>

      <div className="px-6 -mt-8 relative z-10 bg-white rounded-t-[40px] pt-10 flex flex-col gap-10">
        {/* Core Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
             <span className="px-3 py-1 bg-teal-50 text-teal-600 text-[11px] font-bold rounded-full">{meeting.category}</span>
             {meeting.isCertifiedOnly && (
               <span className="text-[10px] font-bold text-teal-600 border border-teal-100 px-3 py-1 rounded-full flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.052 3.823 9.21 8.684 9.815a.485.485 0 00.632-.423m0-15.62c4.02.582 7.59 3.085 9.155 6.521a12.01 12.01 0 01-3.155 11.205m-4.987-16.1L12 3m0 0l-.013.01c-.137.017-.273.036-.408.057" />
                 </svg>
                 신뢰멤버전용
               </span>
             )}
          </div>
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">{meeting.title}</h2>
          <div className="flex flex-wrap gap-2">
            {meeting.moodTags?.map(tag => (
              <span key={tag} className="text-[12px] text-slate-400 font-medium">#{tag}</span>
            ))}
          </div>
        </header>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-teal-500 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">언제</span>
              <span className="text-xs font-bold text-slate-700">{meeting.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-teal-500 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">어디서</span>
              <span className="text-xs font-bold text-slate-700">{meeting.location}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-teal-500 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.998 5.998 0 00-5.48-5.974m0 0a6.001 6.001 0 00-5.481 5.974m10.962 0A10.4 10.4 0 0112 21.01m-5.962-2.292a10.4 10.4 0 01-5.962-2.292m0 0a3 3 0 014.681-2.72m4.681 2.72l-.001.031c0 .225.012.447.037.666A11.944 11.944 0 0112 21c2.17 0 4.207-.576 5.963-1.584" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">멤버</span>
              <span className="text-xs font-bold text-slate-700">{meeting.currentParticipants} / {meeting.capacity} 명</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-teal-500 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase">호스트</span>
              <span className="text-xs font-bold text-slate-700">{meeting.host}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <article className="flex flex-col gap-6">
          <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            <div className="w-1 h-4 bg-teal-400 rounded-full"></div>
            모임 소개
          </h3>
          <div className="text-slate-600 text-sm leading-relaxed font-light whitespace-pre-wrap px-1">
            {meeting.description}
          </div>
        </article>

        {/* Manners Section */}
        <div className="p-8 rounded-3xl bg-teal-50 border border-teal-100 flex gap-4 items-start shadow-sm shadow-teal-900/5">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.052 3.823 9.21 8.684 9.815a.485.485 0 00.632-.423m0-15.62c4.02.582 7.59 3.085 9.155 6.521a12.01 12.01 0 01-3.155 11.205m-4.987-16.1L12 3m0 0l-.013.01c-.137.017-.273.036-.408.057" />
           </svg>
           <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-teal-700">모두를 위한 약속</span>
              <p className="text-[12px] text-teal-800/70 font-light leading-relaxed">
                비혼뒤맑음은 서로의 독립된 삶을 응원합니다. 가벼운 취향 공유를 통해 건강한 관계를 맺어보세요. 불쾌한 행동은 신고를 통해 즉시 관리됩니다.
              </p>
           </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 glass-nav z-40 flex flex-col">
        <button 
          onClick={() => onJoin(meeting.id)}
          disabled={isJoined}
          className={`w-full font-bold py-5 rounded-full shadow-lg transition-all duration-500 active:scale-[0.98] text-[13px] tracking-tight ${isJoined ? 'bg-slate-100 text-slate-400' : 'bg-[#2DD4BF] text-white hover:bg-[#28c1ad]'}`}
        >
          {isJoined ? '참여가 확정되었습니다' : (user?.isCertified ? '참여 신청하기' : '신뢰 선언 후 참여')}
        </button>
      </div>
    </div>
  );
};

export default MeetingDetailView;
