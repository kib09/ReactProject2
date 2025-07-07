// src/pages/calendar/DayViewPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format, parse } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function DayViewPage() {
  const { date } = useParams(); // 형식: YYYY-MM-DD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // URL 파라미터에서 날짜 파싱
  useEffect(() => {
    if (date) {
      try {
        // YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
        const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
        setSelectedDate(parsedDate);
      } catch (error) {
        console.error('날짜 파싱 오류:', error);
        setSelectedDate(new Date()); // 오류 시 오늘 날짜로 설정
      }
    } else {
      setSelectedDate(new Date());
    }
  }, [date]);

  // Firestore에서 해당 날짜의 일정 데이터 로드
  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsFromDB = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            start:
              data.start && data.start.seconds ? new Date(data.start.seconds * 1000) : new Date(),
            end: data.end && data.end.seconds ? new Date(data.end.seconds * 1000) : new Date(),
          };
        });
        // 선택한 날짜와 동일한 일정만 필터링
        const filteredEvents = eventsFromDB.filter(
          (event) =>
            event.start.getFullYear() === selectedDate.getFullYear() &&
            event.start.getMonth() === selectedDate.getMonth() &&
            event.start.getDate() === selectedDate.getDate()
        );
        // 시간순 정렬
        filteredEvents.sort((a, b) => a.start - b.start);
        setEvents(filteredEvents);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        alert('일정 불러오기 실패: ' + e.message);
      }
    };
    fetchEvents();
  }, [selectedDate]);

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

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>일정 목록</h1>
          {selectedDate && (
            <p className='text-gray-600 mt-1'>{format(selectedDate, 'yyyy년 M월 d일 (eee)')}</p>
          )}
        </div>

        <div className='flex gap-2'>
          <Link
            to='/calendar'
            className='px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors'
          >
            캘린더로 돌아가기
          </Link>
          <Link
            to={`/calendar/new?date=${date}`}
            className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100'
          >
            일정 추가
          </Link>
        </div>
      </div>

      <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
        {loading ? (
          // 로딩 상태
          <div className='p-6'>
            <div className='animate-pulse space-y-4'>
              {[1, 2, 3].map((_, index) => (
                <div key={index} className='flex gap-4'>
                  <div className='w-16 h-16 bg-gray-200 rounded'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          // 일정 없음
          <div className='p-12 text-center'>
            <p className='text-gray-500 mb-4'>이 날짜에 예정된 일정이 없습니다.</p>
            <Link
              to={`/calendar/new?date=${date}`}
              className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 inline-block'
            >
              일정 추가하기
            </Link>
          </div>
        ) : (
          // 일정 목록
          <div className='divide-y divide-gray-100'>
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/calendar/${event.id}`}
                className='block hover:bg-gray-50 transition-colors'
              >
                <div className='p-6 flex gap-4'>
                  <div
                    className='flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center'
                    style={{
                      backgroundColor: `${event.color}10`,
                      color: event.color,
                    }}
                  >
                    <span className='text-sm font-medium'>{format(event.start, 'HH:mm')}</span>
                    <span className='text-xs'>{format(event.end, 'HH:mm')}</span>
                  </div>

                  <div className='flex-1'>
                    <h3 className='font-medium text-gray-900'>{event.title}</h3>
                    <div className='flex items-center gap-2 mt-1'>
                      <span className='text-xs text-gray-500'>
                        {getCategoryName(event.category)}
                      </span>
                      {event.location && (
                        <>
                          <span className='text-gray-300'>•</span>
                          <span className='text-xs text-gray-500'>{event.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
