
import React, { useMemo, useState } from 'react';
import { UserProfile, Meeting, UserParticipation } from '../types';

interface MyPageViewProps {
  user: UserProfile | null;
  participations: UserParticipation[];
  allMeetings: Meeting[];
  onToggleVisibility: (meetingId: string) => void;
  onLogout: () => void;
  onUpdateProfile: (data: { nickname: string; bio: string }) => Promise<void>;
  onSelectMeeting: (meetingId: string) => void;
}

const MyPageView: React.FC<MyPageViewProps> = ({ 
  user, 
  participations, 
  allMeetings, 
  onLogout, 
  onUpdateProfile,
  onSelectMeeting 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(user?.nickname || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const myMeetingsData = useMemo(() => {
    return participations
      .map(p => {
        const meeting = allMeetings.find(m => m.id === p.meetingId);
        if (!meeting) return null;
        return { ...meeting, isPrivate: p.isPrivate };
      })
      .filter((m): m is (Meeting & { isPrivate: boolean }) => m !== null)
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });
  }, [participations, allMeetings]);

  const handleSave = async () => {
    if (!editNickname.trim()) return;
    setIsSaving(true);
    try {
      await onUpdateProfile({ nickname: editNickname, bio: editBio });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert("프로필 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-10 text-center gap-10">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
           </svg>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">멤버십 가입이 필요해요</h2>
          <p className="text-sm text-slate-400 font-light leading-relaxed">
            나만의 소중한 일상을 기록하고 <br/> 새로운 친구들을 만나보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-14 px-6 pt-10 pb-40 page-enter">
      {/* Profile Header */}
      <section className="flex flex-col items-center gap-6 relative">
        <div className="absolute top-0 right-0">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold text-teal-500 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-all"
            >
              수정하기
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => { setIsEditing(false); setEditNickname(user.nickname); setEditBio(user.bio); }}
                className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-full"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs font-bold text-white bg-teal-500 px-4 py-2 rounded-full shadow-md disabled:bg-slate-200"
              >
                {isSaving ? '...' : '저장'}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="w-24 h-24 bg-teal-50 rounded-full border border-teal-100 flex items-center justify-center text-4xl shadow-sm">
            🌿
          </div>
          {user.isCertified && (
             <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.744c0 5.052 3.823 9.21 8.684 9.815a.485.485 0 00.632-.423m0-15.62c4.02.582 7.59 3.085 9.155 6.521a12.01 12.01 0 01-3.155 11.205m-4.987-16.1L12 3m0 0l-.013.01c-.137.017-.273.036-.408.057" />
                </svg>
             </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          {isEditing ? (
            <div className="flex flex-col gap-4 w-full mt-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest px-1">Nickname</label>
                <input 
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-center font-bold text-slate-800 focus:outline-none focus:border-teal-200"
                  placeholder="닉네임 입력"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest px-1">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-[13px] font-light leading-relaxed min-h-[100px] text-center focus:outline-none focus:border-teal-200"
                  placeholder="자기소개를 입력해 주세요."
                />
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{user.nickname}</h2>
              <p className="mt-2 text-[13px] text-slate-500 text-center font-light leading-relaxed max-w-[280px]">
                "{user.bio || '나만의 일상을 소개하는 한 마디를 적어보세요.'}"
              </p>
            </>
          )}
        </div>
      </section>

      {/* Interests */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
           <div className="w-1 h-3 bg-teal-400 rounded-full"></div>
           Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {user.interests.map(interest => (
            <span key={interest} className="px-4 py-2 bg-teal-50 rounded-2xl text-[12px] font-bold text-teal-600 shadow-sm shadow-teal-900/5">
              #{interest}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-widest">
           <div className="w-1 h-3 bg-teal-400 rounded-full"></div>
           Gatherings
        </h3>
        <div className="flex flex-col gap-3">
          {myMeetingsData.map(meeting => (
            <button 
              key={meeting.id} 
              onClick={() => onSelectMeeting(meeting.id)}
              className="w-full text-left bg-white rounded-2xl p-5 border border-slate-100 flex justify-between items-center card-shadow active:scale-[0.98] transition-all hover:border-teal-100"
            >
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-slate-800 text-sm">{meeting.title}</h4>
                <span className="text-[11px] text-slate-400 font-medium">
                  {meeting.date?.split(' ')[0] || meeting.date} | {meeting.location?.split(' ')[1] || meeting.location}
                </span>
              </div>
              <div className="h-2 w-2 rounded-full bg-teal-400"></div>
            </button>
          ))}
          {myMeetingsData.length === 0 && (
            <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
              <p className="text-[12px] text-slate-400 font-medium">참여한 모임이 아직 없어요.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="pt-10 border-t border-slate-100 flex flex-col items-center">
        <button onClick={onLogout} className="text-[11px] font-bold text-slate-300 hover:text-rose-400 transition-colors uppercase tracking-widest">
          Logout Membership
        </button>
      </footer>
    </div>
  );
};

export default MyPageView;
