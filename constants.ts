
import { Meeting } from './types';

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: '주말 아침, 한강 가벼운 산책',
    category: '산책/스포츠',
    date: '2025-06-15 10:00',
    location: '서울 영등포구 여의도',
    capacity: 6,
    currentParticipants: 3,
    description: '맑은 공기 마시며 가볍게 걷고 커피 한 잔 해요. 부담 없이 오실 분들 환영합니다!',
    host: '민트초코',
    hostId: 'user_201',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
    moodTags: ['편안한', '건강한', '수다'],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    title: '동네 보드게임 카페 정복기',
    category: '게임/취미',
    date: '2025-06-16 14:00',
    location: '서울 관악구 샤로수길',
    capacity: 4,
    currentParticipants: 2,
    description: '승부욕보다는 즐겁게 웃고 떠들며 보드게임 하실 분 구합니다. 초보자 대환영!',
    host: '루미',
    hostId: 'user_202',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600',
    moodTags: ['웃음보장', '친근한', '취향공유'],
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    title: '성수동 팝업스토어 & 전시 투어',
    category: '전시/문화',
    date: '2025-06-20 13:00',
    location: '서울 성동구 성수동',
    capacity: 5,
    currentParticipants: 4,
    description: '요즘 핫한 전시랑 팝업 같이 구경해요. 예쁜 사진 서로 찍어주기도 좋겠네요!',
    host: '전시요정',
    hostId: 'user_203',
    isCertifiedOnly: true,
    imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?auto=format&fit=crop&q=80&w=600',
    moodTags: ['감각적인', '사진맛집', '인증멤버'],
    createdAt: '2024-01-03T10:00:00Z'
  },
  {
    id: '4',
    title: '퇴근 후, 소소한 맥주 한 잔',
    category: '미식/다이닝',
    date: '2025-06-18 19:30',
    location: '서울 마포구 연남동',
    capacity: 4,
    currentParticipants: 1,
    description: '하루의 피로를 날릴 시원한 맥주랑 가벼운 안주 즐겨요. 소소한 대화면 충분합니다.',
    host: '맥주조아',
    hostId: 'user_204',
    isCertifiedOnly: true,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&q=80&w=600',
    moodTags: ['힐링', '소소한', '매너중심'],
    createdAt: '2024-01-04T10:00:00Z'
  }
];

export const INTEREST_OPTIONS = [
  '산책/등산', '보드게임', '전시회', '원데이클래스', '사진/출사', '반려동물', '카페투어', '영화/넷플릭스', '맛집탐방', '러닝'
];

export const CATEGORIES = ['전체', '산책/스포츠', '게임/취미', '전시/문화', '미식/다이닝', '기타'];
