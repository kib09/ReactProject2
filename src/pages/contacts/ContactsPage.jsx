import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export default function ContactsPage() {
  const [users, setUsers] = useState([]);
  const [tasksMap, setTasksMap] = useState({}); // {userId: [진행중 작업들]}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndTasks = async () => {
      setLoading(true);
      try {
        // 1. 전체 유저 불러오기
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        // 2. 각 유저별 진행중인 작업 불러오기
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

  const handleMessageClick = (user) => {
    alert(`${user.name || user.displayName || user.email}님과의 메시지 채널은 추후 지원됩니다.`);
  };

  if (loading) {
    return <div className='p-8 text-center'>불러오는 중...</div>;
  }

  return (
    <div className='max-w-5xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>주소록</h1>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white rounded-xl shadow border'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='px-4 py-2'>이름</th>
              <th className='px-4 py-2'>이메일</th>
              <th className='px-4 py-2'>부서</th>
              <th className='px-4 py-2'>직책</th>
              <th className='px-4 py-2'>전화번호</th>
              <th className='px-4 py-2'>진행중인 작업</th>
              <th className='px-4 py-2'>메시지</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='border-t'>
                <td className='px-4 py-2'>{user.name || user.displayName || '-'}</td>
                <td className='px-4 py-2'>{user.email || '-'}</td>
                <td className='px-4 py-2'>{user.department || '-'}</td>
                <td className='px-4 py-2'>{user.position || '-'}</td>
                <td className='px-4 py-2'>{user.phone || '-'}</td>
                <td className='px-4 py-2'>
                  {tasksMap[user.id] && tasksMap[user.id].length > 0 ? (
                    <ul className='list-disc list-inside text-xs text-gray-700'>
                      {tasksMap[user.id].map((task) => (
                        <li key={task.id}>{task.title}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className='text-gray-400 text-xs'>없음</span>
                  )}
                </td>
                <td className='px-4 py-2'>
                  <button
                    className='px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-xs'
                    onClick={() => handleMessageClick(user)}
                  >
                    메시지
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
