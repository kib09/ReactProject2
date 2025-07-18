import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import NoticeListPage from './pages/notice/NoticeListPage.jsx';
import NoticeDetailPage from './pages/notice/NoticeDetailpage.jsx';
import NoticeFormPage from './pages/notice/NoticeFormPage.jsx';
import CalendarPage from './pages/calendar/CalendarPage.jsx';
import EventDetailPage from './pages/calendar/EventDetailPage.jsx';
import DayViewPage from './pages/calendar/DayViewPage.jsx';
import EventFormPage from './pages/calendar/EventFormPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import SignupPage from './pages/auth/SignupPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import Layout from './components/Layout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TaskFormPage from './pages/tasks/TaskFormPage.jsx';
import TaskDetailPage from './pages/tasks/TaskDetailPage.jsx';
import TaskManagementPage from './pages/tasks/TaskManagementPage.jsx';
import TaskAddPage from './pages/tasks/TaskFormPage.jsx';
import ContactsPage from './pages/contacts/ContactsPage.jsx';
import AdminPage from './pages/auth/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MessagePage from './pages/MessagePage.jsx';
import MessageListPage from './pages/MessageListPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 공지사항 */}

        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/notice' element={<NoticeListPage />} />
            <Route path='/notice/:id' element={<NoticeDetailPage />} />
            <Route path='/notice/:id/edit' element={<NoticeFormPage />} />
            <Route path='/notice/new' element={<NoticeFormPage />} />
            {/* 캘린더 */}

            <Route path='/calendar' element={<CalendarPage />} />
            <Route path='/calendar/:id' element={<EventDetailPage />} />
            <Route path='/calendar/day/:date' element={<DayViewPage />} />
            <Route path='/calendar/new' element={<EventFormPage />} />
            <Route path='/calendar/edit/:id' element={<EventFormPage />} />

            <Route path='/tasks' element={<TaskManagementPage />} />
            <Route path='/tasks/new' element={<TaskAddPage />} />
            <Route path='/tasks/:id' element={<TaskDetailPage />} />
            <Route path='/tasks/:id/edit' element={<TaskFormPage />} />
            <Route path='/contacts' element={<ContactsPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/messages' element={<MessageListPage />} />
            <Route path='/messages/:userId' element={<MessagePage />} />
            <Route path='/admin' element={<AdminPage />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
