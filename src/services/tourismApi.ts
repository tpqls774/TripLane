import axios from "axios";
import type { TourismPlace, ApiResponse } from "../types";
import { apiCache, generateCacheKey } from "../utils/cache";

const API_KEY = import.meta.env.VITE_TOURISM_API_KEY || "YOUR_API_KEY";
// 개발 환경에서는 프록시 사용, 프로덕션에서는 직접 URL 사용
const BASE_URL = import.meta.env.DEV
  ? "/api/B551011/KorService2" // 개발: Vite 프록시 사용 (KorService2)
  : "https://apis.data.go.kr/B551011/KorService2"; // 프로덕션: 직접 호출

const defaultParams = {
  serviceKey: API_KEY,
  MobileOS: "ETC",
  MobileApp: "ThemaTourCurator",
  _type: "json",
};

export const getAreaBasedList = async (params: {
  areaCode?: string;
  sigunguCode?: string;
  contentTypeId?: string;
  numOfRows?: number;
  pageNo?: number;
}) => {
  const requestParams = {
    ...defaultParams,
    numOfRows: 20,
    pageNo: 1,
    arrange: "Q", // 수정일순
    ...params,
  };

  const cacheKey = generateCacheKey("areaBasedList2", requestParams);
  const cached = apiCache.get<ApiResponse<TourismPlace>>(cacheKey);

  if (cached) {
    console.log("캐시에서 데이터 반환:", cacheKey);
    return cached;
  }

  try {
    const response = await axios.get<ApiResponse<TourismPlace>>(
      `${BASE_URL}/areaBasedList2`,
      { params: requestParams }
    );

    apiCache.set(cacheKey, response.data);
    console.log("API 호출 및 캐시 저장:", cacheKey);
    return response.data;
  } catch (error) {
    console.error("지역기반 관광정보 조회 실패:", error);
    throw error;
  }
};

export const searchKeyword = async (
  keyword: string,
  contentTypeId?: string
) => {
  const requestParams = {
    ...defaultParams,
    keyword,
    contentTypeId,
    numOfRows: 20,
    pageNo: 1,
  };

  const cacheKey = generateCacheKey("searchKeyword2", requestParams);
  const cached = apiCache.get<ApiResponse<TourismPlace>>(cacheKey);

  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get<ApiResponse<TourismPlace>>(
      `${BASE_URL}/searchKeyword2`,
      { params: requestParams }
    );

    apiCache.set(cacheKey, response.data);
    console.log("API 호출 및 캐시 저장:", cacheKey);
    return response.data;
  } catch (error) {
    console.error("키워드 검색 실패:", error);
    throw error;
  }
};

// 위치기반 관광정보 조회
export const getLocationBasedList = async (
  mapX: number,
  mapY: number,
  radius: number = 5000,
  contentTypeId?: string
) => {
  try {
    const response = await axios.get<ApiResponse<TourismPlace>>(
      `${BASE_URL}/locationBasedList2`,
      {
        params: {
          ...defaultParams,
          mapX,
          mapY,
          radius,
          contentTypeId,
          numOfRows: 20,
          pageNo: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("위치기반 관광정보 조회 실패:", error);
    throw error;
  }
};

export const getDetailCommon = async (contentId: string) => {
  const requestParams = {
    ...defaultParams,
    contentId,
  };

  const cacheKey = generateCacheKey("detailCommon2", requestParams);
  const cached = apiCache.get(cacheKey);

  if (cached) {
    console.log("캐시에서 데이터 반환:", cacheKey);
    return cached;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/detailCommon2`,
      { params: requestParams }
    );

    apiCache.set(cacheKey, response.data);
    console.log("API 호출 및 캐시 저장:", cacheKey);
    return response.data;
  } catch (error) {
    console.error("공통정보 조회 실패:", error);
    throw error;
  }
};

export const getDetailIntro = async (
  contentId: string,
  contentTypeId: string
) => {
  const requestParams = {
    ...defaultParams,
    contentId,
    contentTypeId,
  };

  const cacheKey = generateCacheKey("detailIntro2", requestParams);
  const cached = apiCache.get(cacheKey);

  if (cached) {
    console.log("캐시에서 데이터 반환:", cacheKey);
    return cached;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/detailIntro2`,
      { params: requestParams }
    );

    apiCache.set(cacheKey, response.data);
    console.log("API 호출 및 캐시 저장:", cacheKey);
    return response.data;
  } catch (error) {
    console.error("소개정보 조회 실패:", error);
    throw error;
  }
};

export const getDetailImage = async (contentId: string) => {
  const requestParams = {
    ...defaultParams,
    contentId,
    imageYN: "Y",
    subImageYN: "Y",
  };

  const cacheKey = generateCacheKey("detailImage2", requestParams);
  const cached = apiCache.get(cacheKey);

  if (cached) {
    console.log("캐시에서 데이터 반환:", cacheKey);
    return cached;
  }

  try {
    const response = await axios.get(
      `${BASE_URL}/detailImage2`,
      { params: requestParams }
    );

    apiCache.set(cacheKey, response.data);
    console.log("API 호출 및 캐시 저장:", cacheKey);
    return response.data;
  } catch (error) {
    console.error("이미지정보 조회 실패:", error);
    throw error;
  }
};

export const getDetailPetTour = async (contentId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/detailPetTour2`,
      {
        params: {
          ...defaultParams,
          contentId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("반려동물 동반 여행정보 조회 실패:", error);
    throw error;
  }
};

export const searchFestival = async (
  areaCode?: string,
  eventStartDate?: string
) => {
  try {
    const response = await axios.get<ApiResponse<TourismPlace>>(
      `${BASE_URL}/searchFestival2`,
      {
        params: {
          ...defaultParams,
          areaCode,
          eventStartDate,
          numOfRows: 20,
          pageNo: 1,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("행사정보 조회 실패:", error);
    throw error;
  }
};

export const getAreaCode = async (areaCode?: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/areaCode2`,
      {
        params: {
          ...defaultParams,
          areaCode,
          numOfRows: 100,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("지역코드 조회 실패:", error);
    throw error;
  }
};

export const clearApiCache = () => {
  apiCache.clear();
  console.log("API 캐시가 모두 삭제되었습니다");
};

export const clearExpiredCache = () => {
  apiCache.clearExpired();
  console.log("만료된 API 캐시가 삭제되었습니다");
};

export const getCacheSize = () => {
  return apiCache.size();
};
