// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function PrivateRoute() {
  const { currentUser, loading } = useAuth();
  // 로딩 중일 때 로딩 화면 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}
