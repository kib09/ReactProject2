// src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

export default function HomePage() {
  const { currentUser } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // 임시로 하드코딩된 데이터를 대체할 Firestore 연동 코드
        // 실제 구현 시 이 부분을 Firestore에서 데이터를 가져오는 코드로 변경

        // 사용자 정보 설정
        setUserInfo({
          displayName: currentUser?.displayName || "사용자",
          email: currentUser?.email,
          photoURL: currentUser?.photoURL,
          department: "개발팀", // Firestore에서 추가 정보 로드
          role: "팀원",
          joinDate: "2023-01-15",
        });

        // 공지사항 로드 (현재는 더미 데이터)
        setAnnouncements([
          {
            id: 1,
            title: "2025년 1분기 회사 목표 안내",
            date: "2025-03-10",
            author: "김경영",
            department: "경영지원팀",
          },
          {
            id: 2,
            title: "신규 프로젝트 킥오프 미팅 일정 공지",
            date: "2025-03-12",
            author: "박개발",
            department: "개발팀",
          },
          {
            id: 3,
            title: "사내 네트워크 점검 안내 (3/20)",
            date: "2025-03-11",
            author: "이인프라",
            department: "IT인프라팀",
          },
        ]);

        // 사용자별 작업 로드
        setTasks([
          {
            id: 1,
            title: "디자인 시스템 구축",
            dueDate: "2025-03-25",
            priority: "high",
            status: "in-progress",
          },
          {
            id: 2,
            title: "사용자 피드백 분석",
            dueDate: "2025-03-30",
            priority: "medium",
            status: "todo",
          },
          {
            id: 3,
            title: "스프린트 회고 문서화",
            dueDate: "2025-03-20",
            priority: "low",
            status: "completed",
          },
          {
            id: 4,
            title: "신규 기능 테스트",
            dueDate: "2025-03-28",
            priority: "high",
            status: "todo",
          },
        ]);

        // 사용자 일정 로드
        setEvents([
          {
            id: 1,
            title: "팀 미팅",
            date: "2025-03-16 14:00",
            location: "회의실 A",
          },
          {
            id: 2,
            title: "프로젝트 리뷰",
            date: "2025-03-18 10:30",
            location: "회의실 B",
          },
          {
            id: 3,
            title: "클라이언트 미팅",
            date: "2025-03-20 15:00",
            location: "화상회의",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("데이터 로드 중 오류 발생:", error);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  // 테스크 통계 계산
  const stats = [
    {
      name: "완료한 작업",
      value: tasks
        .filter((task) => task.status === "completed")
        .length.toString(),
      change: "+4",
      changeType: "increase",
    },
    {
      name: "진행 중인 작업",
      value: tasks
        .filter((task) => task.status === "in-progress")
        .length.toString(),
      change: "-2",
      changeType: "decrease",
    },
    {
      name: "예정된 미팅",
      value: events.length.toString(),
      change: "+1",
      changeType: "increase",
    },
    {
      name: "새로운 알림",
      value: "16",
      change: "+3",
      changeType: "increase",
    },
  ];

  const quickAccess = [
    { name: "게시판", color: "bg-blue-500", path: "/notice" },
    { name: "일정관리", color: "bg-green-500", path: "/calendar" },
    { name: "메시지", color: "bg-purple-500", path: "/messages" },
    { name: "업무관리", color: "bg-yellow-500", path: "/tasks" },
    { name: "전자결재", color: "bg-red-500", path: "/approval" },
    { name: "주소록", color: "bg-indigo-500", path: "/contacts" },
  ];

  // 현재 시간 기반 인사말
  const now = new Date();
  const hours = now.getHours();
  let greeting = "안녕하세요";

  if (hours < 12) {
    greeting = "좋은 아침입니다";
  } else if (hours < 17) {
    greeting = "좋은 오후입니다";
  } else {
    greeting = "좋은 저녁입니다";
  }

  // 로딩 중 UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 영역 - 웰컴 배너 */}
      <div className="text-white bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {greeting},{" "}
                <span className="text-indigo-200">{userInfo?.displayName}</span>
                님!
              </h1>
              <p className="max-w-3xl mt-3 text-lg text-indigo-200">
                오늘도 생산적인 하루 되세요. 당신의 작업 현황과 일정을 한눈에
                확인하세요.
              </p>
              <div className="mt-3 text-sm text-indigo-200">
                <span>
                  {userInfo?.department} | {userInfo?.role}
                </span>
              </div>
              <div className="flex mt-8 space-x-4">
                <button className="px-5 py-3 font-medium text-indigo-600 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
                  작업 시작하기
                </button>
                <Link
                  to="/calendar"
                  className="px-5 py-3 font-medium text-white transition-all duration-300 bg-indigo-700 rounded-lg shadow-md hover:shadow-lg"
                >
                  일정 확인하기
                </Link>
              </div>
            </div>
            <div className="hidden mt-8 md:block md:w-1/2 md:mt-0">
              <img
                src={
                  userInfo?.photoURL ||
                  "https://cdn.pixabay.com/photo/2017/10/24/07/12/hacker-2883632_1280.jpg"
                }
                alt="Dashboard Illustration"
                className="object-cover object-center w-full h-64 rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="p-6 overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-md bg-indigo-50">
                  <span className="text-xl font-bold text-indigo-600">
                    {stat.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 w-0 ml-5">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 메인 그리드 */}
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          {/* 공지사항 */}
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-600">
              <h2 className="text-xl font-bold text-white">공지사항</h2>
              <Link
                to="/notice"
                className="text-sm font-medium text-blue-100 hover:text-white"
              >
                모두 보기 →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <Link
                    to={`/notice/${announcement.id}`}
                    className="block transition-colors hover:bg-gray-50"
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {announcement.title}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <span>{announcement.department}</span>
                            <span className="mx-1">•</span>
                            <span>{announcement.author}</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-2 text-xs text-gray-500">
                          {announcement.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-6 py-3 bg-gray-50">
              <Link
                to="/notice/new"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                공지사항 작성
              </Link>
            </div>
          </div>

          {/* 작업 목록 */}
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-purple-600">
              <h2 className="text-xl font-bold text-white">내 작업</h2>
              <Link
                to="/tasks"
                className="text-sm font-medium text-purple-100 hover:text-white"
              >
                모두 보기 →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <li key={task.id}>
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id={`task-${task.id}`}
                          name={`task-${task.id}`}
                          type="checkbox"
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          checked={task.status === "completed"}
                          readOnly
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`ml-3 text-sm ${
                            task.status === "completed"
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </label>
                      </div>
                      <div className="flex flex-shrink-0 ml-2">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority === "high"
                            ? "높음"
                            : task.priority === "medium"
                            ? "중간"
                            : "낮음"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        마감일: {task.dueDate}
                      </span>
                      <span
                        className={`text-xs ${
                          task.status === "completed"
                            ? "text-green-600"
                            : task.status === "in-progress"
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {task.status === "completed"
                          ? "완료됨"
                          : task.status === "in-progress"
                          ? "진행 중"
                          : "예정됨"}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-3 bg-gray-50">
              <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50">
                작업 추가
              </button>
            </div>
          </div>

          {/* 일정 */}
          <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-green-600">
              <h2 className="text-xl font-bold text-white">다가오는 일정</h2>
              <Link
                to="/calendar"
                className="text-sm font-medium text-green-100 hover:text-white"
              >
                캘린더 보기 →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {events.map((event) => (
                <li key={event.id}>
                  <div className="px-6 py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {event.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {event.location}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-2">
                        <div className="flex flex-col items-center justify-center px-3 py-1 rounded-lg bg-indigo-50">
                          <span className="text-xs font-medium text-indigo-800">
                            {event.date.split(" ")[0].split("-")[2]}일
                          </span>
                          <span className="text-xs text-indigo-600">
                            {event.date.split(" ")[1]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-3 bg-gray-50">
              <Link
                to="/calendar/new"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                일정 추가
              </Link>
            </div>
          </div>
        </div>

        {/* 빠른 액세스 */}
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">빠른 액세스</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {quickAccess.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg"
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3`}
                >
                  {item.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:justify-start">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span>회사 소개</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span>이용약관</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span>개인정보처리방침</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span>고객센터</span>
              </a>
            </div>
            <p className="mt-8 text-sm text-center text-gray-400 md:mt-0 md:text-right">
              &copy; 2025 그룹웨어 시스템. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
