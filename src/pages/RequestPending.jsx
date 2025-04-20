import { useParams, useNavigate } from 'react-router-dom';
import AcceptModal from '../components/Modal/Accept';
import { useEffect, useState } from 'react';
import LoginRequired from '../components/Modal/LoginRequired';

export default function RequestPending() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // 자동
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      setIsLogin(false);
      setShowLoginModal(true);
    }
  }, []);

  const handleResult = result => {
    setIsOpen(false);
    if (result === 'accepted') {
      navigate('/petsetting');
    } else {
      navigate('/');
    }
  };

  // 로그인 안 되어 있으면 모달만 렌더링
  if (!isLogin && showLoginModal) {
    return <LoginRequired onClose={() => setShowLoginModal(false)} />;
  }

  return (
    <>
      {isOpen && (
        <AcceptModal
          requestId={requestId}
          onClose={() => {
            setIsOpen(false);
            navigate('/');
          }}
          onResult={handleResult}
        />
      )}
      {!isOpen && (
        <div className="pt-40 text-center text-gray-600">
          요청 모달이 닫혔습니다.
        </div>
      )}
    </>
  );
}
