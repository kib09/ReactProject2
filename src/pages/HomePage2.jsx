// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {
  // 가상 데이터 - 실제로는 API에서 가져올 데이터
  const announcements = [
    {
      id: 1,
      title: "2023년 4분기 회사 목표 안내",
      date: "2023-10-15",
      author: "김경영",
      department: "경영지원팀",
    },
    {
      id: 2,
      title: "신규 프로젝트 킥오프 미팅 일정 공지",
      date: "2023-10-12",
      author: "박개발",
      department: "개발팀",
    },
    {
      id: 3,
      title: "사내 네트워크 점검 안내 (10/20)",
      date: "2023-10-10",
      author: "이인프라",
      department: "IT인프라팀",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "디자인 시스템 구축",
      dueDate: "2023-10-25",
      priority: "high",
      status: "in-progress",
    },
    {
      id: 2,
      title: "사용자 피드백 분석",
      dueDate: "2023-10-30",
      priority: "medium",
      status: "todo",
    },
    {
      id: 3,
      title: "스프린트 회고 문서화",
      dueDate: "2023-10-20",
      priority: "low",
      status: "completed",
    },
    {
      id: 4,
      title: "신규 기능 테스트",
      dueDate: "2023-10-28",
      priority: "high",
      status: "todo",
    },
  ];

  const events = [
    {
      id: 1,
      title: "팀 미팅",
      date: "2023-10-16 14:00",
      location: "회의실 A",
    },
    {
      id: 2,
      title: "프로젝트 리뷰",
      date: "2023-10-18 10:30",
      location: "회의실 B",
    },
    {
      id: 3,
      title: "클라이언트 미팅",
      date: "2023-10-20 15:00",
      location: "화상회의",
    },
  ];

  const stats = [
    { name: "완료한 작업", value: "24", change: "+4", changeType: "increase" },
    {
      name: "진행 중인 작업",
      value: "12",
      change: "-2",
      changeType: "decrease",
    },
    { name: "예정된 미팅", value: "8", change: "+1", changeType: "increase" },
    { name: "새로운 알림", value: "16", change: "+3", changeType: "increase" },
  ];

  const quickAccess = [
    { name: "게시판", color: "bg-blue-500", path: "/notice" },
    { name: "일정관리", color: "bg-green-500", path: "/calendar" },
    { name: "메시지", color: "bg-purple-500", path: "/messages" },
    { name: "업무관리", color: "bg-yellow-500", path: "/tasks" },
    { name: "전자결재", color: "bg-red-500", path: "/approval" },
    { name: "주소록", color: "bg-indigo-500", path: "/contacts" },
  ];

  // 현재 시간 계산
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 헤더 영역 - 웰컴 배너 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {greeting}, <span className="text-indigo-200">홍길동</span>님!
              </h1>
              <p className="mt-3 text-lg text-indigo-200 max-w-3xl">
                오늘도 생산적인 하루 되세요. 당신의 작업 현황과 일정을 한눈에
                확인하세요.
              </p>
              <div className="mt-8 flex space-x-4">
                <button className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  작업 시작하기
                </button>
                <button className="bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  일정 확인하기
                </button>
              </div>
            </div>
            <div className="hidden md:block md:w-1/2 mt-8 md:mt-0">
              <img
                src="https://cdn.pixabay.com/photo/2017/10/24/07/12/hacker-2883632_1280.jpg"
                alt="Dashboard Illustration"
                className="w-full h-64 object-cover object-center rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-md p-3 bg-indigo-50">
                  <span className="text-indigo-600 font-bold text-xl">
                    {stat.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-5 w-0 flex-1">
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
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 공지사항 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">공지사항</h2>
              <Link
                to="/notice"
                className="text-blue-100 hover:text-white text-sm font-medium"
              >
                모두 보기 →
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <Link
                    to={`/notice/${announcement.id}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {announcement.title}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <span>{announcement.department}</span>
                            <span className="mx-1">•</span>
                            <span>{announcement.author}</span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
                          {announcement.date}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="bg-gray-50 px-6 py-3">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                공지사항 작성
              </button>
            </div>
          </div>

          {/* 작업 목록 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">내 작업</h2>
              <Link
                to="/tasks"
                className="text-purple-100 hover:text-white text-sm font-medium"
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
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
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
                      <div className="ml-2 flex-shrink-0 flex">
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
                    <div className="mt-1 flex justify-between items-center">
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
            <div className="bg-gray-50 px-6 py-3">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                작업 추가
              </button>
            </div>
          </div>

          {/* 일정 */}
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl">
            <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">다가오는 일정</h2>
              <Link
                to="/calendar"
                className="text-green-100 hover:text-white text-sm font-medium"
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
                      <div className="ml-2 flex-shrink-0">
                        <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-lg px-3 py-1">
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
            <div className="bg-gray-50 px-6 py-3">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                일정 추가
              </button>
            </div>
          </div>
        </div>

        {/* 빠른 액세스 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">빠른 액세스</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickAccess.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
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

        {/* 최근 활동 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-700 to-gray-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">최근 활동</h2>
            <button className="text-gray-300 hover:text-white text-sm font-medium">
              모두 보기 →
            </button>
          </div>
          <div className="p-6">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-0.5 h-full bg-gray-200 mx-auto"></div>
              </div>
              <ul className="relative space-y-8">
                {[
                  {
                    time: "1시간 전",
                    action: "새 댓글 작성",
                    target: "디자인 시스템 개선 제안",
                    user: "김디자인",
                  },
                  {
                    time: "3시간 전",
                    action: "문서 업데이트",
                    target: "프로젝트 기획안",
                    user: "박기획",
                  },
                  {
                    time: "어제",
                    action: "작업 완료",
                    target: "로그인 페이지 리뉴얼",
                    user: "이개발",
                  },
                  {
                    time: "2일 전",
                    action: "새 프로젝트 시작",
                    target: "모바일 앱 개발",
                    user: "최매니저",
                  },
                ].map((activity, index) => (
                  <li key={index} className="relative">
                    <div className="relative flex items-start space-x-3">
                      <div>
                        <div className="relative px-1">
                          <div className="h-8 w-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center ring-8 ring-white">
                            <span className="text-white font-medium text-sm">
                              {activity.user.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 py-1.5">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium text-gray-900">
                            {activity.user}
                          </span>
                          님이
                          <span className="font-medium text-indigo-600">
                            {" "}
                            {activity.action}
                          </span>
                          :
                          <span className="font-medium text-gray-900">
                            {" "}
                            {activity.target}
                          </span>
                          <span className="whitespace-nowrap text-xs">
                            {" "}
                            {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 팀 멤버 */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">팀 멤버</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                name: "김팀장",
                role: "팀장",
                status: "online",
                color: "bg-green-500",
              },
              {
                name: "이개발",
                role: "개발자",
                status: "online",
                color: "bg-blue-500",
              },
              {
                name: "박디자인",
                role: "디자이너",
                status: "offline",
                color: "bg-purple-500",
              },
              {
                name: "최기획",
                role: "기획자",
                status: "online",
                color: "bg-yellow-500",
              },
              {
                name: "정마케팅",
                role: "마케팅",
                status: "busy",
                color: "bg-red-500",
              },
              {
                name: "한인사",
                role: "인사담당",
                status: "offline",
                color: "bg-indigo-500",
              },
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col items-center hover:shadow-lg transition-all duration-300"
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 ${member.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-2`}
                  >
                    {member.name.charAt(0)}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      member.status === "online"
                        ? "bg-green-500"
                        : member.status === "busy"
                        ? "bg-red-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <h3 className="font-medium text-gray-900">{member.name}</h3>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 리소스 및 도구 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-amber-500 to-amber-600">
              <h2 className="text-xl font-bold text-white">리소스 센터</h2>
              <p className="mt-1 text-amber-100 text-sm">
                업무에 필요한 문서와 자료를 찾아보세요
              </p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { name: "회사 규정집", count: "23개 문서" },
                { name: "디자인 가이드", count: "15개 문서" },
                { name: "개발 문서", count: "42개 문서" },
                { name: "마케팅 자료", count: "18개 문서" },
              ].map((resource, index) => (
                <div
                  key={index}
                  className="p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-amber-800">
                    {resource.name}
                  </h3>
                  <p className="text-xs text-amber-600 mt-1">
                    {resource.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-cyan-500 to-cyan-600">
              <h2 className="text-xl font-bold text-white">도구 및 앱</h2>
              <p className="mt-1 text-cyan-100 text-sm">
                업무 생산성을 높이는 도구들
              </p>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { name: "화상 회의", desc: "팀 미팅 진행하기" },
                { name: "일정 관리", desc: "캘린더 및 알림" },
                { name: "문서 협업", desc: "실시간 문서 편집" },
                { name: "업무 자동화", desc: "반복 작업 자동화" },
              ].map((tool, index) => (
                <div
                  key={index}
                  className="p-4 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-cyan-800">{tool.name}</h3>
                  <p className="text-xs text-cyan-600 mt-1">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
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
            <p className="mt-8 text-center md:mt-0 md:text-right text-sm text-gray-400">
              &copy; 2023 그룹웨어 시스템. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
