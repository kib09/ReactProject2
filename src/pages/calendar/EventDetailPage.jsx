// src/pages/calendar/EventDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function EventDetailPage() {
  const { id } = useParams(); //
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchEvent = async () => {
      try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEvent({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('일정을 찾을 수 없습니다.');
        }
      } catch {
        setError('일정 정보를 불러오는 데 실패했습니다.');
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  // 삭제 핸들러
  const handleDelete = () => {
    if (window.confirm('이 일정을 삭제하시겠습니까?')) {
      // 삭제 로직 (나중에 Firebase 연동)
      alert('일정이 삭제되었습니다.');
      navigate('/calendar');
    }
  };

  // 카테고리 이름 매핑
  const getCategoryName = (categoryId) => {
    const categories = {
      company: '회사 일정',
      dev: '개발팀',
      marketing: '마케팅팀',
      hr: '인사팀',
      personal: '내 일정',
    };

    return categories[categoryId] || categoryId;
  };

  if (loading) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8'>
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
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold text-gray-800'>오류가 발생했습니다</h2>
          <p className='mt-2 text-gray-600'>{error}</p>
          <Link
            to='/calendar'
            className='mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
          >
            캘린더로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (event) {
    function toDate(val) {
      if (!val) return null;
      if (val instanceof Date) return val;
      if (val.toDate) return val.toDate(); // Firestore Timestamp
      return new Date(val);
    }
    var startDate = toDate(event.start);
    var endDate = toDate(event.end);
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      {event && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
          {/* 일정 헤더 */}
          <div className='p-6' style={{ backgroundColor: `${event.color}10` }}>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-4 h-4 rounded-full' style={{ backgroundColor: event.color }}></div>
              <h1 className='text-2xl font-bold text-gray-900'>{event.title}</h1>
            </div>

            <div className='space-y-2 text-sm text-gray-700'>
              <div className='flex items-start'>
                <span className='w-20 font-medium'>일정:</span>
                <span>
                  {startDate && format(startDate, 'yyyy년 M월 d일 (eee) HH:mm')} -
                  {startDate && endDate && startDate.toDateString() === endDate.toDateString()
                    ? format(endDate, ' HH:mm')
                    : endDate && format(endDate, ' yyyy년 M월 d일 (eee) HH:mm')}
                </span>
              </div>

              <div className='flex items-start'>
                <span className='w-20 font-medium'>캘린더:</span>
                <span>{getCategoryName(event.category)}</span>
              </div>

              {event.location && (
                <div className='flex items-start'>
                  <span className='w-20 font-medium'>장소:</span>
                  <span>{event.location}</span>
                </div>
              )}

              {event.reminder && (
                <div className='flex items-start'>
                  <span className='w-20 font-medium'>알림:</span>
                  <span>{event.reminder}</span>
                </div>
              )}

              {event.isRecurring && (
                <div className='flex items-start'>
                  <span className='w-20 font-medium'>반복:</span>
                  <span>매주</span>
                </div>
              )}

              {event.isPrivate && (
                <div className='flex items-start'>
                  <span className='w-20 font-medium'>공개 여부:</span>
                  <span>비공개</span>
                </div>
              )}
            </div>
          </div>

          {/* 일정 내용 */}
          <div className='p-6 border-t border-gray-100'>
            {event.description && (
              <div className='mb-6'>
                <h2 className='text-lg font-semibold text-gray-800 mb-2'>설명</h2>
                <p className='text-gray-700 whitespace-pre-line'>{event.description}</p>
              </div>
            )}

            {/* 참석자 목록 */}
            {event.attendees && event.attendees.length > 0 && (
              <div>
                <h2 className='text-lg font-semibold text-gray-800 mb-2'>참석자</h2>
                <div className='flex flex-wrap gap-2'>
                  {event.attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'
                    >
                      {attendee}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 하단 액션 버튼 */}
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center'>
            <Link to='/calendar' className='text-gray-600 hover:text-gray-900'>
              캘린더로 돌아가기
            </Link>

            <div className='flex gap-2'>
              <Link
                to={`/calendar/edit/${event.id}`}
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
