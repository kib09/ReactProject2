// src/pages/notice/NoticeDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// Firestore Timestamp 또는 문자열을 안전하게 변환
function formatDate(ts) {
  if (!ts) return '';
  if (typeof ts === 'object' && ts.seconds) {
    return new Date(ts.seconds * 1000).toLocaleDateString();
  }
  if (typeof ts === 'string') {
    return ts;
  }
  return '';
}

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Firestore에서 공지사항 단건 조회
  useEffect(() => {
    async function fetchNotice() {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'announcements', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNotice({ id, ...docSnap.data() });
        } else {
          setError('공지사항을 찾을 수 없습니다.');
        }
      } catch {
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchNotice();
  }, [id]);

  // 삭제 핸들러 (나중에 Firebase 연동)
  const handleDelete = async () => {
    if (window.confirm('이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'announcements', id));
        alert('공지사항이 삭제되었습니다.');
        navigate('/notice');
      } catch {
        alert('공지사항 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-8'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-5/6'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold text-gray-800'>오류가 발생했습니다</h2>
          <p className='mt-2 text-gray-600'>{error}</p>
          <Link
            to='/notice'
            className='mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
          >
            공지사항 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {notice && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
          <div className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              {notice.isImportant && (
                <span className='px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full'>
                  중요
                </span>
              )}
              <h1 className='text-2xl font-bold text-gray-900'>{notice.title}</h1>
            </div>

            <div className='flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100'>
              <span>{notice.department}</span>
              <span className='mx-1'>•</span>
              <span>{notice.author}</span>
              <span className='mx-1'>•</span>
              <span>{formatDate(notice.createdAt)}</span>
              {notice.updatedAt && (
                <>
                  <span className='mx-1'>•</span>
                  <span>수정됨: {formatDate(notice.updatedAt)}</span>
                </>
              )}
              <span className='mx-1'>•</span>
              <span>조회 {notice.viewCount}</span>
            </div>

            {/* 공지사항 내용 */}
            <div className='prose max-w-none mb-6'>
              <p className='whitespace-pre-line text-gray-800'>{notice.content}</p>
            </div>

            {/* 첨부 파일 */}
            {notice.attachments && notice.attachments.length > 0 && (
              <div className='mt-8 pt-6 border-t border-gray-100'>
                <h3 className='text-sm font-medium text-gray-700 mb-3'>첨부 파일</h3>
                <div className='space-y-2'>
                  {notice.attachments.map((file) => (
                    <a
                      key={file.id}
                      href='#'
                      className='flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                    >
                      <span className='text-gray-500'>📎</span>
                      <span className='text-sm text-gray-700'>{file.name}</span>
                      <span className='text-xs text-gray-500 ml-auto'>{file.size}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 하단 액션 버튼 */}
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center'>
            <Link to='/notice' className='text-gray-600 hover:text-gray-900'>
              목록으로
            </Link>

            <div className='flex gap-2'>
              <Link
                to={`/notice/${notice.id}/edit`}
                className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
