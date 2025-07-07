// src/pages/calendar/CalendarPage.jsx
import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from 'date-fns';
import { Link } from 'react-router-dom';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([]);

  // 카테고리 옵션
  const categoryOptions = [
    { id: 'company', name: '회사 일정', color: '#4F46E5' },
    { id: 'dev', name: '개발팀', color: '#059669' },
    { id: 'marketing', name: '마케팅팀', color: '#DC2626' },
    { id: 'hr', name: '인사팀', color: '#D97706' },
    { id: 'personal', name: '내 일정', color: '#7C3AED' },
  ];

  // Firestore에서 일정 불러오기
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const eventsFromDB = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          // 카테고리별 색상 할당
          const color = categoryOptions.find((c) => c.id === data.category)?.color || '#4F46E5';
          return {
            id: doc.id,
            ...data,
            start:
              data.start && data.start.seconds ? new Date(data.start.seconds * 1000) : new Date(),
            end: data.end && data.end.seconds ? new Date(data.end.seconds * 1000) : new Date(),
            color,
          };
        });
        setEvents(eventsFromDB);
      } catch (e) {
        alert('일정 불러오기 실패: ' + e.message);
      }
    };
    fetchEvents();
  }, []);

  // 카테고리 변경 핸들러
  const handleCategoryChange = (categories) => {
    setSelectedCategories(categories.map((cat) => cat.id));
  };

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 캘린더 헤더 (요일)
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 캘린더 그리드 생성
  const renderCalendarCells = () => {
    // monthStart : 현재 날짜를 기준으로 해당 월의 첫번째 날을 계산한 결과
    // monthEnd : 월의 시작날짜를 기준으로 해당월의 마지막 날을 계산.
    // start : 월의 시작날짜를 기준으로 해당주의 첫번째날(주 시작일)을 계산
    //  -> monthStart가 2023년 10월 1일이라 가정해보면
    //     startDate도 동일하게 2023년 10월 1일로 설정.
    //     만약 주 시작일이 월요일로 설정되어 있다면 그 이전주 월요일이 될수 있음(2023/9/25)

    // end : 월의 마지막 날짜를 기준으로 해당주의 마지막날(주 종료일)을 계산
    //  -> monthend가 2023년 10월 31일 이라면 endDate는 그 주의 마지막인 11월 4일이됨.
    //     주 종료일이 일요일로 설정되어있으면 2023/11/5일로 설정
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      // enddate까지 반복하는 반복.
      for (let i = 0; i < 7; i++) {
        // 한 주를 생성하기 위한 반복문
        // 해당 날짜의 이벤트 찾기 (선택된 카테고리만)
        // 이벤트(일정이 있는 날짜들을 조회.)
        const dayEvents = events.filter(
          (event) =>
            isSameDay(day, event.start) &&
            // 선택된 카테고리가 없거나 현재 이벤트의 카테고리가 선택된 카테고리에 속해있으면
            // 이벤트 필터링을 처리함.
            (selectedCategories.length === 0 || selectedCategories.includes(event.category))
        );

        // 날짜 셀 스타일 결정
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border border-gray-200 ${
              !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
            } ${isToday ? 'bg-indigo-50' : ''}`}
          >
            <div className='flex justify-between items-start'>
              <span
                className={`inline-flex items-center justify-center w-6 h-6 ${
                  isToday
                    ? 'bg-indigo-600 text-white rounded-full'
                    : day.getDay() === 0
                      ? 'text-red-500'
                      : day.getDay() === 6
                        ? 'text-blue-500'
                        : ''
                }`}
              >
                {format(day, 'd')}
              </span>

              <Link
                to={`/calendar/day/${format(day, 'yyyy-MM-dd')}`}
                className='text-xs text-gray-500 hover:text-indigo-600'
              >
                +
              </Link>
            </div>

            <div className='mt-1 space-y-1 overflow-y-auto max-h-[80px]'>
              {dayEvents.map((event) => (
                <Link key={event.id} to={`/calendar/${event.id}`} className='block'>
                  <div
                    className='text-xs p-1 rounded truncate'
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                    }}
                  >
                    {format(event.start, 'HH:mm')} {event.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className='grid grid-cols-7'>
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  // 초기 카테고리 설정
  useEffect(() => {
    // 모든 카테고리 ID 가져오기
    const allCategories = ['company', 'dev', 'marketing', 'hr', 'personal'];
    setSelectedCategories(allCategories);
  }, []);

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>일정 관리</h1>
        <Link
          to='/calendar/new'
          className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100'
        >
          일정 추가
        </Link>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        {/* 사이드바 - 캘린더 카테고리 */}
        <div className='w-full md:w-64 flex-shrink-0'>
          <CalendarCategories onCategoryChange={handleCategoryChange} />

          {/* 미니 캘린더 또는 다른 사이드바 컴포넌트를 여기에 추가할 수 있습니다 */}
        </div>

        {/* 메인 캘린더 */}
        <div className='flex-1'>
          <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
            <div className='p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100'>
              <div className='flex items-center gap-2'>
                <button
                  onClick={prevMonth}
                  className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                >
                  &lt;
                </button>
                <h2 className='text-xl font-semibold text-gray-800'>
                  {format(currentDate, 'yyyy년 M월')}
                </h2>
                <button
                  onClick={nextMonth}
                  className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                >
                  &gt;
                </button>
              </div>

              <button
                onClick={goToToday}
                className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                오늘
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className='grid grid-cols-7 bg-gray-50'>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`py-2 text-center text-sm font-medium ${
                    index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 */}
            <div className='bg-white'>{renderCalendarCells()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
