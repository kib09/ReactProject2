// src/components/dashboard/TasksWidget.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function TasksWidget() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // 작업 데이터 로드
  useEffect(() => {
    const fetchTasks = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // 인덱스 없이도 작동하는 간단한 쿼리
        const tasksQuery = query(
          collection(db, "tasks"),
          where("assignedTo", "==", currentUser.uid)
        );

        const snapshot = await getDocs(tasksQuery);

        if (snapshot.empty) {
          console.log("작업이 없습니다");
          setTasks([]);
        } else {
          const tasksList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate() || null,
            createdAt: doc.data().createdAt?.toDate() || null,
          }));

          // 클라이언트 측에서 정렬 (최신 작업 먼저)
          tasksList.sort((a, b) => {
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;
            return b.createdAt - a.createdAt;
          });

          // 최대 4개만 표시
          const limitedTasks = tasksList.slice(0, 4);

          console.log("불러온 작업:", limitedTasks);
          setTasks(limitedTasks);
        }
      } catch (err) {
        console.error("작업 로드 오류:", err);
        setError("작업을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentUser]);

  // 작업 상태 토글
  const handleStatusToggle = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === "completed" ? "todo" : "completed";

      // Firestore 업데이트
      await updateDoc(doc(db, "tasks", taskId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // 로컬 상태 업데이트
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("작업 상태 업데이트 오류:", err);
      setError("작업 상태를 업데이트하는 데 실패했습니다.");
    }
  };

  return (
    <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 to-purple-600">
        <h2 className="text-xl font-bold text-white">내 작업</h2>
        <Link
          to="/tasks"
          className="text-sm font-medium text-purple-100 hover:text-white"
        >
          모두 보기 →
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-6">
          <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>표시할 작업이 없습니다.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {tasks.map((task) => (
            <li key={task.id}>
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id={`task-${task.id}`}
                      name={`task-${task.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={task.status === "completed"}
                      onChange={() => handleStatusToggle(task.id, task.status)}
                    />
                    <Link
                      to={`/tasks/${task.id}`}
                      className={`ml-3 text-sm ${
                        task.status === "completed"
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </Link>
                  </div>
                  <div className="flex flex-shrink-0 ml-2">
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
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    마감일:{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "없음"}
                  </span>
                  <span
                    className={`text-xs ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {task.status === "completed"
                      ? "완료됨"
                      : task.status === "in-progress"
                      ? "진행 중"
                      : "예정됨"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="px-6 py-3 bg-gray-50">
        <Link
          to="/tasks/new"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          작업 추가
        </Link>
      </div>
    </div>
  );
}
