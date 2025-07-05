// src/components/dashboard/NoticeWidget.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabase';
// import { useAuth } from "../../contexts/AuthContext";
// import { useAuthStore } from "../../store/authStore";
// import { useNoticeStore } from '../../store/noticeStore';

export default function NoticeWidget() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchNotices() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setNotices(data || []);
      } catch (err) {
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotices();
  }, []);

  // 공지사항 날짜 포맷 함수
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD 형식
  };

  if (loading) return <div>공지사항 로딩 중...</div>;
  if (error) return <div className='text-red-500'>{error}</div>;

  return (
    <div className='bg-white overflow-hidden shadow-lg rounded-2xl'>
      <div className='p-6 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-between items-center'>
        <h2 className='text-xl font-bold text-white'>공지사항</h2>
        <Link to='/notice' className='text-blue-100 hover:text-white text-sm font-medium'>
          모두 보기 →
        </Link>
      </div>

      {notices.length === 0 ? (
        <div className='p-6 text-center text-gray-500'>
          <p>표시할 공지사항이 없습니다.</p>
        </div>
      ) : (
        <ul className='divide-y divide-gray-100'>
          {notices.map((notice) => (
            <li key={notice.id}>
              <Link
                to={`/notice/${notice.id}`}
                className='block hover:bg-gray-50 transition-colors'
              >
                <div className='px-6 py-4'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-900'>{notice.title}</p>
                      <div className='mt-1 flex items-center text-xs text-gray-500'>
                        <span>{notice.department || '전체'}</span>
                        <span className='mx-1'>•</span>
                        <span>{notice.authorName || '관리자'}</span>
                      </div>
                    </div>
                    <div className='ml-2 flex-shrink-0 text-xs text-gray-500'>
                      {formatDate(notice.created_at)}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className='bg-gray-50 px-6 py-3'>
        <Link
          to='/notice/new'
          className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
        >
          공지사항 작성
        </Link>
      </div>
    </div>
  );
}
