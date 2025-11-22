import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { SavedCourse } from "../types";

const COURSES_COLLECTION = "courses";

export const createCourse = async (
  courseData: Omit<SavedCourse, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const now = Date.now();
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
      ...courseData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  } catch (error) {
    console.error("코스 생성 실패:", error);
    throw new Error("코스 저장에 실패했습니다.");
  }
};

export const getCourse = async (
  courseId: string
): Promise<SavedCourse | null> => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as SavedCourse;
    }
    return null;
  } catch (error) {
    console.error("코스 조회 실패:", error);
    throw new Error("코스를 불러오는데 실패했습니다.");
  }
};

export const getUserCourses = async (
  userId: string
): Promise<SavedCourse[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const courses: SavedCourse[] = [];

    querySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      } as SavedCourse);
    });

    courses.sort((a, b) => b.updatedAt - a.updatedAt);

    return courses;
  } catch (error) {
    console.error("코스 목록 조회 실패:", error);
    throw new Error("코스 목록을 불러오는데 실패했습니다.");
  }
};

export const updateCourse = async (
  courseId: string,
  updates: Partial<Omit<SavedCourse, "id" | "createdAt">>
): Promise<void> => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("코스 수정 실패:", error);
    throw new Error("코스 수정에 실패했습니다.");
  }
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, courseId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("코스 삭제 실패:", error);
    throw new Error("코스 삭제에 실패했습니다.");
  }
};

export const getPublicCoursesByTheme = async (
  theme: string
): Promise<SavedCourse[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where("theme", "==", theme),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const courses: SavedCourse[] = [];

    querySnapshot.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      } as SavedCourse);
    });

    return courses;
  } catch (error) {
    console.error("테마별 코스 조회 실패:", error);
    throw new Error("코스를 불러오는데 실패했습니다.");
  }
};
