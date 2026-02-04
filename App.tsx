
import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Meeting, UserParticipation } from './types';
import { MOCK_MEETINGS } from './constants';
// Added 'where' to the imports from firebase
import { db, doc, setDoc, getDoc, collection, query, onSnapshot, updateDoc, addDoc, increment, where } from './firebase';
import PhoneAuthView from './views/PhoneAuthView';
import DocumentUploadView from './views/DocumentUploadView';
import ProfileSetupView from './views/ProfileSetupView';
import WelcomeView from './views/WelcomeView';
import HomeView from './views/HomeView';
import MeetingDetailView from './views/MeetingDetailView';
import MyPageView from './views/MyPageView';
import MessagesView from './views/MessagesView';
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

  // 1. 초기 데이터 로드 및 실시간 모임 감시
  useEffect(() => {
    const savedUserId = localStorage.getItem('bihon_user_id');
    
    // 유저 정보 복구
    if (savedUserId) {
      getDoc(doc(db, 'users', savedUserId)).then(docSnap => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        }
      });

      // 참여 정보 복구
      const q = query(collection(db, 'participations'), where('userId', '==', savedUserId));
      onSnapshot(q, (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
          meetingId: doc.data().meetingId,
          isPrivate: doc.data().isPrivate
        }));
        setParticipations(parts);
      });
    }

    // 모임 목록 실시간 업데이트
    const meetingsQuery = query(collection(db, 'meetings'));
    const unsubscribe = onSnapshot(meetingsQuery, (snapshot) => {
      const meetingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Meeting[];
      
      // Firestore에 데이터가 없으면 Mock 데이터로 시작 (최초 1회)
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
      // Firestore 'users' 컬렉션에 저장
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

  const handleJoinMeeting = async (meetingId: string) => {
    if (!user) { setView('AUTH_PHONE'); return; }
    if (!user.isCertified) {
      setPendingAction(() => () => handleJoinMeeting(meetingId));
      setView('BETA_DECLARATION');
      return;
    }

    const isAlreadyJoined = participations.some(p => p.meetingId === meetingId);
    if (!isAlreadyJoined) {
      try {
        // 1. 참여 정보 저장
        await addDoc(collection(db, 'participations'), {
          userId: user.id,
          meetingId: meetingId,
          isPrivate: false,
          joinedAt: new Date()
        });

        // 2. 모임 인원수 증가
        const meetingRef = doc(db, 'meetings', meetingId);
        await updateDoc(meetingRef, {
          currentParticipants: increment(1)
        });
      } catch (e) {
        console.error("Error joining meeting: ", e);
      }
    }
    setView('HOME');
  };

  const handleCreateMeetingComplete = async (meetingData: Meeting) => {
    try {
      const { id, ...dataWithoutId } = meetingData;
      await setDoc(doc(db, 'meetings', meetingData.id), dataWithoutId);
      setView('HOME');
    } catch (e) {
      console.error("Error creating meeting: ", e);
    }
  };

  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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
              return <HomeView user={user} meetings={meetings} onSelectMeeting={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onCreateClick={() => {
                if (!user) setView('AUTH_PHONE');
                else if (!user.isCertified) {
                  setPendingAction(() => () => setView('CREATE_MEETING'));
                  setView('BETA_DECLARATION');
                }
                else setView('CREATE_MEETING');
              }} />;
            case 'MEETING_DETAIL': {
              const m = meetings.find(meeting => meeting.id === selectedMeetingId);
              return m ? <MeetingDetailView user={user} meeting={m} isJoined={participations.some(p => p.meetingId === m.id)} onJoin={handleJoinMeeting} onBlockHost={() => {}} onBack={() => setView('HOME')} /> : null;
            }
            case 'CREATE_MEETING': 
              return <CreateMeetingView user={user!} onComplete={handleCreateMeetingComplete} onBack={() => setView('HOME')} />;
            case 'MY_PAGE': 
              return <MyPageView user={user} participations={participations} allMeetings={meetings} onToggleVisibility={() => {}} onLogout={() => { setUser(null); localStorage.removeItem('bihon_user_id'); setView('HOME'); }} />;
            case 'CHATTING': 
              return <MessagesView />;
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
      {showHeader && <Header title={view === 'HOME' ? '비혼뒤맑음' : ''} showBack={['MEETING_DETAIL', 'CREATE_MEETING', 'AUTH_PHONE', 'BETA_DECLARATION', 'PROFILE_SETUP'].includes(view)} onBack={() => setView('HOME')} />}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-32' : 'pb-16'}`}>
        {renderView()}
      </main>
      {showNav && <NavigationBar currentView={view} onViewChange={setView} />}
    </div>
  );
};

export default App;
