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
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
        <div className='px-6 py-4 border-b border-gray-100'>
          <h1 className='text-xl font-semibold text-gray-800'>
            {isEditMode ? '공지사항 수정' : '새 공지사항 작성'}
          </h1>
        </div>
        {error && (
          <div className='p-4 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700'>
            <p>{error}</p>
          </div>
        )}
        {loading && isEditMode ? (
          <div className='flex justify-center px-4 py-12 sm:px-6'>
            <div className='w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin'></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='p-6'>
            <div className='space-y-6'>
              <div>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
                  제목 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  id='title'
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
                  placeholder='공지사항 제목을 입력하세요'
                />
              </div>
              <div>
                <label
                  htmlFor='department'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  부서
                </label>
                <select
                  id='department'
                  name='department'
                  value={formData.department}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
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
                <label htmlFor='content' className='block text-sm font-medium text-gray-700 mb-2'>
                  내용 <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='content'
                  name='content'
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={5}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
                  placeholder='공지사항 내용을 입력하세요'
                />
              </div>
              <div className='flex justify-end gap-2'>
                <Link
                  to='/notice'
                  className='px-4 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200'
                >
                  목록으로
                </Link>
                <button
                  type='submit'
                  disabled={loading}
                  className='px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100'
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
