// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import TasksWidget from '../components/TasksWidget';
import EventsWidget from '../components/EventsWidget';
import { startOfDay, endOfDay } from 'date-fns';
import AnnouncementsWidget from '../components/AnnouncementsWidget';

export default function HomePage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchTasks = async () => {
      const q = query(collection(db, 'tasks'), orderBy('dueDate', 'asc'), limit(5));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };
    const fetchEvents = async () => {
      const todayStart = startOfDay(new Date());
      const todayEnd = endOfDay(new Date());
      const q = query(
        collection(db, 'events'),
        where('start', '>=', todayStart),
        where('start', '<=', todayEnd),
        orderBy('start', 'asc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };
    const fetchAnnouncements = async () => {
      const q = query(collection(db, 'announcements'), orderBy('date', 'desc'), limit(5));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };
    const fetchUserData = async () => {
      setLoading(true);
      try {
        setUserInfo({
          displayName: currentUser?.displayName || '사용자',
          email: currentUser?.email,
          photoURL: currentUser?.photoURL,
          department: '개발팀', // Firestore에서 추가 정보 로드 가능
          role: '팀원',
          joinDate: '2023-01-15',
        });
        // Firestore에서 데이터 불러오기
        const t = await fetchTasks();
        setTasks(t);
        const ev = await fetchEvents();
        setEvents(ev);
        const ann = await fetchAnnouncements();
        setAnnouncements(ann);
        setLoading(false);
      } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
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
      name: '완료한 작업',
      value: tasks.filter((task) => task.status === 'completed').length.toString(),
      change: '+4',
      changeType: 'increase',
    },
    {
      name: '진행 중인 작업',
      value: tasks.filter((task) => task.status === 'in-progress').length.toString(),
      change: '-2',
      changeType: 'decrease',
    },
    {
      name: '예정된 미팅',
      value: events.length.toString(),
      change: '+1',
      changeType: 'increase',
    },
    {
      name: '새로운 알림',
      value: '16',
      change: '+3',
      changeType: 'increase',
    },
  ];

  const quickAccess = [
    { name: '공지사항', color: 'bg-blue-500', path: '/notice' },
    { name: '작업관리', color: 'bg-purple-500', path: '/tasks' },
    { name: '일정관리', color: 'bg-green-500', path: '/calendar' },
    { name: '메시지', color: 'bg-yellow-500', path: '/messages' },
    { name: '전자결재', color: 'bg-red-500', path: '/approval' },
    { name: '주소록', color: 'bg-indigo-500', path: '/contacts' },
  ];

  // 현재 시간 기반 인사말
  const now = new Date();
  const hours = now.getHours();
  let greeting = '안녕하세요';

  if (hours < 12) {
    greeting = '좋은 아침입니다';
  } else if (hours < 17) {
    greeting = '좋은 오후입니다';
  } else {
    greeting = '좋은 저녁입니다';
  }

  // 로딩 중 UI
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='w-16 h-16 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* 헤더 영역 - 웰컴 배너 */}
      <div className='text-white bg-gradient-to-r from-indigo-600 to-purple-600'>
        <div className='px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='md:flex md:items-center md:justify-between'>
            <div className='md:w-1/2'>
              <h1 className='text-3xl font-extrabold tracking-tight sm:text-4xl'>
                {greeting}, <span className='text-indigo-200'>{userInfo?.displayName}</span>
                님!
              </h1>
              {/* 오늘의 문구  */}
              <p className='max-w-3xl mt-3 text-lg text-indigo-200'>
                오늘도 생산적인 하루 되세요. 당신의 작업 현황과 일정을 한눈에 확인하세요.
              </p>
              <div className='mt-3 text-sm text-indigo-200'>
                <span>
                  {userInfo?.department} | {userInfo?.role}
                </span>
              </div>
              <div className='flex mt-8 space-x-4'>
                <button className='px-5 py-3 font-medium text-indigo-600 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg'>
                  작업 시작하기
                </button>
                <Link
                  to='/calendar'
                  className='px-5 py-3 font-medium text-white transition-all duration-300 bg-indigo-700 rounded-lg shadow-md hover:shadow-lg'
                >
                  일정 확인하기
                </Link>
              </div>
            </div>
            <div className='hidden mt-8 md:block md:w-1/2 md:mt-0'>
              <img
                src={
                  userInfo?.photoURL ||
                  'https://cdn.pixabay.com/photo/2017/10/24/07/12/hacker-2883632_1280.jpg'
                }
                alt='Dashboard Illustration'
                className='object-cover object-center w-full h-64 rounded-lg shadow-xl'
              />
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        {/* 통계 카드 */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat) => (
            <div
              key={stat.name}
              className='p-6 overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl'
            >
              <div className='flex items-center'>
                <div className='flex-shrink-0 p-3 rounded-md bg-indigo-50'>
                  <span className='text-xl font-bold text-indigo-600'>{stat.name.charAt(0)}</span>
                </div>
                <div className='flex-1 w-0 ml-5'>
                  <dl>
                    <dt className='text-sm font-medium text-gray-500 truncate'>{stat.name}</dt>
                    <dd>
                      <div className='flex items-baseline'>
                        <div className='text-2xl font-semibold text-gray-900'>{stat.value}</div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
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
        <div className='grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3'>
          <AnnouncementsWidget announcements={announcements} />
          <TasksWidget />
          <EventsWidget events={events} userId={currentUser?.uid} />
        </div>

        {/* 빠른 액세스 */}
        <div className='mt-8'>
          <h2 className='mb-4 text-xl font-bold text-gray-900'>빠른 액세스</h2>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {quickAccess.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className='flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white shadow-md rounded-xl hover:shadow-lg'
              >
                <div
                  className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold text-xl mb-3`}
                >
                  {item.name.charAt(0)}
                </div>
                <span className='text-sm font-medium text-gray-700'>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className='mt-12 bg-white border-t border-gray-200'>
        <div className='px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8'>
          <div className='md:flex md:items-center md:justify-between'>
            <div className='flex justify-center space-x-6 md:justify-start'>
              <a href='#' className='text-gray-400 hover:text-gray-500'>
                <span>회사 소개</span>
              </a>
              <a href='#' className='text-gray-400 hover:text-gray-500'>
                <span>이용약관</span>
              </a>
              <a href='#' className='text-gray-400 hover:text-gray-500'>
                <span>개인정보처리방침</span>
              </a>
              <a href='#' className='text-gray-400 hover:text-gray-500'>
                <span>고객센터</span>
              </a>
            </div>
            <p className='mt-8 text-sm text-center text-gray-400 md:mt-0 md:text-right'>
              &copy; 2025 그룹웨어 시스템. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
