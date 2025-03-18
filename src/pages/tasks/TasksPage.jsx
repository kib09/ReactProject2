// src/pages/tasks/TasksPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', 'todo', 'in-progress', 'completed'

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // 현재 사용자에게 할당된 작업 조회
        const tasksQuery = query(
          collection(db, "tasks"),
          where("assignedTo", "==", currentUser.uid),
          orderBy("dueDate", "asc")
        );

        const snapshot = await getDocs(tasksQuery);

        const tasksList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dueDate: doc.data().dueDate?.toDate() || null,
        }));

        setTasks(tasksList);
        setError(null);
      } catch (err) {
        console.error("작업 목록 로드 오류:", err);
        setError("작업 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  // 필터링된 작업 목록
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 작업</h1>
        <button
          onClick={() => navigate("/tasks/new")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          작업 추가
        </button>
      </div>

      {/* 필터 탭 */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          {[
            { id: "all", name: "전체" },
            { id: "todo", name: "예정됨" },
            { id: "in-progress", name: "진행 중" },
            { id: "completed", name: "완료됨" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`py-4 px-6 font-medium text-sm ${
                filter === tab.id
                  ? "border-b-2 border-indigo-500 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              {tab.id === "all"
                ? ` (${tasks.length})`
                : ` (${tasks.filter((task) => task.status === tab.id).length})`}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-gray-50 p-12 text-center rounded-lg">
          <p className="text-gray-500">표시할 작업이 없습니다.</p>
          <button
            onClick={() => navigate("/tasks/new")}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            새 작업 만들기
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.status === "completed"}
                        onChange={(e) => {
                          e.stopPropagation();
                          // 상태 토글 함수 (구현 예정)
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span
                        className={`ml-3 ${
                          task.status === "completed"
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority === "high"
                          ? "높음"
                          : task.priority === "medium"
                          ? "중간"
                          : "낮음"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "마감일 없음"}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
