import { useState } from 'react';
import '../style/inviteModal.scss';

export default function InviteModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSend = () => {
    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      setSuccess(false);
      return;
    }

    setSuccess(true);
    setError('');
  };

  return (
    <div className="invite-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="invite-modal bg-white p-8 rounded-2xl w-[400px] max-w-full flex flex-col gap-5">
        <h2 className="text-2xl font-bold text-center">협업자 초대</h2>
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 w-full"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm">초대 이메일을 보냈습니다!</p>
        )}
        <div className="flex justify-between mt-4">
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-send" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
