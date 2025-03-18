import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      setError(error.message);
      console.error("Google Login Error:", error);
    }
  };

  const handleOpenModal = () => setShowModal(true); // 모달 열기 함수
  const handleCloseModal = () => setShowModal(false); // 모달 닫기 함수

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleOpenModal}>Google 로그인</button>{" "}
      {/* 버튼 클릭 시 모달 열기 */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* {/ 모달 /} */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={handleCloseModal}>&times;</button>{" "}
            {/* {/ 닫기 버튼 /} */}
            <p>Google 로그인을 진행 중입니다...</p> {/* 로딩 표시 등 */}
            <button onClick={handleGoogleLogin}>Google 로그인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
