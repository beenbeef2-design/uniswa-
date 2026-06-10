// UniSwap Mock Data

const UNIVERSITIES = [
  { id: "snu", name: "서울대학교", logoText: "SNU" },
  { id: "yonsei", name: "연세대학교", logoText: "YS" },
  { id: "korea", name: "고려대학교", logoText: "KU" },
  { id: "kaist", name: "KAIST", logoText: "KST" },
  { id: "sogang", name: "서강대학교", logoText: "SG" },
  { id: "skku", name: "성균관대학교", logoText: "SKK" },
  { id: "hanyang", name: "한양대학교", logoText: "HY" }
];

const CATEGORIES = [
  { id: "all", name: "전체", icon: "layout-grid" },
  { id: "electronics", name: "디지털/가전", icon: "laptop" },
  { id: "books", name: "도서/학습", icon: "book-open" },
  { id: "fashion", name: "의류/잡화", icon: "shirt" },
  { id: "living", name: "생활/자취", icon: "home" },
  { id: "tickets", name: "티켓/식권", icon: "ticket" },
  { id: "other", name: "기타", icon: "more-horizontal" }
];

const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    title: "아이패드 프로 11인치 M2 128GB Wi-Fi (스페이스 그레이)",
    price: 820000,
    description: "필기용으로 구매하고 거의 보관만 했습니다. 배터리 효율 98%이고, 액정에 종이질감 필름 붙여져 있어요. 애플펜슬 2세대 포함해서 풀박스로 드립니다. 중앙도서관 앞에서 직거래 희망해요!",
    category: "electronics",
    condition: "S급 (새상품급)",
    school: "snu",
    views: 142,
    likes: 18,
    chatCount: 4,
    image: "assets/ipad_pro.png",
    seller: "컴공새내기",
    sellerRating: 4.9,
    timeAgo: "10분 전",
    verified: true
  },
  {
    id: "prod_2",
    title: "과잠(바시티 자켓) L사이즈 팝니다 (미착용 새제품)",
    price: 45000000, // Wait, varsity jacket for 45,000 KRW, let's write 45000
    price: 45000,
    description: "공동구매 시기를 놓쳐서 추가 주문했는데 사이즈를 잘못 골랐습니다. 택도 안 뗀 완전히 미착용 새제품입니다. L사이즈이고 남녀공용으로 편하게 입기 좋습니다. 학생회관이나 정문 직거래 가능합니다.",
    category: "fashion",
    condition: "S급 (새상품급)",
    school: "yonsei",
    views: 89,
    likes: 7,
    chatCount: 2,
    image: "assets/varsity_jacket.png",
    seller: "연세수호신",
    sellerRating: 4.7,
    timeAgo: "42분 전",
    verified: true
  },
  {
    id: "prod_3",
    title: "맨큐의 경제학 9판 한글판 깨끗합니다",
    price: 22000,
    description: "경제학원론 수업 때 잠깐 보고 필기 거의 없습니다. 앞부분 3페이지만 연필로 얇게 밑줄 쳤고 뒷부분은 아예 새책입니다. 시험기간 전에 미리 싸게 가져가세요! 경영관 로비에서 거래 원해요.",
    category: "books",
    condition: "A급 (사용감 적음)",
    school: "korea",
    views: 210,
    likes: 24,
    chatCount: 6,
    image: "assets/college_textbook.png",
    seller: "호랑이교양맨",
    sellerRating: 4.8,
    timeAgo: "2시간 전",
    verified: true
  },
  {
    id: "prod_4",
    title: "소니 WH-1000XM4 노이즈캔슬링 헤드폰",
    price: 180000,
    description: "독서실에서 공부할 때 쓰려고 샀는데, 에어팟을 더 자주 쓰게 되어 판매합니다. 박스는 없고 충전선과 케이스 포함 풀구성입니다. 노캔 짱짱하게 잘 됩니다. 학술정보원 직거래 선호합니다.",
    category: "electronics",
    condition: "A급 (사용감 적음)",
    school: "kaist",
    views: 312,
    likes: 35,
    chatCount: 8,
    image: "assets/headphones.png",
    seller: "오리주민",
    sellerRating: 5.0,
    timeAgo: "3시간 전",
    verified: true
  },
  {
    id: "prod_5",
    title: "자취방 미니 밥솥 3인용 팝니다 (깨끗함)",
    price: 15000,
    description: "한 학기 자취하는 동안 주말에만 가끔 사용했던 미니 밥솥입니다. 깨끗하게 세척 완료해 두었습니다. 작동 전혀 문제없고 취사/보온 아주 잘 됩니다. 신촌역 부근 자취방 직거래만 가능합니다.",
    category: "living",
    condition: "B급 (사용감 있음)",
    school: "yonsei",
    views: 54,
    likes: 3,
    chatCount: 1,
    image: "https://images.unsplash.com/photo-1544237515-ad8f0ac882da?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    seller: "신촌방랑자",
    sellerRating: 4.5,
    timeAgo: "5시간 전",
    verified: true
  },
  {
    id: "prod_6",
    title: "전공 서적: 알기쉬운 선형대수 12판",
    price: 18000,
    description: "선형대수 수업 교재입니다. 책 상태 아주 양호하고 스프링 제본 되어있어서 필기하기 매우 편합니다. 공대 학생회관이나 백양관 로비 거래 희망합니다.",
    category: "books",
    condition: "A급 (사용감 적음)",
    school: "snu",
    views: 73,
    likes: 5,
    chatCount: 0,
    image: "assets/college_textbook.png", // Reuse this textbook image
    seller: "선대탈출러",
    sellerRating: 4.6,
    timeAgo: "1일 전",
    verified: true
  }
];

const INITIAL_CHATS = [
  {
    chatId: "chat_1",
    productId: "prod_1",
    sellerName: "컴공새내기",
    buyerName: "나",
    lastMessage: "안녕하세요! 아이패드 내일 거래 가능할까요?",
    lastTime: "오후 9:30",
    unread: false,
    messages: [
      { sender: "buyer", text: "안녕하세요! 아이패드 판매글 보고 연락드렸습니다.", time: "오후 9:28" },
      { sender: "seller", text: "네 안녕하세요! 구매 가능하십니다.", time: "오후 9:29" },
      { sender: "buyer", text: "혹시 내일 오후 3시쯤 중앙도서관 앞에서 직거래 가능할까요?", time: "오후 9:30" }
    ],
    botResponses: [
      "네, 내일 오후 3시 중앙도서관 앞 직거래 괜찮습니다! 기기 확인 편하게 하시고 결정해 주세요~",
      "도착하시면 연락 주세요! 저는 도서관 입구 벤치 쪽에 서있겠습니다.",
      "입금은 거래 현장에서 기기 보시고 계좌이체로 해주시면 감사하겠습니다."
    ]
  },
  {
    chatId: "chat_2",
    productId: "prod_4",
    sellerName: "오리주민",
    buyerName: "나",
    lastMessage: "아 네 알겠습니다!",
    lastTime: "어제",
    unread: false,
    messages: [
      { sender: "buyer", text: "혹시 가격 조율 조금 가능할까요...?", time: "어제 오후 2:15" },
      { sender: "seller", text: "죄송합니다 ㅠㅠ 에어팟이랑 비교해도 전혀 하자 없는 최상급 상태라 네고는 어렵습니다.", time: "어제 오후 2:18" },
      { sender: "buyer", text: "아 네 알겠습니다!", time: "어제 오후 2:20" }
    ],
    botResponses: [
      "혹시 내일 직접 가지러 오신다면 5천원 정도는 빼드릴 수 있어요!",
      "연락 주시면 거래 일정 잡아보겠습니다."
    ]
  }
];

// Export to window object for global availability in the frontend
window.UniSwapData = {
  UNIVERSITIES,
  CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_CHATS
};
