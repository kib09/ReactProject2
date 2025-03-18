import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-lg overflow-hidden bg-white shadow-lg rounded-2xl">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h1 className="text-3xl font-bold text-white">404</h1>
          <p className="mt-1 text-indigo-100">페이지를 찾을 수 없습니다</p>
        </div>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-indigo-50">
              <svg
                className="w-20 h-20 text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
              요청하신 페이지를 찾을 수 없습니다
            </h2>
            <p className="text-gray-600">
              페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
              <br />
              URL을 확인하고 다시 시도해 주세요.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <Link
              to="/"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              홈페이지로 이동
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              이전 페이지로 돌아가기
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">도움이 필요하신가요?</p>
            <Link
              to="/help"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              고객센터 문의 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
