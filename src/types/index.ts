// 관광지 컨텐츠 타입
export const ContentType = {
  TOURIST_SPOT: "12", // 관광지
  CULTURE: "14", // 문화시설
  FESTIVAL: "15", // 축제/행사
  COURSE: "25", // 여행코스
  LEPORTS: "28", // 레포츠
  ACCOMMODATION: "32", // 숙박
  SHOPPING: "38", // 쇼핑
  RESTAURANT: "39", // 음식점
} as const;

// 테마 타입
export const ThemeType = {
  WELLNESS: "wellness",
  PET_FRIENDLY: "petFriendly",
  HALLYU: "hallyu",
  GOURMET: "gourmet",
  CULTURE: "culture",
  NATURE: "nature",
} as const;

export type ThemeTypeValue = (typeof ThemeType)[keyof typeof ThemeType];

// API 응답 - 관광지 아이템
export interface TourismPlace {
  contentid: string;
  contenttypeid: string;
  title: string;
  addr1: string;
  addr2?: string;
  mapx: string; // 경도
  mapy: string; // 위도
  mlevel?: string;
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  cpyrhtDivCd?: string;
  areacode?: string;
  sigungucode?: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
  booktour?: string;
  overview?: string;
  homepage?: string;
  createdtime?: string;
  modifiedtime?: string;
}

// API 공통 응답 구조
export interface ApiResponse<T> {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: T[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 코스 아이템 (Firebase 저장용)
export interface CoursePlace {
  placeId: string;
  title: string;
  address: string;
  image?: string;
  contentType: string;
  lat: number;
  lng: number;
  order: number;
}

// 저장된 코스 (Firebase)
export interface SavedCourse {
  id: string;
  userId: string;
  title: string;
  description: string;
  theme: ThemeTypeValue;
  places: CoursePlace[];
  startDate?: string;
  endDate?: string;
  travelers?: number;
  createdAt: number;
  updatedAt: number;
}

// UI 상태 타입
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  isError: boolean;
  message?: string;
}

export interface SuccessState {
  isSuccess: boolean;
  message?: string;
}

// 지역 코드
export interface AreaCode {
  code: string;
  name: string;
  rnum: number;
}
