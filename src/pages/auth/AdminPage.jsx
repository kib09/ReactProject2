import InviteUser from '../../components/InviteUser';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminPage() {
  const { currentUser: user } = useAuth();

  // 예시: user.isAdmin이 true일 때만 접근 허용 (isAdmin 필드는 실제 구현에 맞게 수정)
  if (!user || !user.isAdmin) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <div className='w-full max-w-lg p-8 bg-white rounded shadow'>
        <h1 className='text-2xl font-bold mb-6 text-center'>관리자 페이지</h1>
        <InviteUser />
      </div>
    </div>
  );
}
