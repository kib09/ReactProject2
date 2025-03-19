// src/pages/calendar/EventFormPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function EventFormPage() {
  const navigate = useNavigate();

  // 폼 상태
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "2025-03-13",
    startTime: "09:00",
    endDate: "2025-03-13",
    endTime: "10:00",
    category: "personal",
    isPrivate: false,
    isAllDay: false,
    isRecurring: false,
    recurrenceType: "weekly",
    attendees: "",
    reminderTime: "30",
    reminderType: "popup",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 여기서 데이터를 처리하고 저장합니다.
    // 실제로는 API 호출이나 Firebase 저장이 이루어집니다.

    // 성공 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      alert("일정이 성공적으로 저장되었습니다.");
      navigate("/calendar");
    }, 1000);
  };

  // 카테고리 옵션
  const categoryOptions = [
    { id: "company", name: "회사 일정", color: "#4F46E5" },
    { id: "dev", name: "개발팀", color: "#059669" },
    { id: "marketing", name: "마케팅팀", color: "#DC2626" },
    { id: "hr", name: "인사팀", color: "#D97706" },
    { id: "personal", name: "내 일정", color: "#7C3AED" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">새 일정 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="일정 제목"
              />
            </div>

            {/* 카테고리 선택 */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                캘린더 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 appearance-none"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: categoryOptions.find(
                        (c) => c.id === formData.category
                      )?.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 날짜 및 시간 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  시작 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  시작 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  disabled={formData.isAllDay}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  종료 날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  종료 시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  disabled={formData.isAllDay}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                />
              </div>
            </div>

            {/* 종일 일정 체크박스 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAllDay"
                name="isAllDay"
                checked={formData.isAllDay}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isAllDay"
                className="ml-2 block text-sm text-gray-700"
              >
                종일 일정
              </label>
            </div>

            {/* 장소 */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                장소
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="회의실, 화상회의 등"
              />
            </div>

            {/* 설명 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="일정에 대한 설명"
              ></textarea>
            </div>

            {/* 반복 설정 */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isRecurring"
                  className="ml-2 block text-sm text-gray-700"
                >
                  반복 일정
                </label>
              </div>

              {formData.isRecurring && (
                <div className="mt-2 pl-6">
                  <select
                    id="recurrenceType"
                    name="recurrenceType"
                    value={formData.recurrenceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  >
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                    <option value="yearly">매년</option>
                  </select>
                </div>
              )}
            </div>

            {/* 참석자 */}
            <div>
              <label
                htmlFor="attendees"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                참석자
              </label>
              <input
                type="text"
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                placeholder="참석자 이메일 (쉼표로 구분)"
              />
              <p className="mt-1 text-xs text-gray-500">
                참석자 이메일을 쉼표(,)로 구분하여 입력하세요.
              </p>
            </div>

            {/* 알림 설정 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                알림
              </label>
              <div className="flex gap-2">
                <select
                  id="reminderTime"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                >
                  <option value="0">정각</option>
                  <option value="5">5분 전</option>
                  <option value="10">10분 전</option>
                  <option value="15">15분 전</option>
                  <option value="30">30분 전</option>
                  <option value="60">1시간 전</option>
                  <option value="120">2시간 전</option>
                  <option value="1440">1일 전</option>
                </select>

                <select
                  id="reminderType"
                  name="reminderType"
                  value={formData.reminderType}
                  onChange={handleChange}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                >
                  <option value="popup">팝업</option>
                  <option value="email">이메일</option>
                </select>
              </div>
            </div>

            {/* 비공개 설정 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isPrivate"
                className="ml-2 block text-sm text-gray-700"
              >
                비공개 일정
              </label>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="mt-8 flex justify-end gap-3">
            <Link
              to="/calendar"
              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-5 py-2.5 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  저장 중...
                </div>
              ) : (
                "저장"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
