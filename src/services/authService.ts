import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName,
      });
    }

    return userCredential.user;
  } catch (error) {
    console.error("회원가입 실패:", error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    throw new Error(getAuthErrorMessage(errorCode));
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("로그인 실패:", error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    throw new Error(getAuthErrorMessage(errorCode));
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("로그아웃 실패:", error);
    throw new Error("로그아웃에 실패했습니다.");
  }
};

export const updateUserProfile = async (
  user: User,
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  try {
    await updateProfile(user, {
      displayName: displayName || user.displayName,
      photoURL: photoURL || user.photoURL,
    });
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    throw new Error(getAuthErrorMessage(errorCode));
  }
};

export const changePassword = async (
  user: User,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);
  } catch (error) {
    console.error("비밀번호 변경 실패:", error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    throw new Error(getAuthErrorMessage(errorCode));
  }
};

export const changeEmail = async (
  user: User,
  newEmail: string,
  currentPassword: string
): Promise<void> => {
  try {
    const credential = EmailAuthProvider.credential(
      user.email!,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    await updateEmail(user, newEmail);
  } catch (error) {
    console.error("이메일 변경 실패:", error);
    const errorCode = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
    throw new Error(getAuthErrorMessage(errorCode));
  }
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "이미 사용 중인 이메일입니다.";
    case "auth/invalid-email":
      return "유효하지 않은 이메일 형식입니다.";
    case "auth/operation-not-allowed":
      return "이메일/비밀번호 로그인이 비활성화되어 있습니다.";
    case "auth/weak-password":
      return "비밀번호는 최소 6자 이상이어야 합니다.";
    case "auth/user-disabled":
      return "비활성화된 계정입니다.";
    case "auth/user-not-found":
      return "존재하지 않는 계정입니다.";
    case "auth/wrong-password":
      return "잘못된 비밀번호입니다.";
    case "auth/invalid-credential":
      return "이메일 또는 비밀번호가 올바르지 않습니다.";
    case "auth/requires-recent-login":
      return "보안을 위해 다시 로그인해주세요.";
    default:
      return "인증 오류가 발생했습니다.";
  }
};
