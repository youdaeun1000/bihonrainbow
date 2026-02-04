
import React from 'react';

const MessagesView: React.FC = () => {
  return (
    <div className="flex flex-col gap-10 pt-10 px-8 pb-40 page-enter">
      <header className="flex flex-col gap-3">
        <span className="text-[11px] font-bold text-[#2DD4BF] uppercase tracking-widest">Chat Lounge</span>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">멤버 라운지</h2>
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          참여가 확정된 멤버들과 <br/> 반가운 인사를 나눠보세요.
        </p>
      </header>

      <div className="bg-teal-50/50 p-10 rounded-[40px] border border-teal-100/50 flex flex-col gap-8 items-center text-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-teal-300 shadow-sm border border-teal-50">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.474-.065.75.75 0 01-.356-.62c.001-.698.147-1.362.414-1.967A8.25 8.25 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
           </svg>
        </div>
        <div className="flex flex-col gap-3">
           <h3 className="font-bold text-slate-700">대화가 곧 시작될 거예요</h3>
           <p className="text-[13px] text-slate-500 font-light leading-relaxed px-4">
             참여 중인 모임의 멤버들이 확정되면 전용 채팅방이 열립니다.
           </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
         <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.052 3.823 9.21 8.684 9.815a.485.485 0 00.632-.423m0-15.62c4.02.582 7.59 3.085 9.155 6.521a12.01 12.01 0 01-3.155 11.205m-4.987-16.1L12 3m0 0l-.013.01c-.137.017-.273.036-.408.057" />
            </svg>
            <span className="text-xs font-bold text-slate-700">커뮤니티 매너</span>
         </div>
         <p className="text-[12px] text-slate-500 font-light leading-relaxed">
           서로의 취향을 존중하는 다정한 대화를 지향합니다. 불쾌한 언행 시 서비스 이용이 제한될 수 있습니다.
         </p>
      </div>
    </div>
  );
};

export default MessagesView;
