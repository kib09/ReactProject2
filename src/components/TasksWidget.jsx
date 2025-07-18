// src/components/dashboard/TasksWidget.jsx
import { Link } from 'react-router-dom';

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
  return `${y}-${m}-${d}`;
}

export default function TasksWidget({ tasks = [], myUid }) {
  return (
    <div className='overflow-hidden bg-white shadow-lg rounded-2xl'>
      <div className='flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-purple-600'>
        <h2 className='text-xl font-bold text-white'>내 작업</h2>
        <Link to='/tasks' className='text-sm font-medium text-purple-100 hover:text-white'>
          모두 보기 →
        </Link>
      </div>
      {tasks.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
          <span>표시할 작업이 없습니다.</span>
        </div>
      ) : (
        <ul className='divide-y divide-gray-100'>
          {tasks.map((task) => {
            const isMine = task.assignedTo === myUid;
            const isInProgress = task.status === '진행중' || task.status === 'in-progress';
            const isPlanned = task.status === '예정' || task.status === 'planned';
            return (
              <li key={task.id}>
                <Link to={`/tasks/${task.id}`} className='block hover:bg-gray-50 transition-colors'>
                  <div className='px-6 py-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        {isMine && (
                          <span
                            className='inline-block w-2 h-2 mr-2 align-middle rounded-full bg-red-500'
                            title='내 작업'
                          ></span>
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isInProgress
                              ? 'text-red-600'
                              : isPlanned
                              ? 'text-black'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      <div className='flex flex-shrink-0 ml-2'>
                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'>
                          {task.status === '완료' || task.status === 'completed'
                            ? '완료'
                            : isInProgress
                            ? '진행중'
                            : '예정'}
                        </span>
                      </div>
                    </div>
                    <div className='flex items-center justify-between mt-1 text-xs text-gray-500'>
                      <span>작성일: {toDateFormat(task.createdAt) || '없음'}</span>
                      <span>
                        작성자: {task.authorName || '-'} / {task.department || '-'}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <div className='px-6 py-3 bg-gray-50'>
        <Link
          to='/tasks/new'
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50'
        >
          작업 추가
        </Link>
      </div>
    </div>
  );
}
