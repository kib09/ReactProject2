import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('전체');
  const itemsPerPage = 5;
  const totalPages = 1;
  const navigate = useNavigate();

  // Firestore에서 작업 목록 불러오기
  useEffect(() => {
    setLoading(true);
    const fetchTasks = async () => {
      try {
        const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const tasksFromDB = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksFromDB);
        setLoading(false);
      } catch (e) {
        alert('작업 불러오기 실패: ' + e.message);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // 필터링 함수
  const filterTasks = (tasks) => {
    switch (filter) {
      case '내 작업':
        return tasks.filter((task) => task.my);
      case '완료한 작업':
        return tasks.filter((task) => task.status === '완료');
      case '진행중인 작업':
        return tasks.filter((task) => task.status === '진행중');
      default:
        return tasks;
    }
  };

  // 검색 및 정렬 필터링
  const filteredTasks = filterTasks(tasks).filter(
    (task) =>
      (task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.author && task.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
    return 0;
  });
  const currentTasks = sortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // 필터 탭 목록
  const filters = ['전체', '내 작업', '완료한 작업', '진행중인 작업'];

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>작업관리</h1>
        <button
          className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100'
          onClick={() => navigate('/tasks/new')}
        >
          작업 추가
        </button>
      </div>
      {/* 필터 탭 */}
      <div className='mb-6 flex space-x-2'>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100 ${
              filter === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className='mb-6 flex flex-col sm:flex-row gap-4'>
        <form onSubmit={handleSearch} className='flex-1'>
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='제목 또는 작성자로 검색'
              className='w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
            />
            <button
              type='submit'
              className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600'
            >
              🔍
            </button>
          </div>
        </form>
        <div className='w-full sm:w-48'>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
          >
            <option value='latest'>최신순</option>
            <option value='oldest'>오래된순</option>
            <option value='views'>조회수순</option>
          </select>
        </div>
      </div>
      <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
        <div className='divide-y divide-gray-100'>
          {loading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className='px-6 py-4'>
                  <div className='animate-pulse'>
                    <div className='h-5 bg-gray-200 rounded w-3/4 mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                  </div>
                </div>
              ))
          ) : currentTasks.length === 0 ? (
            <div className='px-6 py-12 text-center'>
              <p className='text-gray-500'>작업이 없습니다.</p>
            </div>
          ) : (
            currentTasks.map((task) => (
              <div key={task.id} className='block hover:bg-gray-50 transition-colors'>
                <div className='px-6 py-4'>
                  <h3 className='font-medium text-gray-900 mb-1'>{task.title}</h3>
                  <div className='flex items-center text-xs text-gray-500'>
                    <span>{task.department}</span>
                    <span className='mx-1'>•</span>
                    <span>{task.author}</span>
                    <span className='mx-1'>•</span>
                    <span>
                      {task.createdAt && task.createdAt.seconds
                        ? new Date(task.createdAt.seconds * 1000).toLocaleDateString()
                        : typeof task.createdAt === 'string'
                          ? task.createdAt
                          : ''}
                    </span>
                    <span className='mx-1'>•</span>
                    <span>조회 {task.viewCount || 0}</span>
                    <span className='mx-1'>•</span>
                    <span>{task.status}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* 페이지네이션 */}
        {!loading && currentTasks.length > 0 && (
          <div className='px-6 py-4 border-t border-gray-100 flex justify-center'>
            <nav className='flex items-center space-x-2'>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
