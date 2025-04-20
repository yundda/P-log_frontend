import { useParams, useNavigate } from 'react-router-dom';
import AcceptModal from '../components/Modal/Accept';
import { useState } from 'react';

export default function RequestPending() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true); // 자동

  const handleResult = result => {
    setIsOpen(false);
    if (result === 'accepted') {
      navigate('/petsetting');
    } else {
      navigate('/');
    }
  };

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
