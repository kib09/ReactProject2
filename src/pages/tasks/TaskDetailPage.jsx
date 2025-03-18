// src/pages/tasks/TaskDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);

        const taskDoc = await getDoc(doc(db, "tasks", id));

        if (!taskDoc.exists()) {
          setError("작업을 찾을 수 없습니다.");
          setLoading(false);
          return;
        }

        const taskData = taskDoc.data();

        // 현재 사용자가 이 작업에 접근할 권한이 있는지 확인
        if (
          taskData.assignedTo !== currentUser.uid &&
          taskData.createdBy !== currentUser.uid
        ) {
          setError("이 작업에 접근할 권한이 없습니다.");
          setLoading(false);
          return;
        }

        const formattedTask = {
          id: taskDoc.id,
          ...taskData,
          dueDate: taskData.dueDate?.toDate() || null,
          createdAt: taskData.createdAt?.toDate() || null,
          updatedAt: taskData.updatedAt?.toDate() || null,
        };

        setTask(formattedTask);
        setFormData({
          title: formattedTask.title || "",
          description: formattedTask.description || "",
          dueDate: formattedTask.dueDate
            ? new Date(formattedTask.dueDate).toISOString().split("T")[0]
            : "",
          priority: formattedTask.priority || "medium",
          status: formattedTask.status || "todo",
        });
      } catch (err) {
        console.error("작업 상세 로드 오류:", err);
        setError("작업 상세를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id && currentUser) {
      fetchTask();
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const taskRef = doc(db, "tasks", id);

      // dueDate를 Date 객체로 변환
      const dueDate = formData.dueDate ? new Date(formData.dueDate) : null;

      await updateDoc(taskRef, {
        title: formData.title,
        description: formData.description,
        dueDate: dueDate,
        priority: formData.priority,
        status: formData.status,
        updatedAt: serverTimestamp(),
      });

      // 작업 데이터 갱신
      const updatedTaskDoc = await getDoc(taskRef);
      const updatedTaskData = updatedTaskDoc.data();

      setTask({
        id: updatedTaskDoc.id,
        ...updatedTaskData,
        dueDate: updatedTaskData.dueDate?.toDate() || null,
        createdAt: updatedTaskData.createdAt?.toDate() || null,
        updatedAt: new Date(), // 서버 타임스탬프가 바로 반영되지 않으므로 현재 시간 사용
      });

      setIsEditing(false);
    } catch (err) {
      console.error("작업 업데이트 오류:", err);
      setError("작업을 업데이트하는 데 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 작업을 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "tasks", id));
      navigate("/tasks");
    } catch (err) {
      console.error("작업 삭제 오류:", err);
      setError("작업을 삭제하는 데 실패했습니다.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const taskRef = doc(db, "tasks", id);

      await updateDoc(taskRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // 상태만 업데이트
      setTask((prev) => ({
        ...prev,
        status: newStatus,
        updatedAt: new Date(),
      }));

      setFormData((prev) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (err) {
      console.error("작업 상태 업데이트 오류:", err);
      setError("작업 상태를 업데이트하는 데 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl px-4 py-8 mx-auto">
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate("/tasks")}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            작업 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto">
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        {isEditing ? (
          // 편집 폼
          <form onSubmit={handleSubmit} className="p-6">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">작업 편집</h1>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  제목
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  설명
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  마감일
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  우선순위
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="low">낮음</option>
                  <option value="medium">중간</option>
                  <option value="high">높음</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  상태
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="todo">예정됨</option>
                  <option value="in-progress">진행 중</option>
                  <option value="completed">완료됨</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                저장
              </button>
            </div>
          </form>
        ) : (
          // 상세 보기
          <div>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  {task?.title}
                </h1>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  >
                    편집
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task?.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : task?.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {task?.priority === "high"
                    ? "높음"
                    : task?.priority === "medium"
                    ? "중간"
                    : "낮음"}
                </span>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    task?.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task?.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task?.status === "completed"
                    ? "완료됨"
                    : task?.status === "in-progress"
                    ? "진행 중"
                    : "예정됨"}
                </span>
                {task?.dueDate && (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold leading-5 text-gray-800 bg-gray-100 rounded-full">
                    마감일: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <h2 className="mb-2 text-lg font-medium text-gray-900">설명</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {task?.description || "설명이 없습니다."}
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <h2 className="mb-3 text-sm font-medium text-gray-700">
                상태 변경
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusChange("todo")}
                  disabled={task?.status === "todo"}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    task?.status === "todo"
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  예정됨
                </button>
                <button
                  onClick={() => handleStatusChange("in-progress")}
                  disabled={task?.status === "in-progress"}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    task?.status === "in-progress"
                      ? "bg-blue-100 text-blue-500 cursor-not-allowed"
                      : "bg-blue-200 text-blue-700 hover:bg-blue-300"
                  }`}
                >
                  진행 중
                </button>
                <button
                  onClick={() => handleStatusChange("completed")}
                  disabled={task?.status === "completed"}
                  className={`px-3 py-1 text-xs font-medium rounded-md ${
                    task?.status === "completed"
                      ? "bg-green-100 text-green-500 cursor-not-allowed"
                      : "bg-green-200 text-green-700 hover:bg-green-300"
                  }`}
                >
                  완료
                </button>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between text-xs text-gray-500">
                <div>
                  {task?.createdAt && (
                    <p>생성: {new Date(task.createdAt).toLocaleString()}</p>
                  )}
                </div>
                <div>
                  {task?.updatedAt && (
                    <p>
                      마지막 수정: {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
