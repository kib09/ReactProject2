import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function generateToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function InviteUser() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const token = generateToken();
      await addDoc(collection(db, 'invites'), {
        email,
        token,
        used: false,
        createdAt: serverTimestamp(),
      });
      const inviteLink = `${window.location.origin}/signup?token=${token}&email=${email}`;
      // EmailJS로 초대 링크 발송 (async 함수 안에서 await 사용)
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          to_email: email,
          invite_link: inviteLink,
        },
        PUBLIC_KEY
      );
      setResult('초대장이 이메일로 발송되었습니다!');
      setEmail('');
    } catch (e) {
      setResult('초대 생성/발송 실패: ' + e.message);
    }
    setLoading(false);
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded shadow'>
      <h2 className='text-lg font-bold mb-4'>회원 초대</h2>
      <form onSubmit={handleInvite} className='flex flex-col gap-2'>
        <input
          type='email'
          placeholder='초대할 이메일 입력'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='border px-3 py-2 rounded'
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50'
        >
          {loading ? '초대 생성 중...' : '초대장 생성'}
        </button>
      </form>
      {result && <div className='mt-4 text-sm break-all'>{result}</div>}
    </div>
  );
}
