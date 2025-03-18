// src/components/calendar/CalendarCategories.jsx
import { useState } from "react";

export default function CalendarCategories({ onCategoryChange }) {
  // 캘린더 카테고리 상태
  const [categories, setCategories] = useState([
    { id: "company", name: "회사 일정", color: "#4F46E5", checked: true },
    { id: "dev", name: "개발팀", color: "#059669", checked: true },
    { id: "marketing", name: "마케팅팀", color: "#DC2626", checked: true },
    { id: "hr", name: "인사팀", color: "#D97706", checked: true },
    { id: "personal", name: "내 일정", color: "#7C3AED", checked: true },
  ]);

  // 카테고리 체크박스 변경 핸들러
  const handleCategoryChange = (categoryId) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? { ...category, checked: !category.checked }
        : category
    );

    setCategories(updatedCategories);

    // 상위 컴포넌트에 변경사항 알림
    if (onCategoryChange) {
      onCategoryChange(updatedCategories.filter((cat) => cat.checked));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">캘린더</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              id={`category-${category.id}`}
              type="checkbox"
              checked={category.checked}
              onChange={() => handleCategoryChange(category.id)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div
              className="w-4 h-4 rounded-full ml-2"
              style={{ backgroundColor: category.color }}
            ></div>
            <label
              htmlFor={`category-${category.id}`}
              className="ml-2 block text-sm text-gray-700"
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
