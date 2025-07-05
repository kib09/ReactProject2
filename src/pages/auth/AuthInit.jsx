// import { create } from "zustand";

// export const useAuthStore = create((set, get) => ({
//   // 유저 로그인 유무 (상태관리)
//   //로그인
// }));

// AuthInit
// src/components/auth/AuthInitializer.jsx
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

//  이 코드는 애초 설계 자체가 최상위 레벨에서 사용되도록 설계
// 인증 상태 초기화와 관리를 위한 컴포넌트
//  -> Zustand로 구현된 인증 스토어와 함께 작동( Firebase 인증 상태를 감지)
export default function AuthInitializer({ children }) {
  const initAuth = useAuthStore((state) => state.initAuth);
  const loading = useAuthStore((state) => state.loading);

  //이 코드 자체가 무의미 하다 라고 느낄 수 있음
  // 1. 사이드 이펙트 관리
  // 2. 메모리 낭비 방지
  // 이러한 컴포넌트들의 분리는 react 자체의 권장 사항
  useEffect(() => {
    // 인증 상태 변화 감지 구독
    const unsubscribe = initAuth();
    // 컴포넌트 언마운트 시 구독 취소
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [initAuth]);

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='w-12 h-12 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin'></div>
      </div>
    );
  }
  return children;
}

// 이컴포넌트의 특징과 패턴
// 1. 선언적 조건부 렌더링 : 상태에 따른 UI 표시
// 2. 단일 책임 원칙을 지켜봤음
// 3. Firebase 구독 (ex: 로그인 기능)의 설정과 정리
// 4. 타입체크
// 5. 중앙화된 인증 초기화
