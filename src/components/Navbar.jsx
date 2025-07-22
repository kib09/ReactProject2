// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <nav className='text-white bg-indigo-600 shadow-lg'>
      <div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          <div className='flex items-center'>
            <Link to='/' className='flex items-center flex-shrink-0'>
              <span className='text-xl font-bold'>작당모의</span>
            </Link>
            {/* 데스크탑 메뉴 */}
            <div className='hidden md:flex items-center ml-10 space-x-4'>
              <Link to='/' className='px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500'>
                홈
              </Link>
              <Link
                to='/notice'
                className='px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500'
              >
                공지사항
              </Link>
              <Link
                to='/tasks'
                className='px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500'
              >
                작업관리
              </Link>
              <Link
                to='/calendar'
                className='px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-500'
              >
                일정관리
              </Link>
            </div>
          </div>
          {/* 모바일 햄버거 버튼 */}
          <div className='flex items-center md:hidden'>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded={menuOpen}
            >
              <span className='sr-only'>메뉴 열기</span>
              {/* 햄버거 아이콘 */}
              <svg
                className={`h-6 w-6 transition-transform ${menuOpen ? 'rotate-90' : ''}`}
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                {menuOpen ? (
                  // X 아이콘
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  // 햄버거 아이콘
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
          {/* 데스크탑 유저/로그아웃 */}
          <div className='hidden md:flex items-center'>
            {currentUser && (
              <div className='flex items-center space-x-4'>
                <span className='text-sm'>{currentUser.displayName || currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className='px-3 py-2 text-sm font-medium bg-indigo-700 rounded-md hover:bg-indigo-800'
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
        {/* 모바일 메뉴 드롭다운 */}
        {menuOpen && (
          <div className='md:hidden' id='mobile-menu'>
            <div className='px-2 pt-2 pb-3 space-y-1'>
              <Link
                to='/'
                className='block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500'
                onClick={() => setMenuOpen(false)}
              >
                홈
              </Link>
              <Link
                to='/notice'
                className='block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500'
                onClick={() => setMenuOpen(false)}
              >
                공지사항
              </Link>
              <Link
                to='/tasks'
                className='block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500'
                onClick={() => setMenuOpen(false)}
              >
                작업관리
              </Link>
              <Link
                to='/calendar'
                className='block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-500'
                onClick={() => setMenuOpen(false)}
              >
                일정관리
              </Link>
              {currentUser && (
                <div className='border-t border-indigo-400 mt-2 pt-2'>
                  <span className='block px-3 py-2 text-sm'>
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className='w-full text-left px-3 py-2 text-base font-medium bg-indigo-700 rounded-md hover:bg-indigo-800 mt-1'
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
