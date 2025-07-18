import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function toDateFormat(val) {
  if (!val) return '';
  let dateObj;
  if (val instanceof Date) dateObj = val;
  else if (val.toDate) dateObj = val.toDate();
  else if (typeof val === 'string' || typeof val === 'number') dateObj = new Date(val);
  else return '';
  const y = dateObj.getFullYear();
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d = dateObj.getDate().toString().padStart(2, '0');
  const hh = dateObj.getHours().toString().padStart(2, '0');
  const mm = dateObj.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

export default function EventsWidget({ events }) {
  // Firestore에 새 일정 추가

  const handleAdd = () => {
    window.location.href = '/calendar/new';
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
              <Link
                to={`/calendar/${event.id}`}
                className='block hover:bg-gray-50 transition-colors'
              >
                <div className='px-6 py-4'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-900'>{event.title}</span>
                    <span className='text-xs text-gray-500'>{toDateFormat(event.start)}</span>
                  </div>
                  <div className='flex items-center justify-between mt-1 text-xs text-gray-500'>
                    <span>장소: {event.location || '-'}</span>
                  </div>
                </div>
              </Link>
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
