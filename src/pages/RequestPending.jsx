import { useParams } from 'react-router-dom';
import AcceptModal from '../components/Modal/Accept';
import { useState } from 'react';

export default function RequestPending() {
  const { requestId } = useParams();
  const [isOpen, setIsOpen] = useState(true); // 자동으로 열림

  return (
    <>
      {isOpen && (
        <AcceptModal
          requestId={requestId}
          onClose={() => setIsOpen(false)}
          onResult={() => {}}
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
