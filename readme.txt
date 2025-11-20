==============================================
Trip Lane - UI 스타일 가이드
==============================================

프로젝트 개요
--------------
테마 기반 여행 큐레이션 웹앱으로, 사용자가 테마를 선택하면 한국관광공사 API를 통해
관광지, 음식점, 숙박 정보를 제공하고 맞춤형 여행 코스를 생성 및 저장할 수 있는 서비스입니다.

기술 스택
--------------
- React 19 (함수형 컴포넌트 + Hooks)
- TypeScript
- Tailwind CSS 4
- React Router DOM
- Firebase (Firestore)
- i18next (다국어 지원)
- Axios
- 한국관광공사 국문 관광정보 서비스 API

==============================================
컬러 팔레트 (Color Palette)
==============================================

주요 색상 (Primary Colors)
---------------------------
- Primary: #3b82f6 (파란색)
  사용처: 주요 버튼, 링크, 선택된 상태, 브랜드 색상

- Primary Dark: #2563eb (진한 파란색)
  사용처: Primary 버튼의 hover 상태

- Primary Light: #dbeafe (연한 파란색)
  사용처: 배경 강조, 선택된 항목 배경

보조 색상 (Secondary Colors)
-----------------------------
- Secondary: #64748b (회색-파랑)
  사용처: 보조 버튼, 비활성 상태

- Secondary Dark: #475569 (진한 회색-파랑)
  사용처: Secondary 버튼의 hover 상태

상태 색상 (Status Colors)
--------------------------
- Success: #10b981 (초록색)
  사용처: 성공 메시지, 완료 상태, Toast 알림

- Success Dark: #059669 (진한 초록색)

- Error: #ef4444 (빨간색)
  사용처: 에러 메시지, 삭제 버튼, 경고 상태

- Error Dark: #dc2626 (진한 빨간색)

- Error Light: #fee2e2 (연한 빨간색)
  사용처: 에러 메시지 배경

텍스트 색상 (Text Colors)
--------------------------
- Text Primary: #1f2937 (진한 회색)
  사용처: 제목, 주요 텍스트

- Text Secondary: #6b7280 (회색)
  사용처: 부제목, 설명 텍스트, 보조 정보

배경 색상 (Background)
-----------------------
- Background: #f9fafb (연한 회색)
  사용처: 페이지 기본 배경

- White: #ffffff
  사용처: 카드 배경, 입력 필드 배경

==============================================
폰트 (Typography)
==============================================

폰트 패밀리
-----------
system-ui, -apple-system, 'Segoe UI', 'Noto Sans KR', sans-serif

폰트 크기 및 용도
-----------------
- text-xs (0.75rem): 작은 라벨, 메타 정보
- text-sm (0.875rem): 보조 텍스트, 설명
- text-base (1rem): 기본 텍스트
- text-lg (1.125rem): 강조 텍스트
- text-xl (1.25rem): 카드 제목
- text-2xl (1.5rem): 섹션 제목
- text-3xl (1.875rem): 페이지 제목
- text-4xl (2.25rem): 메인 제목

폰트 굵기
---------
- font-normal (400): 기본 텍스트
- font-medium (500): 약간 강조
- font-semibold (600): 강조
- font-bold (700): 제목, 중요 정보

==============================================
버튼 스타일 (Button Styles)
==============================================

Primary 버튼
------------
배경: #3b82f6 (Primary)
텍스트: 흰색
Hover: #2563eb (Primary Dark)
용도: 주요 액션 (저장, 확인, 시작 등)

Secondary 버튼
--------------
배경: #64748b의 20% 투명도 (회색)
텍스트: #1f2937 (Text Primary)
Hover: #64748b의 30% 투명도
용도: 보조 액션 (취소, 뒤로가기 등)

Danger 버튼
-----------
배경: #ef4444 (Error)
텍스트: 흰색
Hover: #dc2626 (Error Dark)
용도: 삭제, 위험한 액션

Outline 버튼
------------
배경: 투명
테두리: 2px solid #3b82f6
텍스트: #3b82f6
Hover: 배경 #3b82f6, 텍스트 흰색
용도: 덜 중요한 액션, 토글 버튼

버튼 크기
---------
- Small: px-3 py-1.5 text-sm
- Medium: px-4 py-2 text-base
- Large: px-6 py-3 text-lg

공통 속성
---------
- border-radius: 0.5rem (rounded-lg)
- transition: all 0.2s
- focus: ring-2 ring-primary ring-offset-2
- disabled: opacity-50, cursor-not-allowed

==============================================
카드 스타일 (Card Styles)
==============================================

기본 카드
---------
배경: 흰색
그림자: shadow-md (중간 그림자)
테두리 반경: 0.75rem (rounded-xl)
패딩: 1.5rem (p-6)

Hover 카드
----------
기본 카드 속성 +
Hover: shadow-xl, -translate-y-1 (살짝 위로 이동)
Transition: all 0.3s
용도: 클릭 가능한 카드 (테마 선택, 코스 카드 등)

==============================================
입력 필드 스타일 (Input Fields)
==============================================

기본 Input
----------
배경: 흰색
테두리: 1px solid #d1d5db (회색)
테두리 반경: 0.5rem (rounded-lg)
패딩: 1rem 1rem (px-4 py-2)
폰트 크기: 1rem (text-base)

Focus 상태
----------
테두리: 없음
Ring: 2px #3b82f6 (ring-2 ring-primary)
Outline: 없음

Error 상태
----------
테두리: 1px solid #ef4444 (Error)
Ring: 2px #ef4444 (Error)
하단에 에러 메시지 표시 (text-sm text-error)

Label
-----
폰트 크기: 0.875rem (text-sm)
폰트 굵기: 500 (font-medium)
색상: #1f2937 (Text Primary)
하단 여백: 0.25rem (mb-1)

==============================================
반응형 디자인 (Responsive Design)
==============================================

Tailwind CSS 브레이크포인트 사용
--------------------------------
- 모바일 (기본): < 640px
- sm (Small): >= 640px
- md (Medium): >= 768px
- lg (Large): >= 1024px
- xl (Extra Large): >= 1280px

레이아웃 패턴
-------------
1. 모바일 (< 640px)
   - 1단 그리드 (grid-cols-1)
   - 세로 스택 레이아웃
   - 네비게이션: 아이콘 + 텍스트 축약
   - 카드: 전체 너비

2. 태블릿 (sm, md: 640px - 1024px)
   - 2단 그리드 (sm:grid-cols-2)
   - 헤더: 가로 정렬
   - 카드: 2열 배치

3. 데스크톱 (lg 이상: >= 1024px)
   - 3단 그리드 (lg:grid-cols-3)
   - 넓은 여백
   - 카드: 3열 배치

컨테이너
--------
max-width: 컨테이너 클래스 사용
padding: px-4 (양옆 1rem)
중앙 정렬: mx-auto

==============================================
애니메이션 (Animations)
==============================================

Transition
----------
- 기본: transition-all duration-200
- 카드 Hover: transition-all duration-300
- 버튼: transition-colors duration-200

Custom 애니메이션
-----------------
1. slide-in-right (Toast 알림)
   - 오른쪽에서 슬라이드 인
   - duration: 0.3s
   - easing: ease-out

2. spin (로딩 스피너)
   - 360도 회전
   - animation: spin (Tailwind 기본)

==============================================
아이콘 및 이미지
==============================================

아이콘
------
- 이모지 사용 (유니코드)
- 크기: text-xl ~ text-6xl
- 예시: 🗺️ (지도), 🧘 (웰니스), 🐕 (반려동물)

이미지
------
- 비율: aspect-video (16:9) 또는 aspect-square (1:1)
- 배경: bg-gray-200 (로딩/대체 이미지)
- 테두리 반경: rounded-lg 또는 rounded-xl
- Object Fit: object-cover

==============================================
간격 및 여백 (Spacing)
==============================================

컴포넌트 간 간격
----------------
- 섹션 간: mb-8 (2rem)
- 카드 그리드: gap-6 (1.5rem)
- 버튼 그룹: gap-2 또는 gap-3
- 리스트 아이템: space-y-3 또는 space-y-4

내부 패딩
---------
- 카드: p-6 (1.5rem)
- 버튼: px-4 py-2
- 컨테이너: px-4 py-8

==============================================
상태 표시 (State Indicators)
==============================================

로딩 상태
---------
- 전체 화면: 반투명 배경 + 중앙 스피너
- 부분 로딩: 해당 섹션에 스피너
- 색상: Primary (#3b82f6)
- 애니메이션: spin

성공 상태
---------
- Toast 알림 (녹색 배경)
- 아이콘: ✓
- 자동 사라짐: 3초

에러 상태
---------
- Toast 알림 (빨간 배경)
- 에러 메시지 컴포넌트 (연한 빨강 배경)
- 아이콘: ⚠️ 또는 ✕
- 재시도 버튼 제공

==============================================
접근성 (Accessibility)
==============================================

- Focus 상태: ring-2 ring-primary
- 버튼 disabled 상태: opacity-50 + cursor-not-allowed
- 색상 대비: WCAG AA 기준 준수
- 의미 있는 HTML 태그 사용 (button, nav, main 등)

==============================================
컴포넌트 목록
==============================================

공통 컴포넌트
-------------
1. Button - 재사용 가능한 버튼 컴포넌트
2. Card - 재사용 가능한 카드 컴포넌트
3. Input - 재사용 가능한 입력 필드
4. LoadingSpinner - 로딩 표시
5. ErrorMessage - 에러 메시지 표시
6. Toast - 알림 메시지
7. Navbar - 네비게이션 바

페이지 컴포넌트
---------------
1. Home - 메인 페이지 (테마 선택)
2. Recommend - 추천 코스 페이지
3. MyCourses - 내 코스 목록
4. CourseEdit - 코스 생성/수정
5. PlaceDetail - 장소 상세 정보

==============================================
사용 예시
==============================================

Primary 버튼 예시:
<Button variant="primary" size="md">
  저장하기
</Button>

카드 예시:
<Card hover onClick={handleClick}>
  <h3>제목</h3>
  <p>설명</p>
</Card>

반응형 그리드 예시:
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id}>{item.content}</Card>)}
</div>

==============================================
작성일: 2025년
작성자: 임세빈 팀
==============================================
