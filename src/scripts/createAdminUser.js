import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase 설정 (firebase.js의 config와 동일하게 맞춰주세요)
const firebaseConfig = {
  apiKey: 'AIzaSyDzOrbnFK-2L_uVP-ZgG1V6wHcpbPYHacI',
  authDomain: 'kibproject-63d04.firebaseapp.com',
  projectId: 'kibproject-63d04',
  storageBucket: 'kibproject-63d04.firebasestorage.app',
  messagingSenderId: '196544810887',
  appId: '1:196544810887:web:a839308d94e992db974d22',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdminUser() {
  try {
    // 1. 인증 계정 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin22@example.com', // 원하는 이메일
      'rha090909' // 원하는 비밀번호
    );
    const user = userCredential.user;

    // 2. users 컬렉션에 정보 저장
    await setDoc(doc(db, 'users', user.uid), {
      displayName: '관리자',
      email: 'admin22@example.com',
      department: '관리부',
      position: '팀장',
      phone: '010-1234-5678',
      isAdmin: true,
      role: 'admin',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      settings: {
        theme: 'system',
        notifications: {
          email: true,
          push: true,
          desktop: true,
        },
        language: 'ko',
      },
    });
    console.log('테스트 관리자 계정 생성 완료!');
  } catch (err) {
    console.error('관리자 계정 생성 실패:', err);
  }
}

createAdminUser();
