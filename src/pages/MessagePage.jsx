import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { getDatabase, ref, set, push, onChildAdded, get, update, onValue } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';

// 채널 id 생성 규칙: userA_userB (uid 오름차순)
function getChannelId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

export default function MessagePage() {
  const { userId } = useParams(); // 상대방 uid
  const { currentUser } = useAuth();
  const [channelId, setChannelId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const rtdb = getDatabase();

  // 채널 생성/조회 (RTDB)
  useEffect(() => {
    if (!currentUser || !userId) return;
    const cid = getChannelId(currentUser.uid, userId);
    setChannelId(cid);
    // 채널이 없으면 생성 (members 등록)
    const channelRef = ref(rtdb, `channels/${cid}`);
    get(channelRef).then((snap) => {
      if (!snap.exists()) {
        set(channelRef, {
          members: {
            [currentUser.uid]: true,
            [userId]: true,
          },
          createdAt: Date.now(),
        });
      } else {
        // 혹시 members 누락 시 보정
        update(channelRef, {
          [`members/${currentUser.uid}`]: true,
          [`members/${userId}`]: true,
        });
      }
    });
  }, [currentUser, userId]);

  // 상대방 정보 Firestore에서
  useEffect(() => {
    if (!userId) return;
    getDoc(doc(db, 'users', userId)).then((snap) => {
      if (snap.exists()) setOtherUser({ id: userId, ...snap.data() });
    });
  }, [userId]);

  // 메시지 실시간 구독 (RTDB)
  useEffect(() => {
    if (!channelId) return;
    const msgsRef = ref(rtdb, `channels/${channelId}/messages`);
    setMessages([]); // 새 채널 진입 시 초기화
    const handle = onChildAdded(msgsRef, (snap) => {
      setMessages((prev) => [...prev, { id: snap.key, ...snap.val() }]);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => handle();
  }, [channelId]);

  // 내 메시지 읽음 처리 (상대가 창을 열었을 때)
  useEffect(() => {
    if (!channelId || !currentUser) return;
    const msgsRef = ref(rtdb, `channels/${channelId}/messages`);
    // 내 메시지 중 seen=false인 것만 찾아서 seen: true로 업데이트
    onValue(msgsRef, (snap) => {
      const all = snap.val() || {};
      Object.entries(all).forEach(([id, msg]) => {
        if (msg.sender !== currentUser.uid && !msg.seen) {
          update(ref(rtdb, `channels/${channelId}/messages/${id}`), { seen: true });
        }
      });
    });
  }, [channelId, currentUser]);

  // 메시지 전송 (RTDB)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser || !channelId) return;
    const msgsRef = ref(rtdb, `channels/${channelId}/messages`);
    await push(msgsRef, {
      text: input,
      sender: currentUser.uid,
      createdAt: Date.now(),
      seen: false,
    });
    setInput('');
  };

  if (!currentUser) return <div className='p-8 text-center'>로그인이 필요합니다.</div>;

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <div className='bg-white rounded-2xl shadow p-6 flex flex-col h-[70vh]'>
        <div className='flex items-center gap-3 mb-4'>
          <img
            src={otherUser?.photoURL || '/public/vite.svg'}
            alt='상대 프로필'
            className='w-10 h-10 rounded-full object-cover border'
          />
          <div>
            <div className='font-semibold'>
              {otherUser?.name || otherUser?.displayName || '상대방'}
            </div>
            <div className='text-xs text-gray-500'>{otherUser?.email}</div>
          </div>
        </div>
        <div className='flex-1 overflow-y-auto bg-gray-50 rounded p-3 mb-4'>
          {messages.map((msg) => {
            const isMine = msg.sender === currentUser.uid;
            const showTime = msg.createdAt
              ? new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';
            const showRead = isMine && msg.seen;
            return (
              <div key={msg.id} className={`mb-2 flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className='flex flex-col items-end max-w-xs'>
                  <div
                    className={`px-3 py-2 rounded-xl break-words text-sm shadow ${
                      isMine
                        ? 'bg-indigo-500 text-white self-end'
                        : 'bg-white border text-gray-800 self-start'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className='flex items-center gap-1 mt-1 text-xs text-gray-400'>
                    <span>{showTime}</span>
                    {showRead && <span className='ml-1 text-blue-500'>읽음</span>}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className='flex gap-2'>
          <input
            type='text'
            className='flex-1 border rounded px-3 py-2 text-sm'
            placeholder='메시지 입력...'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button
            type='submit'
            className='px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors'
            disabled={!input.trim()}
          >
            전송
          </button>
        </form>
      </div>
    </div>
  );
}
