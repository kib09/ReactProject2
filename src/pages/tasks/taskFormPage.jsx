import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';

export default function TaskFormPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('진행중');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initLoading, setInitLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchTask = async () => {
        setInitLoading(true);
        try {
          const docRef = doc(db, 'tasks', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setTitle(data.title || '');
            setStatus(data.status || '진행중');
            setDescription(data.description || '');
            setDepartment(data.department || '');
            setAuthorName(data.authorName || '');
          } else {
            setError('작업을 찾을 수 없습니다.');
          }
        } catch {
          setError('작업 정보를 불러오는 데 실패했습니다.');
        }
        setInitLoading(false);
      };
      fetchTask();
    } else {
      // 추가 모드: 내 정보로 초기화
      setDepartment(currentUser?.department || '');
      setAuthorName(currentUser?.displayName || '');
    }
  }, [isEdit, id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        // 수정
        const docRef = doc(db, 'tasks', id);
        await updateDoc(docRef, {
          title,
          status,
          description,
        });
        alert('작업이 수정되었습니다.');
      } else {
        // 추가
        await addDoc(collection(db, 'tasks'), {
          title,
          department: department,
          authorName: authorName,
          assignedTo: currentUser?.uid || '',
          status,
          description,
          createdAt: serverTimestamp(),
          viewCount: 0,
        });
        alert('작업이 추가되었습니다.');
      }
      navigate('/tasks');
    } catch (e) {
      setError('저장 실패: ' + e.message);
    }
    setLoading(false);
  };

  if (initLoading) {
    return <div className='max-w-xl mx-auto px-4 py-8'>로딩 중...</div>;
  }

  return (
    <div className='max-w-xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>{isEdit ? '작업 수정' : '작업 추가'}</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && (
          <div className='mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700'>
            <p>{error}</p>
          </div>
        )}
        <div>
          <label className='block mb-1 font-medium'>제목</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
          >
            <option value='예정'>예정</option>
            <option value='진행중'>진행중</option>
            <option value='완료'>완료</option>
          </select>
        </div>
        <div>
          <label className='block mb-1 font-medium'>설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>부서</label>
          <input
            type='text'
            value={department}
            disabled
            className='w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>작성자</label>
          <input
            type='text'
            value={authorName}
            disabled
            className='w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500'
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='w-full py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:ring-4 focus:ring-indigo-100'
        >
          {loading ? '저장 중...' : '저장'}
        </button>
        <div className='flex justify-end'>
          <Link to='/tasks' className='text-sm text-gray-500 hover:underline'>
            작업 목록으로 돌아가기
          </Link>
        </div>
      </form>
    </div>
  );
}
