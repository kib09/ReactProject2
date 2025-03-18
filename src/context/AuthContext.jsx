// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Google 로그인 함수
  const loginWithGoogle = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Firestore에 사용자 정보 저장
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: "member",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          settings: {
            theme: "system",
            notifications: {
              email: true,
              push: true,
              desktop: true,
            },
            language: "ko",
          },
        },
        { merge: true }
      );

      return result.user;
    } catch (err) {
      console.error("Google 로그인 오류:", err);
      setError("Google 로그인에 실패했습니다.");
      throw err;
    }
  };

  // 이메일/비밀번호 회원가입 함수
  const register = async (
    email,
    password,
    displayName,
    department,
    position
  ) => {
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        department,
        position,
        role: "member",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        settings: {
          theme: "system",
          notifications: {
            email: true,
            push: true,
            desktop: true,
          },
          language: "ko",
        },
      });

      return userCredential.user;
    } catch (err) {
      console.error("회원가입 오류:", err);
      setError(`회원가입 실패: ${err.message}`);
      throw err;
    }
  };

  // 이메일/비밀번호 로그인 함수
  const login = async (email, password) => {
    try {
      setError("");
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 마지막 로그인 시간 업데이트
      await updateDoc(doc(db, "users", userCredential.user.uid), {
        lastLogin: serverTimestamp(),
      });

      return userCredential.user;
    } catch (err) {
      console.error("로그인 오류:", err);
      setError(`로그인 실패: ${err.message}`);
      throw err;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setError("");
      await signOut(auth);
    } catch (err) {
      console.error("로그아웃 오류:", err);
      setError(`로그아웃 실패: ${err.message}`);
      throw err;
    }
  };

  // 인증 상태 변화 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    loginWithGoogle,
    register,
    login,
    logout,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
