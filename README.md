---
# 프로젝트명:  Firebase 기반 일정·공지·메시지·할일 관리 웹앱

## 개요

이 프로젝트는 React와 Vite, Firebase를 기반으로 한 일정, 공지, 메시지, 할 일(Task) 관리 웹 애플리케이션입니다.
관리자 및 일반 사용자가 로그인하여 공지사항, 일정, 연락처, 메시지, 할 일 등을 효율적으로 관리할 수 있습니다.
---

## 주요 기술 스택

- **React**: UI 라이브러리
- **Vite**: 프론트엔드 빌드 도구
- **Firebase**: 인증, Firestore DB, 호스팅 등
- **Zustand**: 상태 관리
- **Styled-components**: CSS-in-JS 스타일링
- **React Router v7**: 라우팅
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **EmailJS**: 초대 메일 발송

---

## 폴더 구조

```
src/
  ├── App.jsx                # 라우팅 및 앱 진입점
  ├── main.jsx               # React DOM 렌더링
  ├── index.css              # 전역 스타일
  ├── firebase.js            # Firebase 초기화 및 내보내기
  ├── assets/                # 정적 리소스
  ├── components/            # 공통 UI 컴포넌트 및 위젯
  │   ├── AnnouncementsWidget.jsx
  │   ├── EventsWidget.jsx
  │   ├── TasksWidget.jsx
  │   ├── InviteUser.jsx
  │   ├── Navbar.jsx
  │   ├── Layout.jsx
  │   ├── UserMenu.jsx
  │   ├── PrivateRoute.jsx
  │   ├── dashboard/
  │   │   └── NoticeWidget.jsx
  │   └── calendar/
  │       └── CalendarCategories.jsx
  ├── context/
  │   └── AuthContext.jsx    # 인증 컨텍스트
  ├── former/                # 폼 및 인증 관련 컴포넌트
  │   ├── AddData.jsx
  │   ├── Home.jsx
  │   ├── Login.jsx
  │   └── useAuthState.jsx
  ├── pages/                 # 주요 페이지(라우트)
  │   ├── HomePage.jsx
  │   ├── NotFoundPage.jsx
  │   ├── MessageListPage.jsx
  │   ├── MessagePage.jsx
  │   ├── ProfilePage.jsx
  │   ├── auth/
  │   │   ├── AdminPage.jsx
  │   │   ├── AuthInit.jsx
  │   │   ├── LoginPage.jsx
  │   │   └── SignupPage.jsx
  │   ├── contacts/
  │   │   └── ContactsPage.jsx
  │   ├── tasks/
  │   │   ├── TasksPage.jsx
  │   │   ├── taskFormPage.jsx
  │   │   ├── TaskDetailPage.jsx
  │   │   └── TaskManagementPage.jsx
  │   ├── notice/
  │   │   ├── NoticeListPage.jsx
  │   │   ├── NoticeFormPage.jsx
  │   │   └── NoticeDetailpage.jsx
  │   └── calendar/
  │       ├── CalendarPage.jsx
  │       ├── DayViewPage.jsx
  │       ├── EventDetailPage.jsx
  │       └── EventFormPage.jsx
  └── store/                 # 전역 상태 관리(zustand)
  │   ├── authStore.jsx
  │   └── noticeStore.jsx
```

##[유저 플로우]
![유저 플로우](public/screenshots/user-flow.png)

---

## 주요 화면

### 1. 로그인 페이지

![로그인](public/screenshots/login.png)

### 2. 대시보드

![대시보드](public/screenshots/main.png)

### 3. 공지사항 목록

![공지사항](public/screenshots/notice.png)

### 4. 일정/캘린더

![캘린더](public/screenshots/calendar.png)

### 5. 할 일(Task) 관리

![할일](public/screenshots/tasks.png)

---

## 주요 기능

- **회원가입/로그인/로그아웃** (Firebase Auth)
- **공지사항 관리** (공지 작성, 수정, 삭제, 목록, 상세)
- **일정/캘린더 관리** (일정 등록, 수정, 삭제, 상세, 카테고리)
- **연락처 관리** (연락처 목록, 상세)
- **메시지** (메시지 목록, 상세)
- **할 일(Task) 관리** (등록, 수정, 삭제, 상세, 관리)
- **관리자 기능** (관리자 계정 생성, 권한 분리)
- **이메일 초대** (EmailJS 연동)
- **반응형 UI** (Tailwind, styled-components)
- **상태 관리** (Zustand)
- **Firebase Hosting 배포**

---

## 기타 참고

- **관리자 계정 생성**: `src/scripts/createAdminUser.js` 참고
- **초대 메일**: EmailJS 사용 (SMTP/SendGrid 미사용)
- **상태 관리**: `src/store/` 내 zustand 스토어 사용
- **라우팅**: `src/App.jsx`에서 React Router로 관리

---
