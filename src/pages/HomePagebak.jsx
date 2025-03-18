import { Link } from "react-router-dom";

export default function HomePage() {
  let greeting = "안녕하세요.";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/*
        tailwind css의 기본 중단점 체계
        sm: 640px 이상
        md: 768px 이상
        lg: 1024px 이상
        xl: 1280px 이상
        2xl: 1536px 이상

        색상의 명도나 강도 지정(명도 숫자 스케일)
         낮은숫자는 더 밝은 색조
         높은 숫자는 더 어둡고 진한 색조
         500이 기본값.(중간값)
        가장 밝은값이 50
        매우 밝은값이 100
        그후 100단위로 조정
        900이 가장 어두운색상.

        */}
      {/* min-h-screen : 최소 높이를 화면 전체 높이(100vh)로 설정
          bg-gradient-to-br : 왼쪽 상단에서 오른쪽 하단으로 그라데이션 적용
          from-gray-50 to-gray-100 : 밝은 회색에서 약간더 진한 회색으로
            그라데이션 색상 지정.
      */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        {/*bg-gradient-to-r : 좌 -> 우로 그라데이션 적용
        from-indigo-600 to-purple-600 : 인디고 색상에서 보라색으로 그라데이션 설정
        text-white : 텍스트 색상 흰색 설정.
     */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/*
    max-w-7xl : 최대 너비를 7xl 크기로 제한(1280px)
    mx-auto : 좌우 마진 auto
    py-12: 상하 패딩은 12(3rem, 48px)
    px-4 : 좌우 패딩은 4(16px 1rem)
    sm:px-6 : 반응형 좌우 패딩 설정 (기본 16px 소형화면의 경우는 24px, 대형화면은 32px)
    소형화면(sm)의 기준은 넓이가 640px 이상인 경우.
    대형화면은 1024px 이상을 기준으로함.
    */}

          {/* md: 중간크기 이상 화면. 넓이가 768px 이상인 경우<div className=""></div>
        md:flex : 중간크기 이상화면에서 플렉서블 박스 디스플레이 적용
        md:items-center : flex 아이템들을 수직 중앙에 정렬. (align-items : center)
        md:justify-between: 아이템들 사이에 공간을 최대화 하여 분배.(justify-content : space-between)
     */}
          <div className="md:flex md:items-center md:justify-between">
            {/* 중간 크기 이상의 화면에서 너비를 50%로 설정.*/}
            <div className="md:w-1/2">
              {/* 
            text-3xl : 기본 텍스트 크기를 3xl로 설정(1.875 rem)
            font-extrabold : 매우 굵은 폰트 가중치 적용
            tracking-tight : 글자 간격을 좁게 설정.
            sm:text-4xl : 소형화면 이상에서 텍스트 크기를 4xl 이상 키움(2.25rem)
            text-indigo-200 : 인디고색상 색조 200을 텍스트에 적용.
            */}
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {greeting}, <span className="text-indigo-200">홍길동</span>님!
              </h1>
              {/*
              mt-3 : 상단(탑) 마진 3으로 설정. (0.75rem)
              max-w-3xl : 최대 너비를 3xl로 제한(48rem)
              */}
              <p className="mt-3 text-lg text-indigo-200 max-w-3xl">
                오늘도 생산적인 하루 되세요. 당신의 작업 현황과 일정을 한눈에
                확인하세요.
              </p>
              {/*
              space-x-4 : 자식 요소들 사이에 가로 간격을 적용.
              rounded-lg : 큰 모서리 둥글기 적용
              font-medium : 중간굵기 폰트 적용
              shadow-md hover:shadow-lg transition-all duration-300
               -> 중간 크기의 그림자를 적용하고 hover시 더 큰 그림자로 부드럽게 전환
              */}
              <div className="mt-8 flex space-x-4">
                <button className="bg-white text-indigo-600 px-5 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  작업 시작하기
                </button>
                <button className="bg-indigo-700 text-white px-5 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                  일정 확인하기
                </button>
              </div>
            </div>
            {/* hidden md:block : 기본적으로는 숨겨져 있으며 중간 크기 이상의 화면에서만 표시
                 -> 중간 크기 이상에서는 아래의 속성들을 표시해달라
                 md:w-1/2 mt-8 md:mt-0 중간 크기 이상의 화면에서 너비 50%설정 
                -> 기본적으로는 상단마진이 8이지만 중간크기 이상에서는 마진을 제거
                
                w-full : 부모컨테이너 전체 너비 차지
                h-64 : 높이를 64로 고정
                object-cover object-center : 이미지 비율을 유지하면서 컨테이너를 채우고 중앙에 위치.
                shadow-xl : 매우 큰 그림자 효과 적용
                */}
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
      {/* 메인영역 
      max-w-7xl  : 최대너비 1280px로 제한
      
      */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 통계 카드
         grid : 그리드 레이아웃 적용
         grid-cols-1 : 기본적으로 한 열로 카드를 배치.(모바일 화면)
         gap-5 : 그리드 아이템 사이에 5의 간격을 적용
         sm:grid-cols-2 : 소형화면 이상에서는 2열로 배치
         lg:grid-cols-4 : 대형 화면이상 에서는 4열로 배치
        */}
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
                    {/* truncate : 텍스트가 너무 길경우에는 말 줄임표(...)로 처리
                    flex items-baseline : 값과 변화량을 수평으로 배치후 텍스트 기준선에 맞춰서 정렬
                    text-2xl font-semibold text-gray-900
                     -> 값에 큰 크기, 굵은폰트, 진한회색 적용.
                    */}
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
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 공지사항
          gap-6 : 그리드 아이템 사이에 24px의 간격 적용
          lg:grid-cols-3 : 대형 화면에서는 세 열로 컨텐츠
          
          */}
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
      </div>{" "}
      {/* 메인영역 종료 */}
    </div>
  );
}
