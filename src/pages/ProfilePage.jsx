import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [phone, setPhone] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // 전화번호 자동 하이픈 포맷 함수
  function formatPhone(value) {
    // 숫자만 남기기
    const num = value.replace(/[^0-9]/g, '');
    if (num.length < 4) return num;
    if (num.length < 8) return num.replace(/(\d{3})(\d{1,4})/, '$1-$2');
    return num.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
  }

  useEffect(() => {
    if (currentUser) {
      setPhone(formatPhone(currentUser.phone || ''));
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      // Firestore 업데이트
      await updateDoc(doc(db, 'users', currentUser.uid), {
        phone,
        photoURL,
      });
      // Firebase Auth 프로필 업데이트
      await updateProfile(currentUser, { photoURL });
      setSuccess(true);
    } catch (err) {
      setError('저장 실패: ' + err.message);
    }
    setLoading(false);
  };

  if (!currentUser) {
    return <div className='p-8 text-center'>로그인이 필요합니다.</div>;
  }

  return (
    <div className='max-w-lg mx-auto px-4 py-10'>
      <div className='bg-white rounded-2xl shadow p-8'>
        <h1 className='text-2xl font-bold mb-6 text-indigo-700'>내 프로필</h1>
        <form onSubmit={handleSave} className='flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <img
              src={photoURL || '/public/vite.svg'}
              alt='프로필'
              className='w-24 h-24 rounded-full object-cover border mb-2'
            />
            <input
              type='text'
              className='border rounded px-3 py-1 w-full text-sm'
              placeholder='프로필 사진 URL'
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />
            <span className='text-xs text-gray-400'>
              이미지 URL을 입력하세요. (파일 업로드는 추후 지원)
            </span>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>이름</label>
            <input
              type='text'
              className='border rounded px-3 py-2 w-full bg-gray-100 text-gray-500'
              value={currentUser.displayName || currentUser.name || ''}
              disabled
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>이메일</label>
            <input
              type='email'
              className='border rounded px-3 py-2 w-full bg-gray-100 text-gray-500'
              value={currentUser.email}
              disabled
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>전화번호</label>
            <input
              type='text'
              className='border rounded px-3 py-2 w-full'
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder='전화번호 입력'
              maxLength={13}
            />
          </div>
          {error && <div className='text-red-500 text-sm'>{error}</div>}
          {success && <div className='text-green-600 text-sm'>저장되었습니다!</div>}
          <button
            type='submit'
            className='w-full py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60'
            disabled={loading}
          >
            {loading ? '저장 중...' : '저장하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
