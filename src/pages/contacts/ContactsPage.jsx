import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// 부서별 색상 (CalendarCategories와 동일하게 하드코딩)
const DEPARTMENT_COLORS = {
  '회사 일정': '#4F46E5',
  개발팀: '#059669',
  마케팅팀: '#DC2626',
  인사팀: '#D97706',
  '내 일정': '#7C3AED',
};

export default function ContactsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [tasksMap, setTasksMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndTasks = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        const tasksMapTemp = {};
        for (const user of usersList) {
          const tasksQ = query(
            collection(db, 'tasks'),
            where('assignedTo', '==', user.id),
            where('status', '==', '진행중')
          );
          const tasksSnapshot = await getDocs(tasksQ);
          tasksMapTemp[user.id] = tasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        }
        setTasksMap(tasksMapTemp);
      } catch (e) {
        alert('유저/작업 정보 불러오기 실패: ' + e.message);
      }
      setLoading(false);
    };
    fetchUsersAndTasks();
  }, []);

  if (loading) {
    return <div className='p-8 text-center'>불러오는 중...</div>;
  }

  // 내 정보와 타인 분리
  const myUser = users.find((u) => u.id === currentUser?.uid);
  const otherUsers = users.filter((u) => u.id !== currentUser?.uid);

  // 부서별 그룹핑
  const departments = {};
  otherUsers.forEach((user) => {
    const dept = user.department || '기타';
    if (!departments[dept]) departments[dept] = [];
    departments[dept].push(user);
  });

  // 카드 렌더 함수
  const renderUserCard = (user, isMe = false, deptColor = undefined) => (
    <div
      key={user.id}
      className={`rounded-2xl shadow p-6 flex flex-col gap-2 relative bg-white`}
      style={deptColor ? { borderLeft: `8px solid ${deptColor}` } : {}}
    >
      <div className='flex items-center gap-3 mb-2'>
        <div
          className='w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg'
          style={{ backgroundColor: deptColor || '#E0E7FF', color: deptColor ? '#fff' : '#4F46E5' }}
        >
          {(user.name || user.displayName || '-').charAt(0)}
        </div>
        <div>
          <div className='text-base font-semibold text-gray-900'>
            {user.name || user.displayName || '-'}
          </div>
          <div className='text-xs text-gray-500'>{user.email || '-'}</div>
        </div>
      </div>
      <div className='flex flex-wrap gap-2 text-xs text-gray-600'>
        <span>부서: {user.department || '-'}</span>
        <span>직책: {user.position || '-'}</span>
        <span>전화: {user.phone || '-'}</span>
      </div>
      <div className='mt-2'>
        <div className='text-xs text-gray-500 mb-1'>진행중인 작업</div>
        {tasksMap[user.id] && tasksMap[user.id].length > 0 ? (
          <ul className='list-disc list-inside text-xs text-gray-700'>
            {tasksMap[user.id].map((task) => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <span className='text-gray-400 text-xs'>없음</span>
        )}
      </div>
      {isMe ? (
        <div className='mt-4'>
          <button
            className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 transition-colors'
            onClick={() => navigate('/profile')}
          >
            내 정보 수정
          </button>
        </div>
      ) : (
        <div className='mt-4'>
          <button
            className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 transition-colors'
            onClick={() => navigate(`/messages/${user.id}`)}
          >
            메시지
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between p-6 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl shadow-lg mb-8'>
        <h1 className='text-xl font-bold text-white'>주소록</h1>
      </div>
      {/* 내 정보 */}
      {myUser && (
        <div className='mb-8'>
          {renderUserCard(myUser, true, DEPARTMENT_COLORS[myUser.department] || '#4F46E5')}
        </div>
      )}
      {/* 부서별 그룹핑 */}
      {Object.entries(departments).map(([dept, users]) => (
        <div key={dept} className='mb-8'>
          <div className='flex items-center mb-3'>
            <div
              className='w-3 h-3 rounded-full mr-2'
              style={{ backgroundColor: DEPARTMENT_COLORS[dept] || '#A3A3A3' }}
            ></div>
            <span className='font-semibold' style={{ color: DEPARTMENT_COLORS[dept] || '#A3A3A3' }}>
              {dept}
            </span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {users.map((user) => renderUserCard(user, false, DEPARTMENT_COLORS[dept] || '#A3A3A3'))}
          </div>
        </div>
      ))}
    </div>
  );
}
