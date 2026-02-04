
export interface UserParticipation {
  meetingId: string;
  isPrivate: boolean;
}

export interface UserProfile {
  id: string;
  nickname: string;
  age: number;
  isCertified: boolean;
  interests: string[];
  bio: string;
  location: string;
  followerCount: number;
  followingCount: number;
  blockedUserIds: string[];
}

export interface Meeting {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  currentParticipants: number;
  description: string;
  host: string;
  hostId: string;
  isCertifiedOnly: boolean;
  imageUrl: string;
  moodTags?: string[];
}

export type ViewState = 
  | 'HOME' 
  | 'AUTH_PHONE' 
  | 'BETA_DECLARATION' // AUTH_DOC에서 변경
  | 'PROFILE_SETUP' 
  | 'WELCOME' 
  | 'MEETING_DETAIL' 
  | 'MY_PAGE' 
  | 'CHATTING' 
  | 'CREATE_MEETING';
