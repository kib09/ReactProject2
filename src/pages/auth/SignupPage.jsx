// src/pages/auth/SignupPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import emailjs from 'emailjs-com';

export default function SignupPage() {


  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    displayName: '',
    department: '',
    position: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tokenValid, setTokenValid] = useState(null); // null: 로딩, false: 유효X, true: 유효
  const [inviteDocId, setInviteDocId] = useState(null);

  // 쿼리스트링 체크 (token 없으면 /login으로 리다이렉트)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setTokenValid(false);
      return;
    }
    // Firestore에서 토큰 유효성 검사
    const checkToken = async () => {
      const q = query(
        collection(db, 'invites'),
        where('token', '==', token),
        where('used', '==', false)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setTokenValid(true);
        setInviteDocId(snapshot.docs[0].id);
      } else {
        setTokenValid(false);
      }
    };
    checkToken();
  }, [searchParams]);

  // 이메일 파라미터 자동 입력
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData((prev) => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (
      !formData.email ||
      !formData.password ||
      !formData.displayName ||
      !formData.department ||
      !formData.position ||
      !formData.phone
    ) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!/^(?=.*[a-zA-Z]).{6,}$/.test(formData.password)) {
      setError('비밀번호는 영문 포함 6자 이상이어야 합니다.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.displayName,
        formData.department,
        formData.position,
        formData.phone
      );
      // 회원가입 성공 시 초대 토큰 used 처리
      if (inviteDocId) {
        await updateDoc(doc(db, 'invites', inviteDocId), { used: true });
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
      const inviteLink = `${window.location.origin}/signup?token=${token}`;
      // EmailJS로 초대 링크 발송
      await emailjs.send(
        'YOUR_SERVICE_ID', // EmailJS 대시보드에서 복사
        'YOUR_TEMPLATE_ID', // EmailJS 대시보드에서 복사
        {
          to_email: email,
          invite_link: inviteLink,
        },
        'YOUR_PUBLIC_KEY' // EmailJS 대시보드에서 복사 (user_xxx)
      );
      setResult('초대장이 이메일로 발송되었습니다!');
      setEmail('');
    } catch (e) {
      setResult('초대 생성/발송 실패: ' + e.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className='flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8'>
        <div className='w-full max-w-md p-10 space-y-8 bg-white shadow-md rounded-xl'>
          <div className='text-center'>
            <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>회원가입 완료!</h2>
            <p className='mt-2 text-sm text-gray-600'>
              회원가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.
            </p>
            <div className='mt-5'>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full'>
                <svg
                  className='w-8 h-8 text-green-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 토큰 검사 중이거나 유효하지 않으면 처리
  if (tokenValid === null) {
    return (
      <div className='flex items-center justify-center min-h-screen'>초대 링크 확인 중...</div>
    );
  }
  if (tokenValid === false) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='p-8 bg-white rounded shadow text-center'>
          <h2 className='text-xl font-bold mb-2'>유효하지 않은 초대 링크입니다.</h2>
          <p className='text-gray-500'>이미 사용된 초대이거나, 잘못된 링크입니다.</p>
          <Link to='/login' className='mt-4 inline-block text-indigo-600 hover:underline'>
            로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div>
          <h2 className='mt-6 text-3xl font-extrabold text-center text-gray-900'>
            그룹웨어 회원가입
          </h2>
          <p className='mt-2 text-sm text-center text-gray-600'>
            이미 계정이 있으신가요?{' '}
            <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
              로그인
            </Link>
          </p>
        </div>

        {error && (
          <div className='p-4 rounded-md bg-red-50'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg
                  className='w-5 h-5 text-red-400'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>{error}</h3>
              </div>
            </div>
          </div>
        )}

        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='-space-y-px rounded-md shadow-sm'>
            <div>
              <label htmlFor='email' className='sr-only'>
                이메일 주소
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='이메일 주소'
                value={formData.email}
                onChange={handleChange}
                readOnly={!!searchParams.get('email')}
              />
            </div>
            <div>
              <label htmlFor='displayName' className='sr-only'>
                이름
              </label>
              <input
                id='displayName'
                name='displayName'
                type='text'
                autoComplete='name'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='이름 (실명)'
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                비밀번호
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='비밀번호 (6자 이상)'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='passwordConfirm' className='sr-only'>
                비밀번호 확인
              </label>
              <input
                id='passwordConfirm'
                name='passwordConfirm'
                type='password'
                autoComplete='new-password'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='비밀번호 확인'
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='department' className='sr-only'>
                부서
              </label>
              <select
                id='department'
                name='department'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                value={formData.department}
                onChange={handleChange}
              >
                <option value='' disabled>부서 선택</option>
                <option value='개발팀'>개발팀</option>
                <option value='마케팅팀'>마케팅팀</option>
                <option value='인사팀'>인사팀</option>
                <option value='관리팀'>관리팀</option>
              </select>
            </div>
            <div>
              <label htmlFor='position' className='sr-only'>
                직책
              </label>
              <input
                id='position'
                name='position'
                type='text'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='직책'
                value={formData.position}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor='phone' className='sr-only'>
                전화번호
              </label>
              <input
                id='phone'
                name='phone'
                type='tel'
                required
                className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='전화번호'
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={loading}
              className='relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
