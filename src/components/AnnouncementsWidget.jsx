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

export default function AnnouncementsWidget({ announcements, myDepartment }) {
  // 공지사항 작성 페이지로 이동
  const handleAdd = () => {
    window.location.href = '/notice/new';
  };

  return (
    <div className='overflow-hidden bg-white shadow-lg rounded-2xl'>
      <div className='flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 to-blue-600'>
        <h2 className='text-xl font-bold text-white'>공지사항</h2>
        <Link to='/notice' className='text-sm font-medium text-blue-100 hover:text-white'>
          모두 보기 →
        </Link>
      </div>
      {announcements.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-gray-400'>
          <span>표시할 공지사항이 없습니다.</span>
        </div>
      ) : (
        <ul className='divide-y divide-gray-100'>
          {announcements.map((announcement) => {
            const isImportant =
              announcement.department === myDepartment || announcement.department === '전체';
            return (
              <li key={announcement.id}>
                <Link
                  to={`/notice/${announcement.id}`}
                  className='block transition-colors hover:bg-gray-50'
                >
                  <div className='px-6 py-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        {isImportant && (
                          <span className='inline-block w-2 h-2 mr-2 align-middle rounded-full bg-red-500'></span>
                        )}
                        <span
                          className={`text-sm font-medium ${
                            isImportant ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {announcement.title}
                        </span>
                      </div>
                      <div className='flex flex-shrink-0 ml-2 text-xs text-gray-500'>
                        {toDateFormat(announcement.date)}
                      </div>
                    </div>
                    <div className='flex items-center justify-between mt-1 text-xs text-gray-500'>
                      <span>
                        작성자: {announcement.authorName || announcement.author || '-'} /{' '}
                        {announcement.department || '-'}
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
        <button
          onClick={handleAdd}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50'
        >
          공지사항 작성
        </button>
      </div>
    </div>
  );
}
