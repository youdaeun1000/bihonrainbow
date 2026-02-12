
import { Meeting } from './types';

export const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: '주말 아침, 한강 가벼운 러닝',
    category: '운동',
    date: '2025-06-15 10:00',
    location: '서울 영등포구 여의도',
    capacity: 6,
    currentParticipants: 3,
    description: '맑은 공기 마시며 가볍게 뛰고 커피 한 잔 해요. 부담 없이 오실 분들 환영합니다!',
    host: '민트초코',
    hostId: 'user_201',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
    moodTags: ['편안한', '건강한', '러닝'],
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    title: '전략 보드게임 카페 정복기',
    category: '소셜게임',
    date: '2025-06-16 14:00',
    location: '서울 관악구 샤로수길',
    capacity: 4,
    currentParticipants: 2,
    description: '승부욕보다는 즐겁게 웃고 떠들며 보드게임 하실 분 구합니다. 초보자 대환영!',
    host: '루미',
    hostId: 'user_202',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&q=80&w=600',
    moodTags: ['웃음보장', '친근한', '전략'],
    createdAt: '2024-01-02T10:00:00Z'
  },
  {
    id: '3',
    title: '성수동 현대미술 전시 투어',
    category: '전시',
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
    title: '경제적 자유를 위한 투자 스터디',
    category: '스터디/커리어',
    date: '2025-06-18 19:30',
    location: '서울 강남구 테헤란로',
    capacity: 6,
    currentParticipants: 2,
    description: '각자의 투자 경험을 공유하고 성장을 도모하는 시간입니다. 진지하게 배우실 분 환영해요.',
    host: '파이어족',
    hostId: 'user_205',
    isCertifiedOnly: true,
    imageUrl: 'https://images.unsplash.com/photo-1591115765373-520b7a217287?auto=format&fit=crop&q=80&w=600',
    moodTags: ['자기계발', '경제공부', '성장'],
    createdAt: '2024-01-04T10:00:00Z'
  },
  {
    id: '5',
    title: '심야 서점, 조용한 독서 시간',
    category: '독서',
    date: '2025-06-19 21:00',
    location: '서울 마포구 합정동',
    capacity: 4,
    currentParticipants: 1,
    description: '각자 읽고 싶은 책을 가져와서 조용히 읽고 짧게 소감을 나눕니다.',
    host: '책벌레',
    hostId: 'user_206',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600',
    moodTags: ['조용한', '몰입', '밤독서'],
    createdAt: '2024-01-05T10:00:00Z'
  },
  {
    id: '6',
    title: '연남동 숨은 디저트 카페 탐방',
    category: '맛집/카페',
    date: '2025-06-21 15:00',
    location: '서울 마포구 연남동',
    capacity: 4,
    currentParticipants: 1,
    description: '유명하지는 않지만 정말 맛있는 디저트 카페 같이 가요. 달콤한 오후를 즐겨봅시다!',
    host: '카페투어러',
    hostId: 'user_207',
    isCertifiedOnly: false,
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600',
    moodTags: ['달콤한', '소소한', '여유'],
    createdAt: '2024-01-06T10:00:00Z'
  }
];

export const INTEREST_OPTIONS = [
  '산책/등산', '보드게임', '전시회', '원데이클래스', '사진/출사', '반려동물', '카페투어', '영화/넷플릭스', '맛집탐방', '러닝'
];

export const CATEGORIES = ['전체', '소셜게임', '전시', '스터디/커리어', '독서', '맛집/카페', '운동', '기타'];
