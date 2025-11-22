# Trip Lane

테마 기반 여행 큐레이션 웹 애플리케이션

## 프로젝트 개요

사용자가 여행 테마를 선택하면 한국관광공사 API를 통해 관광지, 음식점, 숙박 정보를 제공하고, 맞춤형 여행 코스를 생성 및 저장할 수 있는 웹 애플리케이션입니다.

## 기술 스택

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Backend**: Firebase (Firestore)
- **Internationalization**: i18next, react-i18next
- **HTTP Client**: Axios
- **API**: 한국관광공사 국문 관광정보 서비스 API
- **Build Tool**: Vite

## 주요 기능

### 1. 테마 선택 및 추천 코스 생성
- 6가지 테마 제공: 웰니스 힐링, 반려동물 동반, 한류/전통 체험, 미식 여행, 문화 탐방, 자연 여행
- 테마에 따른 맞춤형 장소 추천

### 2. 코스 관리 (CRUD)
- **Create**: 새로운 여행 코스 생성
- **Read**: 저장된 코스 목록 조회
- **Update**: 코스 수정 (장소 추가/삭제/순서 변경)
- **Delete**: 코스 삭제

### 3. 장소 상세 정보
- 관광지, 음식점, 숙박 시설의 상세 정보 표시
- 이미지, 주소, 연락처, 운영시간 등

### 4. 다국어 지원
- 한국어, 영어 지원
- UI 텍스트 다국어 처리 (데이터는 원본 유지)

### 5. 반응형 디자인
- 모바일, 태블릿, 데스크톱 대응
- Tailwind CSS 브레이크포인트 활용 (sm, md, lg)

### 6. 상태 관리 및 피드백
- 로딩, 성공, 오류 상태 표시
- Toast 알림 시스템

## 페이지 구조

- `/` - 홈 (테마 선택)
- `/recommend` - 추천 코스 페이지
- `/my-courses` - 내 코스 목록
- `/course/:courseId/edit` - 코스 생성/수정
- `/place/:placeId` - 장소 상세 정보

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성하고 다음 내용을 입력하세요:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

# Korean Tourism API
VITE_TOURISM_API_KEY=your_tourism_api_key

# Kakao Map API (선택사항)
VITE_KAKAO_MAP_APP_KEY=your_kakao_map_app_key
```

### 3. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 프로젝트 설정에서 웹 앱 추가
4. 구성 정보를 `.env` 파일에 입력

### 4. 한국관광공사 API 키 발급

1. [공공데이터포털](https://www.data.go.kr/)에서 회원가입
2. "한국관광공사_국문 관광정보 서비스_GW" 검색
3. 활용신청 후 API 키 발급
4. 발급받은 키를 `.env` 파일의 `VITE_TOURISM_API_KEY`에 입력

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 6. 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 7. 프리뷰

```bash
npm run preview
```

## 프로젝트 구조

```
vite-project/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Navbar.tsx
│   │   └── Toast.tsx
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Recommend.tsx
│   │   ├── MyCourses.tsx
│   │   ├── CourseEdit.tsx
│   │   └── PlaceDetail.tsx
│   ├── services/            # API 및 서비스
│   │   ├── firebase.ts
│   │   ├── tourismApi.ts
│   │   └── courseService.ts
│   ├── types/               # TypeScript 타입 정의
│   │   └── index.ts
│   ├── locales/             # 다국어 파일
│   │   ├── ko.json
│   │   └── en.json
│   ├── App.tsx              # 메인 앱 컴포넌트
│   ├── main.tsx             # 엔트리 포인트
│   ├── i18n.ts              # i18next 설정
│   └── index.css            # 글로벌 스타일
├── readme.txt               # UI 스타일 가이드
├── .env.example             # 환경 변수 예시
└── package.json
```

## UI 스타일 가이드

자세한 UI 스타일 가이드는 `readme.txt` 파일을 참조하세요.

### 컬러 팔레트

- **Primary**: `#3b82f6` (파란색)
- **Success**: `#10b981` (초록색)
- **Error**: `#ef4444` (빨간색)
- **Text Primary**: `#1f2937`
- **Text Secondary**: `#6b7280`

### 반응형 브레이크포인트

- `sm`: 640px 이상
- `md`: 768px 이상
- `lg`: 1024px 이상

## 사용된 API

### 한국관광공사 국문 관광정보 서비스

- `areaBasedList1` - 지역기반 관광정보 조회
- `searchKeyword1` - 키워드 검색
- `detailCommon1` - 공통정보 조회
- `detailIntro1` - 소개정보 조회
- `detailImage1` - 이미지정보 조회
- `detailPetTour1` - 반려동물 동반 여행정보 조회
- `searchFestival1` - 행사정보 조회

### 컨텐츠 타입

- `12`: 관광지
- `14`: 문화시설
- `15`: 축제/행사
- `28`: 레포츠
- `32`: 숙박
- `39`: 음식점

## 개발 가이드

### 새로운 페이지 추가

1. `src/pages/` 폴더에 컴포넌트 생성
2. `src/App.tsx`에 라우트 추가

### 새로운 테마 추가

1. `src/types/index.ts`의 `ThemeType` 객체에 테마 추가
2. `src/locales/ko.json`과 `en.json`에 번역 추가
3. `src/pages/Home.tsx`의 테마 목록에 추가
4. `src/pages/Recommend.tsx`의 `getContentTypesByTheme` 함수에 로직 추가

### Firebase CRUD 작업

`src/services/courseService.ts` 파일의 함수들을 사용:

```typescript
import { createCourse, getCourse, updateCourse, deleteCourse } from './services/courseService';

// 코스 생성
const courseId = await createCourse(courseData);

// 코스 조회
const course = await getCourse(courseId);

// 코스 수정
await updateCourse(courseId, updates);

// 코스 삭제
await deleteCourse(courseId);
```

## 주의사항

1. **API 키 보안**: `.env` 파일은 절대 Git에 커밋하지 마세요
2. **Firebase 규칙**: Firestore 보안 규칙을 적절히 설정하세요
3. **API 제한**: 한국관광공사 API는 일일 호출 횟수 제한이 있습니다

## 트러블슈팅

### Firebase 연결 오류
- `.env` 파일의 Firebase 설정이 정확한지 확인
- Firebase Console에서 웹 앱이 추가되었는지 확인

### API 호출 실패
- 한국관광공사 API 키가 유효한지 확인
- API 키 승인이 완료되었는지 확인 (승인까지 1-2일 소요)
- CORS 이슈가 있는 경우 프록시 설정 고려

### 빌드 오류
- `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`
- TypeScript 타입 오류 확인

## 라이선스

MIT License

## 참고 자료

- [React 공식 문서](https://react.dev/)
- [Tailwind CSS 공식 문서](https://tailwindcss.com/)
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [한국관광공사 Tour API](https://www.data.go.kr/data/15101578/openapi.do)
