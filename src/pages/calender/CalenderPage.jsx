// src/pages/calendar/CalendarPage.jsx
import { useState, useEffect } from "react";
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
} from "date-fns";
import { Link } from "react-router-dom";
import CalendarCategories from "../../components/calendar/CalendarCategories";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "팀 미팅",
      start: new Date(2025, 2, 15, 14, 0), // 2025-03-15 14:00
      end: new Date(2025, 2, 15, 15, 30), // 2025-03-15 15:30
      location: "회의실 A",
      category: "dev",
      color: "#059669",
    },
    {
      id: "2",
      title: "프로젝트 킥오프",
      start: new Date(2025, 2, 18, 10, 0), // 2025-03-18 10:00
      end: new Date(2025, 2, 18, 12, 0), // 2025-03-18 12:00
      location: "대회의실",
      category: "company",
      color: "#4F46E5",
    },
    {
      id: "3",
      title: "클라이언트 미팅",
      start: new Date(2025, 2, 20, 15, 0), // 2025-03-20 15:00
      end: new Date(2025, 2, 20, 16, 0), // 2025-03-20 16:00
      location: "화상회의",
      category: "marketing",
      color: "#DC2626",
    },
    {
      id: "4",
      title: "채용 면접",
      start: new Date(2025, 2, 22, 13, 0), // 2025-03-22 13:00
      end: new Date(2025, 2, 22, 15, 0), // 2025-03-22 15:00
      location: "면접실 2",
      category: "hr",
      color: "#D97706",
    },
    {
      id: "5",
      title: "병원 예약",
      start: new Date(2025, 2, 25, 9, 30), // 2025-03-25 09:30
      end: new Date(2025, 2, 25, 10, 30), // 2025-03-25 10:30
      location: "서울병원",
      category: "personal",
      color: "#7C3AED",
    },
  ]);

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
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  // 캘린더 그리드 생성
  const renderCalendarCells = () => {
    //monthStart : 현재 날짜를 기준으로 해당월의 첫번째 날을 계산한 결과
    //monthEnd : 현재 날짜를 기준으로 해당월의 마지막 날을 계산
    // Start : 월의 시작 날짜를 기준으로 해당 주의 첫번째 날 (주 시작일)을 계산
    // -> monthStart가 2023 10월 1일이라 가정해보면
    //    startDate도 동일하게 2023 10월 1일로 설정
    //    만약 주 시작일이 월요일로 설정 되어 있다면 그 이전주 월요일이 될 수 있음
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        // 해당 날짜의 이벤트 찾기 (선택된 카테고리만)
        const dayEvents = events.filter(
          (event) =>
            isSameDay(day, event.start) &&
            (selectedCategories.length === 0 ||
              selectedCategories.includes(event.category))
        );

        // 날짜 셀 스타일 결정
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border border-gray-200 ${
              !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
            } ${isToday ? "bg-indigo-50" : ""}`}
          >
            <div className="flex justify-between items-start">
              <span
                className={`inline-flex items-center justify-center w-6 h-6 ${
                  isToday
                    ? "bg-indigo-600 text-white rounded-full"
                    : day.getDay() === 0
                    ? "text-red-500"
                    : day.getDay() === 6
                    ? "text-blue-500"
                    : ""
                }`}
              >
                {format(day, "d")}
              </span>

              <Link
                to={`/calendar/day/${format(day, "yyyy-MM-dd")}`}
                className="text-xs text-gray-500 hover:text-indigo-600"
              >
                +
              </Link>
            </div>

            <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
              {dayEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/calendar/${event.id}`}
                  className="block"
                >
                  <div
                    className="text-xs p-1 rounded truncate"
                    style={{
                      backgroundColor: `${event.color}20`,
                      color: event.color,
                    }}
                  >
                    {format(event.start, "HH:mm")} {event.title}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
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
    const allCategories = ["company", "dev", "marketing", "hr", "personal"];
    setSelectedCategories(allCategories);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">일정 관리</h1>
        <Link
          to="/calendar/new"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100"
        >
          일정 추가
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 사이드바 - 캘린더 카테고리 */}
        <div className="w-full md:w-64 flex-shrink-0">
          <CalendarCategories onCategoryChange={handleCategoryChange} />

          {/* 미니 캘린더 또는 다른 사이드바 컴포넌트를 여기에 추가할 수 있습니다 */}
        </div>

        {/* 메인 캘린더 */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="p-4 flex justify-between items-center bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  &lt;
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {format(currentDate, "yyyy년 M월")}
                </h2>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  &gt;
                </button>
              </div>

              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                오늘
              </button>
            </div>

            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 bg-gray-50">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`py-2 text-center text-sm font-medium ${
                    index === 0
                      ? "text-red-500"
                      : index === 6
                      ? "text-blue-500"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 캘린더 그리드 */}
            <div className="bg-white">{renderCalendarCells()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
