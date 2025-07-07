import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function TaskAddPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState('진행중');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        department,
        author,
        status,
        createdAt: serverTimestamp(),
        viewCount: 0,
        my: true, // 실제 서비스에서는 로그인 사용자 기준으로 처리
      });
      alert('작업이 추가되었습니다.');
      navigate('/tasks');
    } catch (e) {
      setError('작업 추가 실패: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className='max-w-xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>작업 추가</h1>
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
          <label className='block mb-1 font-medium'>부서</label>
          <input
            type='text'
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300'
          />
        </div>
        <div>
          <label className='block mb-1 font-medium'>작성자</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
            <option value='진행중'>진행중</option>
            <option value='완료'>완료</option>
          </select>
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
