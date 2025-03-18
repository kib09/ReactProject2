// src/pages/calendar/DayViewPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format, parse, isValid } from "date-fns";

export default function DayViewPage() {
  const { date } = useParams(); // 형식: YYYY-MM-DD
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  // URL 파라미터에서 날짜 파싱
  useEffect(() => {
    if (date) {
      const parsedDate = parse(date, "yyyy-MM-dd", new Date());

      if (isValid(parsedDate)) {
        setSelectedDate(parsedDate);
      } else {
        console.error("잘못된 날짜 형식:", date);
        setSelectedDate(new Date()); // 기본값: 오늘 날짜
      }
    } else {
      setSelectedDate(new Date());
    }
  }, [date]);

  // 선택한 날짜의 일정 데이터 로드 (임시 데이터)
  useEffect(() => {
    if (!selectedDate) return;

    setLoading(true);

    // 데이터 로딩 시뮬레이션
    setTimeout(() => {
      // 임시 데이터
      const dummyEvents = [
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
          start: new Date(2025, 2, 13, 13, 0), // 2025-03-13 13:00
          end: new Date(2025, 2, 13, 15, 0), // 2025-03-13 15:00
          location: "면접실 2",
          category: "hr",
          color: "#D97706",
        },
        {
          id: "5",
          title: "병원 예약",
          start: new Date(2025, 2, 13, 9, 30), // 2025-03-13 09:30
          end: new Date(2025, 2, 13, 10, 30), // 2025-03-13 10:30
          location: "서울병원",
          category: "personal",
          color: "#7C3AED",
        },
      ];

      // 선택한 날짜와 동일한 일정만 필터링
      const filteredEvents = dummyEvents.filter((event) => {
        return (
          event.start.getDate() === selectedDate.getDate() &&
          event.start.getMonth() === selectedDate.getMonth() &&
          event.start.getFullYear() === selectedDate.getFullYear()
        );
      });

      // 시간순 정렬
      filteredEvents.sort((a, b) => a.start - b.start);

      setEvents(filteredEvents);
      setLoading(false);
    }, 800);
  }, [selectedDate]);

  // 카테고리 이름 매핑
  const getCategoryName = (categoryId) => {
    const categories = {
      company: "회사 일정",
      dev: "개발팀",
      marketing: "마케팅팀",
      hr: "인사팀",
      personal: "내 일정",
    };

    return categories[categoryId] || categoryId;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">일정 목록</h1>
          {selectedDate && (
            <p className="text-gray-600 mt-1">
              {format(selectedDate, "yyyy년 M월 d일 (eee)")}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to="/calendar"
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            캘린더로 돌아가기
          </Link>
          <Link
            to={`/calendar/new?date=${date}`}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100"
          >
            일정 추가
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          // 로딩 상태
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : events.length === 0 ? (
          // 일정 없음
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">
              이 날짜에 예정된 일정이 없습니다.
            </p>
            <Link
              to={`/calendar/new?date=${date}`}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 inline-block"
            >
              일정 추가하기
            </Link>
          </div>
        ) : (
          // 일정 목록
          <div className="divide-y divide-gray-100">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/calendar/${event.id}`}
                className="block hover:bg-gray-50 transition-colors"
              >
                <div className="p-6 flex gap-4">
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-lg flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: `${event.color}10`,
                      color: event.color,
                    }}
                  >
                    <span className="text-sm font-medium">
                      {format(event.start, "HH:mm")}
                    </span>
                    <span className="text-xs">
                      {format(event.end, "HH:mm")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {getCategoryName(event.category)}
                      </span>
                      {event.location && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            {event.location}
                          </span>
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
