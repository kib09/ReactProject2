import {
  createBrowserRouter,
  Link,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { useAuthState } from "./useAuthState";
import AddData from "./AddData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true, // 기본 경로에 렌더링될 컴포넌트 설정.
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/add-data", // 데이터 추가 페이지 경로
        element: (
          <ProtectedRoute>
            <AddData />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // onAuthStateChanged : firebase 인증 상태 감지
    //  -> 현재 로그인한 사용자 정보를 user State에 저장
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="p-4 bg-blue-600 text-white flex justify-between items-center">
        {user ? (
          <>
            <Link to="/" className="text-lg font-bold hover:underline">
              홈
            </Link>
            <Link to="/add-data" className="text-lg font-bold hover:underline">
              데이터 추가
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="ml-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="text-lg font-bold hover:underline bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
          >
            로그인 화면 이동하기
          </Link>
        )}
      </nav>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
}

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthState();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return <RouterProvider router={router} />;
}
