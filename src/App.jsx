import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import NoticeListPage from "./pages/notice/NoticeListPage.jsx";
import NoticeDetailPage from "./pages/notice/NoticeDetail.jsx";
import NoticeFormPage from "./pages/notice/NoticeFormPage.jsx";
import CalendarPage from "./pages/calender/CalenderPage.jsx";
import EventDetailPage from "./pages/calender/EventDetailPage.jsx";
import DayViewPage from "./pages/calender/EventDetailPage.jsx";
import EventFormPage from "./pages/calender/EventFormPage.jsx";
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignupPage from "./pages/auth/SignupPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Layout from "./components/Layout.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import TasksPage from "./tasks/TasksPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 공지사항 */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/notice" element={<NoticeListPage />} />
            <Route path="/notice/:id" element={<NoticeDetailPage />} />
            <Route path="/notice/new" element={<NoticeFormPage />} />
            {/* 캘린더 */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/calendar/:id" element={<EventDetailPage />} />
            <Route path="/calendar/day/:date" element={<DayViewPage />} />
            <Route path="/calendar/new" element={<EventFormPage />} />
            <Route path="/calendar/edit/:id" element={<EventFormPage />} />

            <Route path="/tasks" element={<TasksPage />} />
          </Route>
        </Route>
        <Route path="" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}
