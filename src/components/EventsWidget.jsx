import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function EventsWidget({ events, userId }) {
  // Firestore에 새 일정 추가
  const handleAdd = async () => {
    const title = prompt('일정 제목을 입력하세요');
    if (!title) return;
    const location = prompt('장소를 입력하세요');
    if (!location) return;
    const date = prompt('날짜와 시간을 입력하세요 (예: 2025-03-20 15:00)');
    if (!date) return;
    try {
      await addDoc(collection(db, 'events'), {
        title,
        location,
        date,
        userId,
        createdAt: serverTimestamp(),
      });
      alert('일정이 추가되었습니다! 새로고침 해주세요.');
    } catch (e) {
      alert('일정 추가 실패: ' + e.message);
    }
  };

  return (
    <div className='overflow-hidden bg-white shadow-lg rounded-2xl'>
      <div className='flex items-center justify-between p-6 bg-gradient-to-r from-green-500 to-green-600'>
        <h2 className='text-xl font-bold text-white'>다가오는 일정</h2>
        <Link to='/calendar' className='text-sm font-medium text-green-100 hover:text-white'>
          캘린더 보기 →
        </Link>
      </div>
      {events.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
          <span>표시할 일정이 없습니다.</span>
        </div>
      ) : (
        <ul className='divide-y divide-gray-100'>
          {events.map((event) => (
            <li key={event.id}>
              <div className='px-6 py-4'>
                <div className='flex justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-900'>{event.title}</p>
                    <p className='mt-1 text-xs text-gray-500'>{event.location}</p>
                  </div>
                  <div className='flex-shrink-0 ml-2'>
                    <div className='flex flex-col items-center justify-center px-3 py-1 rounded-lg bg-indigo-50'>
                      <span className='text-xs font-medium text-indigo-800'>
                        {(event.date?.split(' ')[0]?.split('-')[2] || '') + '일'}
                      </span>
                      <span className='text-xs text-indigo-600'>
                        {event.date?.split(' ')[1] || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className='px-6 py-3 bg-gray-50'>
        <button
          onClick={handleAdd}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50'
        >
          일정 추가
        </button>
      </div>
    </div>
  );
}
