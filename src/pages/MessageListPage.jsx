import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function MessageListPage() {
  const { currentUser } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const rtdb = getDatabase();

  useEffect(() => {
    if (!currentUser) return;
    const channelsRef = ref(rtdb, 'channels');
    const unsub = onValue(channelsRef, async (snap) => {
      const all = snap.val() || {};
      const myChannels = Object.entries(all)
        .filter(([, ch]) => ch.members && ch.members[currentUser.uid])
        .map(([id, ch]) => ({ id, ...ch }));
      // 상대방 정보, 마지막 메시지, 읽지 않은 메시지 개수 가져오기
      const chs = await Promise.all(
        myChannels.map(async (ch) => {
          const otherUid = Object.keys(ch.members).find((uid) => uid !== currentUser.uid);
          let otherUser = null;
          if (otherUid) {
            const userDoc = await getDoc(doc(db, 'users', otherUid));
            if (userDoc.exists()) otherUser = { id: otherUid, ...userDoc.data() };
          }
          // 마지막 메시지
          let lastMsg = null;
          let unreadCount = 0;
          if (ch.messages) {
            const msgArr = Object.entries(ch.messages).map(([id, m]) => ({ id, ...m }));
            msgArr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            lastMsg = msgArr[0];
            unreadCount = msgArr.filter((m) => m.sender !== currentUser.uid && !m.seen).length;
          }
          return {
            id: ch.id,
            otherUser,
            lastMsg,
            unreadCount,
            updatedAt: lastMsg?.createdAt
              ? new Date(lastMsg.createdAt)
              : ch.createdAt
              ? new Date(ch.createdAt)
              : null,
          };
        })
      );
      chs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setChannels(chs);
      setLoading(false);
    });
    return () => unsub();
  }, [currentUser]);

  if (!currentUser) return <div className='p-8 text-center'>로그인이 필요합니다.</div>;
  if (loading) return <div className='p-8 text-center'>불러오는 중...</div>;

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-2xl shadow p-6'>
        <h1 className='text-xl font-bold mb-6 text-indigo-700'>메시지 채널</h1>
        {channels.length === 0 ? (
          <div className='text-gray-400 text-center py-12'>채널이 없습니다.</div>
        ) : (
          <ul className='divide-y'>
            {channels.map((ch) => (
              <li
                key={ch.id}
                className='py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition'
                onClick={() => ch.otherUser && navigate(`/messages/${ch.otherUser.id}`)}
              >
                <img
                  src={ch.otherUser?.photoURL || '/public/vite.svg'}
                  alt='상대 프로필'
                  className='w-12 h-12 rounded-full object-cover border'
                />
                <div className='flex-1 min-w-0'>
                  <div className='font-semibold truncate flex items-center gap-2'>
                    {ch.otherUser?.name || ch.otherUser?.displayName || '상대방'}
                    {ch.unreadCount > 0 && (
                      <span className='inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-1'></span>
                    )}
                  </div>
                  <div className='text-xs text-gray-500 truncate'>
                    {ch.lastMsg?.text || '대화를 시작해보세요!'}
                  </div>
                </div>
                <div className='text-xs text-gray-400 ml-2'>
                  {ch.updatedAt
                    ? ch.updatedAt.toLocaleString('ko-KR', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : ''}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
