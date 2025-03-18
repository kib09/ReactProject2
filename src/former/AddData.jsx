import React, { useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase"; // Firebase 설정 파일 import
import { useNavigate } from "react-router-dom";

export default function AddData() {
  const [newData, setNewData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 로그인 여부 확인
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Firestore에 데이터 추가

          // 여기서 addTest는 테이블 명
          addDoc(collection(db, "addTest"), {
            ...newData,
            userId: user.uid,
          })
            .then(() => {
              navigate("/"); // 데이터 추가 성공 후 홈으로 이동
            })
            .catch((error) => {
              setError("데이터 추가 실패");
              console.error(error);
            });
        } else {
          setError("로그인 후 이용해주세요");
        }
      });
    } catch (err) {
      setError("데이터 추가 실패: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">데이터 추가</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[350px]"
      >
        {/* 이름 입력 필드 */}
        <input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="이름"
          required
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {/* 설명 입력 필드 */}
        <input
          type="text"
          name="description"
          onChange={handleChange}
          placeholder="설명"
          required
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          추가하기
        </button>
      </form>
    </div>
  );
}
