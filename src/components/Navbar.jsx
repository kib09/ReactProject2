// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <nav className="text-white bg-indigo-600 shadow-lg">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold">그룹웨어</span>
            </Link>
            <div className="flex items-center ml-10 space-x-4">
              <Link
                to="/"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500"
              >
                홈
              </Link>
              <Link
                to="/notice"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500"
              >
                공지사항
              </Link>
              <Link
                to="/calendar"
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500"
              >
                일정관리
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {currentUser && (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm font-medium bg-indigo-700 rounded-md hover:bg-indigo-800"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
