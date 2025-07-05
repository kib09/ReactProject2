import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useNoticeStore } from '../../store/noticeStore';
import { useAuthStore } from '../../store/authStore';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function NoticeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = id !== undefined && id !== 'new';

  // Zustand 스토어에서 필요한 상태와 함수 가져오기
  const { currentNotice, loading, error, fetchNoticeById, clearError, clearCurrentNotice } =
    useNoticeStore();

  const { currentUser } = useAuthStore();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    isImportant: false,
    isHtml: false,
  });

  // 수정 모드인 경우 기존 공지사항 데이터 불러오기
  useEffect(() => {
    if (isEditMode) {
      fetchNoticeById(id);
    } else {
      clearCurrentNotice();
    }

    // 컴포넌트 언마운트 시 에러와 현재 공지사항 초기화
    return () => {
      clearError();
      clearCurrentNotice();
    };
  }, [isEditMode, id, fetchNoticeById, clearCurrentNotice, clearError]);

  // 불러온 공지사항 데이터를 폼에 설정
  useEffect(() => {
    if (isEditMode && currentNotice) {
      setFormData({
        title: currentNotice.title || '',
        content: currentNotice.content || '',
        department: currentNotice.department || '',
        isImportant: currentNotice.isImportant || false,
        isHtml: currentNotice.isHtml || false,
      });
    }
  }, [isEditMode, currentNotice]);

  // 입력 필드 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit 실행됨');

    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    // 디버깅용 콘솔 출력
    console.log('공지사항 저장 시 formData:', formData);
    console.log('공지사항 저장 시 currentUser:', currentUser);

    try {
      if (isEditMode) {
        // 수정
        await updateDoc(doc(db, 'announcements', id), {
          ...formData,
          author: (currentUser && (currentUser.displayName || currentUser.email)) || '익명',
          department: (currentUser && currentUser.department) || formData.department || '',
          updatedAt: serverTimestamp(),
        });
        alert('공지사항이 수정되었습니다.');
      } else {
        // 새로 작성
        await addDoc(collection(db, 'announcements'), {
          ...formData,
          author: (currentUser && (currentUser.displayName || currentUser.email)) || '익명',
          department: (currentUser && currentUser.department) || formData.department || '',
          createdAt: serverTimestamp(),
          date: new Date().toISOString().slice(0, 10),
        });
        alert('공지사항이 작성되었습니다.');
      }
      navigate('/notice');
    } catch (err) {
      alert('공지사항 저장 실패: ' + err.message);
    }
  };

  return (
    <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <Link to='/notice' className='text-indigo-600 hover:text-indigo-900'>
          ← 목록으로 돌아가기
        </Link>
      </div>

      <div className='overflow-hidden bg-white shadow sm:rounded-lg'>
        <div className='px-4 py-5 border-b border-gray-200 sm:px-6'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {isEditMode ? '공지사항 수정' : '새 공지사항 작성'}
          </h1>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className='px-4 py-5 sm:px-6'>
            <div className='p-4 rounded-md bg-red-50'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-red-400'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <p className='text-sm text-red-700'>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {loading && isEditMode ? (
          <div className='flex justify-center px-4 py-12 sm:px-6'>
            <div className='w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin'></div>
          </div>
        ) : (
          /* 공지사항 폼 */
          <form onSubmit={handleSubmit} className='px-4 py-5 sm:px-6'>
            <div className='space-y-6'>
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  제목 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className='block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm'
                  placeholder='공지사항 제목을 입력하세요'
                />
              </div>

              <div>
                <label htmlFor='department' className='block text-sm font-medium text-gray-700'>
                  부서
                </label>
                <select
                  id='department'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  className='block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                >
                  <option value=''>전체</option>
                  <option value='경영지원팀'>경영지원팀</option>
                  <option value='개발팀'>개발팀</option>
                  <option value='디자인팀'>디자인팀</option>
                  <option value='마케팅팀'>마케팅팀</option>
                  <option value='영업팀'>영업팀</option>
                  <option value='인사팀'>인사팀</option>
                  <option value='IT인프라팀'>IT인프라팀</option>
                </select>
              </div>

              <div>
                <label htmlFor='content' className='block text-sm font-medium text-gray-700'>
                  내용 <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='content'
                  name='content'
                  rows='15'
                  value={formData.content}
                  onChange={handleChange}
                  required
                  className='block w-full mt-1 border-gray-300 rounded-md shadow-sm sm:text-sm'
                  placeholder='공지사항 내용을 입력하세요'
                ></textarea>
              </div>

              <div className='flex items-center'>
                <input
                  id='isImportant'
                  name='isImportant'
                  type='checkbox'
                  checked={formData.isImportant}
                  onChange={handleChange}
                  className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                />
                <label htmlFor='isImportant' className='block ml-2 text-sm text-gray-900'>
                  중요 공지사항으로 표시
                </label>
              </div>

              <div className='flex items-center'>
                <input
                  id='isHtml'
                  name='isHtml'
                  type='checkbox'
                  checked={formData.isHtml}
                  onChange={handleChange}
                  className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                />
                <label htmlFor='isHtml' className='block ml-2 text-sm text-gray-900'>
                  HTML 형식으로 작성
                </label>
              </div>

              <div className='flex justify-end space-x-3'>
                <Link
                  to='/notice'
                  className='inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  취소
                </Link>
                <button
                  type='submit'
                  disabled={loading}
                  className='inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  {loading ? '저장 중...' : isEditMode ? '수정하기' : '작성하기'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
