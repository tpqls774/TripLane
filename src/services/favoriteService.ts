import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Favorite } from "../types/favorite";

const FAVORITES_COLLECTION = "favorites";

// 즐겨찾기 추가
export const addFavorite = async (
  favorite: Omit<Favorite, "id" | "createdAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
      ...favorite,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("즐겨찾기 추가 실패:", error);
    throw new Error("즐겨찾기 추가에 실패했습니다.");
  }
};

// 즐겨찾기 제거
export const removeFavorite = async (favoriteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, FAVORITES_COLLECTION, favoriteId));
  } catch (error) {
    console.error("즐겨찾기 제거 실패:", error);
    throw new Error("즐겨찾기 제거에 실패했습니다.");
  }
};

// 사용자의 모든 즐겨찾기 조회
export const getUserFavorites = async (userId: string): Promise<Favorite[]> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);
    const favorites: Favorite[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      favorites.push({
        id: doc.id,
        userId: data.userId,
        placeId: data.placeId,
        title: data.title,
        addr1: data.addr1,
        firstimage: data.firstimage,
        contentTypeId: data.contentTypeId,
        createdAt: data.createdAt.toDate(),
      });
    });

    // 최신순 정렬
    favorites.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return favorites;
  } catch (error) {
    console.error("즐겨찾기 목록 조회 실패:", error);
    throw new Error("즐겨찾기 목록을 불러오는데 실패했습니다.");
  }
};

// 특정 장소가 즐겨찾기되어 있는지 확인
export const getFavoriteByPlace = async (
  userId: string,
  placeId: string
): Promise<Favorite | null> => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where("userId", "==", userId),
      where("placeId", "==", placeId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      userId: data.userId,
      placeId: data.placeId,
      title: data.title,
      addr1: data.addr1,
      firstimage: data.firstimage,
      contentTypeId: data.contentTypeId,
      createdAt: data.createdAt.toDate(),
    };
  } catch (error) {
    console.error("즐겨찾기 확인 실패:", error);
    return null;
  }
};
