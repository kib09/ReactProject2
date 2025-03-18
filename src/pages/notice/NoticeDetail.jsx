// src/pages/notice/NoticeDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function NoticeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시 데이터 로드 (나중에 Firebase로 대체)
  useEffect(() => {
    setLoading(true);
    setError(null);

    // 데이터 로딩 시뮬레이션
    setTimeout(() => {
      // 임시 데이터
      const dummyNotices = {
        1: {
          id: "1",
          title: "2023년 4분기 회사 목표 안내",
          content: `안녕하세요, 경영지원팀입니다.

2023년 4분기 회사 목표를 다음과 같이 안내드립니다.

1. 매출 목표: 전년 동기 대비 15% 성장
2. 신규 고객 유치: 20개 업체 이상
3. 고객 만족도: 90점 이상 유지
4. 신규 서비스 출시: 12월 중 베타 버전 오픈

각 팀별 세부 목표는 팀장을 통해 전달될 예정입니다.
모두 화이팅!`,
          author: "김경영",
          department: "경영지원팀",
          createdAt: "2023-10-15",
          updatedAt: null,
          isImportant: true,
          viewCount: 129,
          attachments: [
            { id: "a1", name: "4분기_회사목표.pdf", size: "2.4MB" },
            { id: "a2", name: "팀별_세부목표.xlsx", size: "1.1MB" },
          ],
        },
        2: {
          id: "2",
          title: "신규 프로젝트 킥오프 미팅 일정 공지",
          content: `개발팀 전체 인원 참석 바랍니다.

일시: 2023년 10월 20일 오후 2시
장소: 대회의실
안건: 신규 프로젝트 범위 및 일정 논의

사전에 기획안을 검토해주시기 바랍니다.`,
          author: "박개발",
          department: "개발팀",
          createdAt: "2023-10-12",
          updatedAt: null,
          isImportant: false,
          viewCount: 96,
          attachments: [
            { id: "a3", name: "프로젝트_기획안.pdf", size: "3.7MB" },
          ],
        },
        3: {
          id: "3",
          title: "사내 네트워크 점검 안내 (10/20)",
          content: `안녕하세요, IT인프라팀입니다.

원활한 업무 환경 제공을 위한 네트워크 점검이 있을 예정입니다.

일시: 2023년 10월 20일 오전 7시 ~ 9시
영향: 해당 시간 동안 인터넷 및 사내 시스템 접속 불가

긴급 작업이 필요한 경우 사전에 IT인프라팀으로 연락 바랍니다.
불편을 드려 죄송합니다.`,
          author: "이인프라",
          department: "IT인프라팀",
          createdAt: "2023-10-10",
          updatedAt: "2023-10-11",
          isImportant: true,
          viewCount: 113,
          attachments: [],
        },
      };

      if (dummyNotices[id]) {
        setNotice(dummyNotices[id]);
        setLoading(false);
      } else {
        setError("공지사항을 찾을 수 없습니다.");
        setLoading(false);
      }
    }, 800);
  }, [id]);

  // 삭제 핸들러 (나중에 Firebase 연동)
  const handleDelete = () => {
    if (window.confirm("이 공지사항을 삭제하시겠습니까?")) {
      // 삭제 로직 구현 예정
      alert("공지사항이 삭제되었습니다.");
      navigate("/notice");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800">
            오류가 발생했습니다
          </h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link
            to="/notice"
            className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            공지사항 목록으로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {notice && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              {notice.isImportant && (
                <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                  중요
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {notice.title}
              </h1>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
              <span>{notice.department}</span>
              <span className="mx-1">•</span>
              <span>{notice.author}</span>
              <span className="mx-1">•</span>
              <span>{notice.createdAt}</span>
              {notice.updatedAt && (
                <>
                  <span className="mx-1">•</span>
                  <span>수정됨: {notice.updatedAt}</span>
                </>
              )}
              <span className="mx-1">•</span>
              <span>조회 {notice.viewCount}</span>
            </div>

            {/* 공지사항 내용 */}
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-line text-gray-800">
                {notice.content}
              </p>
            </div>

            {/* 첨부 파일 */}
            {notice.attachments && notice.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  첨부 파일
                </h3>
                <div className="space-y-2">
                  {notice.attachments.map((file) => (
                    <a
                      key={file.id}
                      href="#"
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-500">📎</span>
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {file.size}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 하단 액션 버튼 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <Link to="/notice" className="text-gray-600 hover:text-gray-900">
              목록으로
            </Link>

            <div className="flex gap-2">
              <Link
                to={`/notice/edit/${notice.id}`}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                수정
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
