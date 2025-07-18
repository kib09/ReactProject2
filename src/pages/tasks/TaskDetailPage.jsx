import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'tasks', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTask({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('작업을 찾을 수 없습니다.');
        }
      } catch {
        setError('작업을 불러오는 데 실패했습니다.');
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('이 작업을 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'tasks', id));
        alert('작업이 삭제되었습니다.');
        navigate('/tasks');
      } catch (e) {
        alert('삭제 실패: ' + e.message);
      }
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-3/4 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/4 mb-8'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded mb-2'></div>
          <div className='h-4 bg-gray-200 rounded w-5/6'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto px-4 py-8'>
        <div className='text-center py-12'>
          <h2 className='text-2xl font-semibold text-gray-800'>오류가 발생했습니다</h2>
          <p className='mt-2 text-gray-600'>{error}</p>
          <Link
            to='/tasks'
            className='mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
          >
            작업 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      {task && (
        <div className='bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100'>
          <div className='p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <h1 className='text-2xl font-bold text-gray-900'>{task.title}</h1>
            </div>
            <div className='flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100'>
              <span>{task.department}</span>
              <span className='mx-1'>•</span>
              <span>{task.authorName}</span>
              <span className='mx-1'>•</span>
              <span>{task.status}</span>
              <span className='mx-1'>•</span>
              <span>
                {task.createdAt && task.createdAt.toDate
                  ? task.createdAt.toDate().toLocaleDateString()
                  : ''}
              </span>
            </div>
            <div className='prose max-w-none mb-6'>
              <p className='whitespace-pre-line text-gray-800'>{task.description}</p>
            </div>
          </div>
          <div className='px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center'>
            <Link to='/tasks' className='text-gray-600 hover:text-gray-900'>
              목록으로
            </Link>
            <div className='flex gap-2'>
              <Link
                to={`/tasks/${task.id}/edit`}
                className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors'
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors'
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
