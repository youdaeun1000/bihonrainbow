
import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Meeting, UserParticipation } from './types';
import { MOCK_MEETINGS } from './constants';
import { db, doc, setDoc, getDoc, collection, query, onSnapshot, updateDoc, addDoc, increment, where, getDocs, deleteDoc, arrayUnion } from './firebase';
import PhoneAuthView from './views/PhoneAuthView';
import DocumentUploadView from './views/DocumentUploadView';
import ProfileSetupView from './views/ProfileSetupView';
import WelcomeView from './views/WelcomeView';
import HomeView from './views/HomeView';
import MeetingDetailView from './views/MeetingDetailView';
import MyPageView from './views/MyPageView';
import MessagesView from './views/MessagesView';
import ChatRoomView from './views/ChatRoomView';
import CreateMeetingView from './views/CreateMeetingView';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<Partial<UserProfile>>({});
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // 1. 초기 데이터 로드 및 실시간 모임 감시
  useEffect(() => {
    const savedUserId = localStorage.getItem('bihon_user_id');
    
    // 유저 정보 복구
    if (savedUserId) {
      const unsubUser = onSnapshot(doc(db, 'users', savedUserId), (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        }
      });

      // 참여 정보 복구 (실시간)
      const q = query(collection(db, 'participations'), where('userId', '==', savedUserId));
      const unsubParticipations = onSnapshot(q, (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
          meetingId: doc.data().meetingId,
          isPrivate: doc.data().isPrivate
        }));
        setParticipations(parts);
      });
      return () => {
        unsubUser();
        unsubParticipations();
      };
    }
  }, []);

  useEffect(() => {
    // 모임 목록 실시간 업데이트
    const meetingsQuery = query(collection(db, 'meetings'));
    const unsubscribe = onSnapshot(meetingsQuery, (snapshot) => {
      const meetingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Meeting[];
      
      if (meetingsData.length === 0) {
        setMeetings(MOCK_MEETINGS);
      } else {
        setMeetings(meetingsData);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePhoneAuthComplete = (phoneData: { age: number }) => {
    setTempProfile(prev => ({ ...prev, age: phoneData.age }));
    setView('PROFILE_SETUP');
  };

  const handleProfileSetupComplete = async (profileData: Partial<UserProfile>) => {
    const userId = `user_${Date.now()}`;
    const newUser: UserProfile = {
      id: userId,
      nickname: profileData.nickname || '익명',
      age: tempProfile.age || 35,
      isCertified: false,
      interests: profileData.interests || [],
      bio: profileData.bio || '',
      location: profileData.location || '서울',
      followerCount: 0,
      followingCount: 0,
      blockedUserIds: []
    };

    try {
      await setDoc(doc(db, 'users', userId), newUser);
      setUser(newUser);
      localStorage.setItem('bihon_user_id', userId);
      setView('WELCOME');
    } catch (e) {
      console.error("Error adding user: ", e);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeclarationComplete = async (isCertified: boolean) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { isCertified });
        setUser({ ...user, isCertified });
        
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        } else {
          setView('HOME');
        }
      } catch (e) {
        console.error("Error updating certification: ", e);
      }
    }
  };

  const handleUpdateProfile = async (data: { nickname: string; bio: string }) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, data);
        setUser({ ...user, ...data });
      } catch (e) {
        console.error("Error updating profile: ", e);
        throw e;
      }
    }
  };

  const handleBlockUser = async (targetUserId: string) => {
    if (!user) return;
    if (user.id === targetUserId) return;
    if (user.blockedUserIds.includes(targetUserId)) return;

    if (window.confirm("이 사용자를 차단하시겠습니까? 차단 시 이 사용자의 모임과 메시지가 더 이상 보이지 않습니다.")) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, {
          blockedUserIds: arrayUnion(targetUserId)
        });
        // onSnapshot으로 자동 업데이트됨
      } catch (e) {
        console.error("Error blocking user: ", e);
      }
    }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    if (!user) { setView('AUTH_PHONE'); return; }
    
    const targetMeeting = meetings.find(m => m.id === meetingId);
    if (!targetMeeting) return;

    if (targetMeeting.currentParticipants >= targetMeeting.capacity) {
      alert("이미 정원이 가득 찬 모임입니다.");
      return;
    }

    if (!user.isCertified) {
      setPendingAction(() => () => handleJoinMeeting(meetingId));
      setView('BETA_DECLARATION');
      return;
    }

    const isAlreadyJoined = participations.some(p => p.meetingId === meetingId);
    if (!isAlreadyJoined) {
      try {
        await addDoc(collection(db, 'participations'), {
          userId: user.id,
          meetingId: meetingId,
          isPrivate: false,
          joinedAt: new Date()
        });

        const meetingRef = doc(db, 'meetings', meetingId);
        await updateDoc(meetingRef, {
          currentParticipants: increment(1)
        });
      } catch (e) {
        console.error("Error joining meeting: ", e);
      }
    }
    setActiveChatId(meetingId);
    setView('CHAT_ROOM');
  };

  const handleKickMembers = async (meetingId: string, userIds: string[]) => {
    if (userIds.length === 0) return;
    
    try {
      for (const uid of userIds) {
        const q = query(
          collection(db, 'participations'), 
          where('meetingId', '==', meetingId),
          where('userId', '==', uid)
        );
        const snapshot = await getDocs(q);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
      }

      const meetingRef = doc(db, 'meetings', meetingId);
      await updateDoc(meetingRef, {
        currentParticipants: increment(-userIds.length)
      });
    } catch (e) {
      console.error("Error kicking participants: ", e);
      alert("내보내기 중 오류가 발생했습니다.");
    }
  };

  const handleCreateMeetingComplete = async (meetingData: Meeting) => {
    try {
      const { id, ...dataWithoutId } = meetingData;
      await setDoc(doc(db, 'meetings', id), dataWithoutId);
      
      await addDoc(collection(db, 'participations'), {
        userId: user!.id,
        meetingId: id,
        isPrivate: false,
        joinedAt: new Date()
      });

      setView('HOME');
    } catch (e) {
      console.error("Error creating meeting: ", e);
      throw e;
    }
  };

  const renderView = () => {
    return (
      <div className="page-enter">
        {(() => {
          switch (view) {
            case 'AUTH_PHONE': 
              return <PhoneAuthView onComplete={handlePhoneAuthComplete} onCancel={() => setView('HOME')} />;
            case 'BETA_DECLARATION': 
              return <DocumentUploadView onComplete={handleDeclarationComplete} onSkip={() => setView('HOME')} />;
            case 'PROFILE_SETUP': 
              return <ProfileSetupView onComplete={handleProfileSetupComplete} />;
            case 'WELCOME': 
              return <WelcomeView onFinish={() => setView('HOME')} />;
            case 'HOME': 
              return (
                <HomeView 
                  user={user} 
                  meetings={meetings.filter(m => !user?.blockedUserIds.includes(m.hostId))} 
                  onSelectMeeting={(id) => { 
                    setActiveChatId(null);
                    setSelectedMeetingId(id); 
                    setView('MEETING_DETAIL'); 
                  }} 
                  onCreateClick={() => {
                    if (!user) setView('AUTH_PHONE');
                    else if (!user.isCertified) {
                      setPendingAction(() => () => setView('CREATE_MEETING'));
                      setView('BETA_DECLARATION');
                    }
                    else setView('CREATE_MEETING');
                  }} 
                />
              );
            case 'MEETING_DETAIL': {
              const m = meetings.find(meeting => meeting.id === selectedMeetingId);
              return m ? (
                <MeetingDetailView 
                  user={user} 
                  meeting={m} 
                  isJoined={participations.some(p => p.meetingId === m.id)} 
                  onJoin={handleJoinMeeting} 
                  onKickMembers={handleKickMembers}
                  onBlockUser={handleBlockUser}
                  onBack={() => {
                    if (activeChatId) setView('CHAT_ROOM');
                    else setView('HOME');
                  }} 
                />
              ) : null;
            }
            case 'CREATE_MEETING': 
              return <CreateMeetingView user={user!} onComplete={handleCreateMeetingComplete} onBack={() => setView('HOME')} />;
            case 'MY_PAGE': 
              return (
                <MyPageView 
                  user={user} 
                  participations={participations} 
                  allMeetings={meetings} 
                  onToggleVisibility={() => {}} 
                  onLogout={() => { setUser(null); localStorage.removeItem('bihon_user_id'); setView('HOME'); }} 
                  onUpdateProfile={handleUpdateProfile}
                  onSelectMeeting={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }}
                />
              );
            case 'CHATTING': 
              return (
                <MessagesView 
                  userParticipations={participations} 
                  allMeetings={meetings.filter(m => !user?.blockedUserIds.includes(m.hostId))} 
                  onSelectChat={(id) => { setActiveChatId(id); setView('CHAT_ROOM'); }} 
                />
              );
            case 'CHAT_ROOM': {
              const m = meetings.find(meeting => meeting.id === activeChatId);
              return user && m ? (
                <ChatRoomView 
                  user={user} 
                  meeting={m} 
                  onBack={() => setView('CHATTING')} 
                  onShowDetail={(id) => {
                    setSelectedMeetingId(id);
                    setView('MEETING_DETAIL');
                  }}
                  onBlockUser={handleBlockUser}
                />
              ) : null;
            }
            default: 
              return <HomeView user={user} meetings={meetings} onSelectMeeting={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onCreateClick={() => setView('CREATE_MEETING')} />;
          }
        })()}
      </div>
    );
  };

  const showHeader = ['HOME', 'MEETING_DETAIL', 'MY_PAGE', 'CHATTING', 'CREATE_MEETING', 'AUTH_PHONE', 'BETA_DECLARATION', 'PROFILE_SETUP'].includes(view);
  const showNav = ['HOME', 'MY_PAGE', 'CHATTING'].includes(view);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white relative border-x border-slate-100 shadow-sm">
      {showHeader && <Header title={view === 'HOME' ? '비혼뒤맑음' : ''} showBack={['MEETING_DETAIL', 'CREATE_MEETING', 'AUTH_PHONE', 'BETA_DECLARATION', 'PROFILE_SETUP'].includes(view)} onBack={() => {
        if (view === 'MEETING_DETAIL' && activeChatId) setView('CHAT_ROOM');
        else setView('HOME');
      }} />}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-32' : 'pb-16'}`}>
        {renderView()}
      </main>
      {showNav && <NavigationBar currentView={view} onViewChange={setView} />}
    </div>
  );
};

export default App;
