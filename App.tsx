
import React, { useState, useEffect } from 'react';
import { ViewState, UserProfile, Meeting, UserParticipation } from './types';
import { MOCK_MEETINGS } from './constants';
import { 
  db, auth, onAuthStateChanged, signOut, 
  doc, setDoc, getDoc, collection, query, onSnapshot, updateDoc, 
  addDoc, increment, where, getDocs, deleteDoc, arrayUnion, arrayRemove, orderBy 
} from './firebase';
import PhoneAuthView from './views/PhoneAuthView';
import DocumentUploadView from './views/DocumentUploadView';
import ProfileSetupView from './views/ProfileSetupView';
import WelcomeView from './views/WelcomeView';
import HomeView from './views/HomeView';
import MeetingDetailView from './views/MeetingDetailView';
import MyPageView from './views/MyPageView';
import MessagesView from './views/MessagesView';
import ChatRoomView from './views/ChatRoomView';
import ChattingView from './views/MessagesView'; // Assuming Chatting is same as Messages
import CreateMeetingView from './views/CreateMeetingView';
import Header from './components/Header';
import NavigationBar from './components/NavigationBar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [participations, setParticipations] = useState<UserParticipation[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [unreadMeetingIds, setUnreadMeetingIds] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);
        
        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
          if (view === 'AUTH_PHONE' || view === 'PROFILE_SETUP') setView('HOME');
        } else {
          if (view !== 'PROFILE_SETUP') setView('PROFILE_SETUP');
        }
      } else {
        setUser(null);
      }
      setIsInitializing(false);
    });

    return () => unsubscribeAuth();
  }, [view]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'participations'), where('userId', '==', user.id));
      const unsubParticipations = onSnapshot(q, (snapshot) => {
        const parts = snapshot.docs.map(doc => ({
          meetingId: doc.data().meetingId,
          isPrivate: doc.data().isPrivate
        }));
        setParticipations(parts);
      });
      return () => unsubParticipations();
    } else {
      setParticipations([]);
    }
  }, [user]);

  useEffect(() => {
    const meetingsQuery = query(collection(db, 'meetings'));
    const unsubscribe = onSnapshot(meetingsQuery, (snapshot) => {
      const meetingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Meeting[];
      if (meetingsData.length === 0) setMeetings(MOCK_MEETINGS);
      else setMeetings(meetingsData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || participations.length === 0) return;
    const unsubscribes = participations.map(p => {
      const msgQuery = query(collection(db, `meetings/${p.meetingId}/messages`), orderBy('timestamp', 'desc'));
      return onSnapshot(msgQuery, (snapshot) => {
        if (snapshot.empty) return;
        const latestMsg = snapshot.docs[0].data();
        if (latestMsg.senderId !== user.id && activeChatId !== p.meetingId) {
          setUnreadMeetingIds(prev => new Set(prev).add(p.meetingId));
        }
      });
    });
    return () => unsubscribes.forEach(unsub => unsub());
  }, [user?.id, participations, activeChatId]);

  useEffect(() => {
    if (activeChatId && unreadMeetingIds.has(activeChatId)) {
      setUnreadMeetingIds(prev => {
        const next = new Set(prev);
        next.delete(activeChatId);
        return next;
      });
    }
  }, [activeChatId, unreadMeetingIds]);

  const handlePhoneAuthComplete = async (firebaseUser: any) => {
    const phoneNumber = firebaseUser.phoneNumber;
    if (!phoneNumber) return;

    // 1개월 재가입 제한 체크
    const restrictionRef = doc(db, 'restricted_users', phoneNumber);
    const restrictionSnap = await getDoc(restrictionRef);

    if (restrictionSnap.exists()) {
      const withdrawnAt = restrictionSnap.data().withdrawnAt.toDate().getTime();
      const now = new Date().getTime();
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      if (now - withdrawnAt < thirtyDaysInMs) {
        const remainingDays = Math.ceil((thirtyDaysInMs - (now - withdrawnAt)) / (24 * 60 * 60 * 1000));
        alert(`탈퇴 후 1개월간 재가입이 제한됩니다. (약 ${remainingDays}일 남음)\n성숙한 비혼 커뮤니티를 위해 조금만 기다려 주세요.`);
        await signOut(auth);
        setView('HOME');
        return;
      }
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      setUser(userSnap.data() as UserProfile);
      setView('HOME');
    } else {
      setView('PROFILE_SETUP');
    }
  };

  const handleDeclarationComplete = async (isCertified: boolean) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { isCertified: true });
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      } else {
        setView('HOME');
      }
    } catch (e) {
      console.error(e);
      alert("인증 처리 중 오류가 발생했습니다.");
    }
  };

  const handleProfileSetupComplete = async (profileData: Partial<UserProfile>) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;

    const newUser: UserProfile = {
      id: firebaseUser.uid,
      phone: firebaseUser.phoneNumber || '',
      nickname: profileData.nickname || '익명',
      age: 35,
      isCertified: false,
      interests: [],
      bio: '',
      location: profileData.location || '서울',
      followerCount: 0,
      followingCount: 0,
      blockedUserIds: []
    };

    try {
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
      setView('WELCOME');
    } catch (e) {
      console.error(e);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  const handleWithdrawal = async () => {
    if (!user || !auth.currentUser) return;
    if (window.confirm("정말로 탈퇴하시겠습니까? 탈퇴 후 1개월간 재가입이 금지됩니다.")) {
      try {
        const phoneNumber = user.phone;
        const uid = user.id;

        await setDoc(doc(db, 'restricted_users', phoneNumber), {
          phone: phoneNumber,
          uid: uid,
          withdrawnAt: new Date()
        });

        const q = query(collection(db, 'participations'), where('userId', '==', uid));
        const snapshot = await getDocs(q);
        for (const pDoc of snapshot.docs) {
          const mId = pDoc.data().meetingId;
          const meetingRef = doc(db, 'meetings', mId);
          await updateDoc(meetingRef, { currentParticipants: increment(-1) });
          await deleteDoc(pDoc.ref);
        }

        await deleteDoc(doc(db, 'users', uid));
        await signOut(auth);
        setUser(null);
        setView('HOME');
        alert("탈퇴 처리가 완료되었습니다. 1개월 이후 재가입이 가능합니다.");
      } catch (e) {
        console.error(e);
        alert("탈퇴 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setView('HOME');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (data: { nickname: string; bio: string; interests: string[] }) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, data);
        setUser({ ...user, ...data });
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  };

  const handleBlockUser = async (targetUserId: string) => {
    if (!user) return;
    if (user.id === targetUserId) return;
    if (user.blockedUserIds.includes(targetUserId)) return;
    if (window.confirm("이 사용자를 차단하시겠습니까?")) {
      try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { blockedUserIds: arrayUnion(targetUserId) });
      } catch (e) { console.error(e); }
    }
  };

  const handleUnblockUser = async (targetUserId: string) => {
    if (!user) return;
    if (!user.blockedUserIds.includes(targetUserId)) return;
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { blockedUserIds: arrayRemove(targetUserId) });
    } catch (e) { console.error(e); }
  };

  const handleJoinMeeting = async (meetingId: string) => {
    if (!user) { setView('AUTH_PHONE'); return; }
    const targetMeeting = meetings.find(m => m.id === meetingId);
    if (!targetMeeting) return;
    if (targetMeeting.currentParticipants >= targetMeeting.capacity) {
      alert("정원이 가득 찼습니다.");
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
        await updateDoc(meetingRef, { currentParticipants: increment(1) });
      } catch (e) { console.error(e); }
    }
    setActiveChatId(meetingId);
    setView('CHAT_ROOM');
  };

  const handleKickMembers = async (meetingId: string, userIds: string[]) => {
    try {
      for (const uid of userIds) {
        const q = query(collection(db, 'participations'), where('meetingId', '==', meetingId), where('userId', '==', uid));
        const snapshot = await getDocs(q);
        for (const pDoc of snapshot.docs) await deleteDoc(pDoc.ref);
      }
      const meetingRef = doc(db, 'meetings', meetingId);
      await updateDoc(meetingRef, { currentParticipants: increment(-userIds.length) });
    } catch (e) { console.error(e); }
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
    } catch (e) { console.error(e); throw e; }
  };

  const renderView = () => {
    if (isInitializing) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div></div>;

    switch (view) {
      case 'AUTH_PHONE': return <PhoneAuthView onComplete={handlePhoneAuthComplete} onCancel={() => setView('HOME')} />;
      case 'BETA_DECLARATION': return <DocumentUploadView onComplete={handleDeclarationComplete} onSkip={() => setView('HOME')} />;
      case 'PROFILE_SETUP': return <ProfileSetupView onComplete={handleProfileSetupComplete} />;
      case 'WELCOME': return <WelcomeView onFinish={() => setView('HOME')} />;
      case 'HOME': return <HomeView user={user} meetings={meetings.filter(m => !user?.blockedUserIds.includes(m.hostId))} onSelectMeeting={(id) => { setActiveChatId(null); setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onCreateClick={() => { if (!user) setView('AUTH_PHONE'); else if (!user.isCertified) { setPendingAction(() => () => setView('CREATE_MEETING')); setView('BETA_DECLARATION'); } else setView('CREATE_MEETING'); }} />;
      case 'MEETING_DETAIL': {
        const m = meetings.find(meeting => meeting.id === selectedMeetingId);
        return m ? <MeetingDetailView user={user} meeting={m} isJoined={participations.some(p => p.meetingId === m.id)} onJoin={handleJoinMeeting} onKickMembers={handleKickMembers} onBlockUser={handleBlockUser} onUnblockUser={handleUnblockUser} onBack={() => activeChatId ? setView('CHAT_ROOM') : setView('HOME')} /> : null;
      }
      case 'CREATE_MEETING': return <CreateMeetingView user={user!} onComplete={handleCreateMeetingComplete} onBack={() => setView('HOME')} />;
      case 'MY_PAGE': return <MyPageView user={user} participations={participations} allMeetings={meetings} onToggleVisibility={() => {}} onLogout={handleLogout} onWithdrawal={handleWithdrawal} onUpdateProfile={handleUpdateProfile} onSelectMeeting={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onUnblockUser={handleUnblockUser} />;
      case 'CHATTING': return <MessagesView userParticipations={participations} allMeetings={meetings.filter(m => !user?.blockedUserIds.includes(m.hostId))} unreadMeetingIds={unreadMeetingIds} onSelectChat={(id) => { setActiveChatId(id); setView('CHAT_ROOM'); }} />;
      case 'CHAT_ROOM': {
        const m = meetings.find(meeting => meeting.id === activeChatId);
        return user && m ? <ChatRoomView user={user} meeting={m} onBack={() => setView('CHATTING')} onShowDetail={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onBlockUser={handleBlockUser} /> : null;
      }
      default: return <HomeView user={user} meetings={meetings} onSelectMeeting={(id) => { setSelectedMeetingId(id); setView('MEETING_DETAIL'); }} onCreateClick={() => setView('CREATE_MEETING')} />;
    }
  };

  const showHeader = ['HOME', 'MEETING_DETAIL', 'MY_PAGE', 'CHATTING', 'CREATE_MEETING', 'AUTH_PHONE', 'BETA_DECLARATION', 'PROFILE_SETUP'].includes(view);
  const showNav = ['HOME', 'MY_PAGE', 'CHATTING'].includes(view);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white relative border-x border-slate-100 shadow-sm">
      {showHeader && <Header title={view === 'HOME' ? '비혼뒤맑음' : ''} showBack={['MEETING_DETAIL', 'CREATE_MEETING', 'AUTH_PHONE', 'BETA_DECLARATION', 'PROFILE_SETUP'].includes(view)} onBack={() => activeChatId ? setView('CHAT_ROOM') : setView('HOME')} />}
      <main className={`flex-1 overflow-y-auto ${showNav ? 'pb-32' : 'pb-16'}`}>
        <div className="page-enter">{renderView()}</div>
      </main>
      {showNav && <NavigationBar currentView={view} onViewChange={setView} hasChatBadge={unreadMeetingIds.size > 0} />}
    </div>
  );
};

export default App;
