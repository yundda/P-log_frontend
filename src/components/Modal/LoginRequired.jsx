import { useNavigate } from 'react-router-dom';

export default function LoginRequired({ onClose }) {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">
        <p className="mb-4 text-lg font-semibold text-gray-800">
          로그인이 필요합니다.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={goToLogin}
            className="bg-plog-main5 text-white px-4 py-2 rounded-md hover:bg-plog-main4"
          >
            로그인하기
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
